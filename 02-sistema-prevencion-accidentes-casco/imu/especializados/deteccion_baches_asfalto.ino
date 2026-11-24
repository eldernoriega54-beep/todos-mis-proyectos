#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_MPU6050.h>
#include <TinyGPS++.h>

Adafruit_MPU6050 mpu;
TinyGPSPlus gps;

unsigned long lastTime;
float dt;

void setup() {
  Serial.begin(115200);
  Wire.begin();
  
  if (!mpu.begin()) {
    Serial.println("Falla MPU6050");
    while (1);
  }
  
  // Alta sensibilidad para detectar baches
  mpu.setAccelerometerRange(MPU6050_RANGE_4_G);
  mpu.setFilterBandwidth(MPU6050_BAND_94_HZ); // Ancho de banda alto para captar vibracion de alta frecuencia
  
  lastTime = millis();
}

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Analisis del eje Z (Vibracion vertical)
  float az = a.acceleration.z / 9.81; // En Fuerzas G
  
  // Si la fuerza vertical sube repentinamente de 1G (gravedad) a mas de 2.5G
  // o cae por debajo de 0.2G, significa que pasamos por un bache profundo
  if (az > 2.5 || az < 0.2) {
    Serial.print("!BACHE O IRREGULARIDAD SEVERA DETECTADA! Fuerza G Z: ");
    Serial.println(az);
    
    // Aquí podríamos guardar la ubicación GPS del bache en la EEPROM 
    // para crear un "mapa de estado del asfalto"
  }
  
  delay(10);
}
