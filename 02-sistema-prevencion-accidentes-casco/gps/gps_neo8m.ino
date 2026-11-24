#include <HardwareSerial.h>
#include <TinyGPS++.h>

// Usa el UART2 del ESP32 (RX=16, TX=17 por defecto)
HardwareSerial SerialGPS(2); 
TinyGPSPlus gps;

void setup() {
  Serial.begin(115200);
  
  // NEO-8M suele usar 9600 baudios por defecto
  SerialGPS.begin(9600, SERIAL_8N1, 16, 17);
  Serial.println("Inicializando GPS NEO-8M...");
}

void loop() {
  // Leemos el puerto Serial del GPS constantemente
  while (SerialGPS.available() > 0) {
    if (gps.encode(SerialGPS.read())) {
      mostrarDatosGPS();
    }
  }

  // Si no hay datos en 5 segundos, error de conexion
  if (millis() > 5000 && gps.charsProcessed() < 10) {
    Serial.println(F("No se detecta GPS: Revisa conexiones"));
    while(true);
  }
}

void mostrarDatosGPS() {
  if (gps.location.isUpdated()) {
    Serial.print("Latitud: "); Serial.println(gps.location.lat(), 6);
    Serial.print("Longitud: "); Serial.println(gps.location.lng(), 6);
    Serial.print("Velocidad (km/h): "); Serial.println(gps.speed.kmph());
    Serial.print("Satelites: "); Serial.println(gps.satellites.value());
  }
}
