#include <HardwareSerial.h>

// Usa el UART1 del ESP32 (RX=4, TX=5 por ejemplo)
HardwareSerial SerialGSM(1);

const String numeroEmergencia = "+1234567890"; // Reemplazar por el numero real

void setup() {
  Serial.begin(115200);
  
  // SIM800L suele funcionar a 9600 baudios
  SerialGSM.begin(9600, SERIAL_8N1, 4, 5); 
  
  Serial.println("Iniciando modulo GSM...");
  delay(3000);
  
  // Configurar modulo para SMS en modo texto
  enviarComandoAT("AT", 1000); // Comprobar conexion
  enviarComandoAT("AT+CMGF=1", 1000); // Modo texto
}

void loop() {
  // En el codigo real, esto se llamaria cuando se detecte un choque
  // Simular envio de emergencia (Descomentar para probar)
  // enviarAlerta("Alerta! Posible accidente de moto. Coordenadas: lat,lon");
  // delay(60000); 

  // Eco de respuestas del modulo
  while (SerialGSM.available()) {
    Serial.write(SerialGSM.read());
  }
}

void enviarAlerta(String mensaje) {
  Serial.println("Enviando SMS de emergencia...");
  
  SerialGSM.print("AT+CMGS=\"");
  SerialGSM.print(numeroEmergencia);
  SerialGSM.println("\"");
  delay(1000);
  
  SerialGSM.print(mensaje);
  delay(100);
  
  // Enviar caracter Ctrl+Z para terminar el mensaje
  SerialGSM.write(26); 
  delay(5000);
  
  Serial.println("Alerta enviada.");
}

void enviarComandoAT(String comando, int tiempoEspera) {
  SerialGSM.println(comando);
  delay(tiempoEspera);
  while (SerialGSM.available()) {
    Serial.write(SerialGSM.read());
  }
}
