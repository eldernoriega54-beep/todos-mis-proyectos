#include <Wire.h>
#include <MS5611.h>

MS5611 ms5611;

double referencePressure;

void setup() {
  Serial.begin(115200);
  while(!Serial);

  // Iniciar MS5611
  if (!ms5611.begin()) {
    Serial.println("MS5611 no encontrado. Verifica las conexiones!");
    while (1);
  }

  // Tomar presion de referencia para calcular altura relativa
  referencePressure = ms5611.readPressure();
}

void loop() {
  // Leemos presion y temperatura reales
  long realPressure = ms5611.readPressure();
  double realTemperature = ms5611.readTemperature();

  // Calculo simple de altitud basada en presion de referencia
  float absoluteAltitude = ms5611.getAltitude(realPressure);
  float relativeAltitude = ms5611.getAltitude(realPressure, referencePressure);

  Serial.print(" Temperatura: ");
  Serial.print(realTemperature);
  Serial.print(" *C");

  Serial.print("\t Presion: ");
  Serial.print(realPressure);
  Serial.print(" Pa");

  Serial.print("\t Altitud Relativa: ");
  Serial.print(relativeAltitude);
  Serial.println(" m");

  delay(200);
}
