#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_HMC5883_U.h>

/* Asigna un ID unico al sensor */
Adafruit_HMC5883_Unified mag = Adafruit_HMC5883_Unified(12345);

void setup(void) {
  Serial.begin(115200);
  
  // Iniciar sensor
  if(!mag.begin()) {
    Serial.println("Ooops, no se detecto el HMC5883L ... revisa tus conexiones!");
    while(1);
  }
}

void loop(void) {
  sensors_event_t event; 
  mag.getEvent(&event);
  
  // Mostrar datos del magnetometro en micro-Teslas (uT)
  Serial.print("X: "); Serial.print(event.magnetic.x); Serial.print("  ");
  Serial.print("Y: "); Serial.print(event.magnetic.y); Serial.print("  ");
  Serial.print("Z: "); Serial.print(event.magnetic.z); Serial.print("  ");Serial.println("uT");

  // Calcular el "heading" (direccion)
  float heading = atan2(event.magnetic.y, event.magnetic.x);
  
  // Compensar la declinacion (ej: 0.22 para tu area, ajusta segun sea necesario)
  float declinationAngle = 0.22;
  heading += declinationAngle;
  
  // Corregir si sobrepasa los 360 grados
  if(heading < 0)
    heading += 2*PI;
  if(heading > 2*PI)
    heading -= 2*PI;
    
  // Convertir a grados
  float headingDegrees = heading * 180/M_PI; 
  
  Serial.print("Heading (Grados): "); Serial.println(headingDegrees);
  
  delay(500);
}
