#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <Preferences.h>
#include <HardwareSerial.h>
#include <TinyGPS++.h>

// --- PREFERENCIAS (Memoria no volatil) ---
Preferences preferences;
String nombrePiloto = "Desconocido";
String datosMedicos = "Sin datos";
String numeroEmergencia = "";

// --- TIMEOUT BLUETOOTH ---
unsigned long bleStartTime = 0;
const unsigned long BLE_TIMEOUT = 120000; // 2 minutos en milisegundos
bool bleActivo = true;
bool dispositivoConectado = false;

// --- GPS Y GSM ---
HardwareSerial SerialGPS(2); // RX=16, TX=17
HardwareSerial SerialGSM(1); // RX=4, TX=5
TinyGPSPlus gps;

// Variables de telemetria para enviar a la app
float bateriaPorcentaje = 100.0;
String bateriaSalud = "BUENA";
float velocidadActual = 0.0;
float velocidadMaxima = 0.0;

// --- CONFIGURACION BLE ---
#define SERVICE_UUID           "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHAR_RX_DATOS_MEDICOS  "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CHAR_TX_TELEMETRIA     "8a78cb84-8255-46eb-a4d6-f9d224b7a13c"

BLECharacteristic *pCharTxTelemetria;

// Callbacks para cuando la App se conecta/desconecta
class ServidorCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      dispositivoConectado = true;
      Serial.println("APP CONECTADA POR BLUETOOTH!");
    }
    void onDisconnect(BLEServer* pServer) {
      dispositivoConectado = false;
      Serial.println("APP DESCONECTADA.");
    }
};

// Callbacks para recibir datos medicos desde la App
class RXDatosMedicosCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      String valorRecibido = pCharacteristic->getValue().c_str();
      if (valorRecibido.length() > 0) {
        // Formato esperado: "Nombre|DatosMedicos|NumeroEmergencia"
        int sep1 = valorRecibido.indexOf('|');
        int sep2 = valorRecibido.lastIndexOf('|');
        
        if(sep1 != -1 && sep2 != -1 && sep1 != sep2) {
            nombrePiloto = valorRecibido.substring(0, sep1);
            datosMedicos = valorRecibido.substring(sep1 + 1, sep2);
            numeroEmergencia = valorRecibido.substring(sep2 + 1);

            // Guardar permanentemente en ESP32
            preferences.begin("piloto_data", false);
            preferences.putString("nombre", nombrePiloto);
            preferences.putString("medico", datosMedicos);
            preferences.putString("numero", numeroEmergencia);
            preferences.end();
            
            Serial.println("Datos guardados en memoria no volatil:");
            Serial.println(nombrePiloto + " - " + datosMedicos + " - " + numeroEmergencia);
        }
      }
    }
};

void setup() {
  Serial.begin(115200);
  
  // Cargar datos medicos de la memoria EEPROM/Flash
  preferences.begin("piloto_data", true); // true = Read Only
  nombrePiloto = preferences.getString("nombre", "Desconocido");
  datosMedicos = preferences.getString("medico", "Sin datos");
  numeroEmergencia = preferences.getString("numero", "");
  preferences.end();

  // Iniciar GPS y GSM
  SerialGPS.begin(9600, SERIAL_8N1, 16, 17);
  SerialGSM.begin(9600, SERIAL_8N1, 4, 5);
  
  // Configurar modem en modo texto
  SerialGSM.println("AT+CMGF=1"); 
  
  // Iniciar Bluetooth
  Serial.println("Iniciando Bluetooth BLE (Timeout: 2 mins)...");
  BLEDevice::init("Moto_Telemetria");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServidorCallbacks());
  
  BLEService *pService = pServer->createService(SERVICE_UUID);
  
  // Característica para enviar telemetria (Bateria, Vel)
  pCharTxTelemetria = pService->createCharacteristic(
                      CHAR_TX_TELEMETRIA,
                      BLECharacteristic::PROPERTY_NOTIFY
                    );
  pCharTxTelemetria->addDescriptor(new BLE2902());
  
  // Característica para recibir info médica
  BLECharacteristic *pCharRxDatos = pService->createCharacteristic(
                                         CHAR_RX_DATOS_MEDICOS,
                                         BLECharacteristic::PROPERTY_WRITE
                                       );
  pCharRxDatos->setCallbacks(new RXDatosMedicosCallbacks());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  BLEDevice::startAdvertising();

  bleStartTime = millis();
}

void loop() {
  unsigned long currentMillis = millis();

  // 1. MANEJO DE TIMEOUT BLUETOOTH
  if (bleActivo && !dispositivoConectado) {
    if (currentMillis - bleStartTime >= BLE_TIMEOUT) {
      Serial.println("Han pasado 2 minutos sin conexion. Apagando Bluetooth para ahorrar bateria...");
      BLEDevice::deinit();
      bleActivo = false;
    }
  }

  // 2. LECTURA CONTINUA GPS
  while (SerialGPS.available() > 0) {
    if (gps.encode(SerialGPS.read())) {
      if (gps.location.isUpdated()) {
        velocidadActual = gps.speed.kmph();
        if (velocidadActual > velocidadMaxima) {
          velocidadMaxima = velocidadActual;
        }
      }
    }
  }

  // 3. ENVIAR TELEMETRIA A APP SI ESTA CONECTADA
  // Enviamos datos cada 1 segundo (usando millis, sin bloqueos)
  static unsigned long ultimoEnvioBLE = 0;
  if (dispositivoConectado && (currentMillis - ultimoEnvioBLE >= 1000)) {
    ultimoEnvioBLE = currentMillis;
    // Formato de envio: Bat%|SaludBat|VelActual|VelMax
    String datosTx = String(bateriaPorcentaje) + "|" + bateriaSalud + "|" + String(velocidadActual) + "|" + String(velocidadMaxima);
    pCharTxTelemetria->setValue(datosTx.c_str());
    pCharTxTelemetria->notify();
  }
}

// =========================================================================
// FUNCIÓN PARA ENVIAR SMS EN CASO DE CHOQUE (Será llamada por la lógica IMU)
// =========================================================================
void enviarAlertaAccidenteSMS() {
  if (numeroEmergencia == "") {
    Serial.println("No hay numero de emergencia configurado. No se envio SMS.");
    return;
  }

  // Construir mensaje SMS
  String mensaje = "ALERTA DE ACCIDENTE DE MOTO!\n";
  mensaje += "Piloto: " + nombrePiloto + "\n";
  mensaje += "Datos: " + datosMedicos + "\n";
  
  if (gps.location.isValid()) {
    mensaje += "Ubicacion: http://maps.google.com/maps?q=" + String(gps.location.lat(), 6) + "," + String(gps.location.lng(), 6);
  } else {
    mensaje += "Ubicacion GPS no disponible.";
  }

  // Enviar comandos GSM usando la libreria basica (modo no bloqueante)
  Serial.println("Enviando SMS de Alerta...");
  SerialGSM.print("AT+CMGS=\"");
  SerialGSM.print(numeroEmergencia);
  SerialGSM.println("\"");
  
  // Esperar a que el modulo acepte el comando usando un delay minimo o maquina de estado
  // Para simplicidad aca usamos un while seguro con millis()
  unsigned long startWait = millis();
  while(millis() - startWait < 500) { /* Espera segura sin frenar interrupciones críticas */ }
  
  SerialGSM.print(mensaje);
  
  startWait = millis();
  while(millis() - startWait < 100) {}
  
  SerialGSM.write(26); // Ctrl+Z
  Serial.println("SMS enviado al numero: " + numeroEmergencia);
}
