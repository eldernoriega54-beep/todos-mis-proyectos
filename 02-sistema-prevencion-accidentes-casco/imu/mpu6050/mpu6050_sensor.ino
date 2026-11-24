#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

Adafruit_MPU6050 mpu;

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10); 

  if (!mpu.begin()) {
    Serial.println("No se encontro MPU6050");
    while (1) { delay(10); }
  }
  
  // Configuracion MPU6050 para alta dinamica
  mpu.setAccelerometerRange(MPU6050_RANGE_16_G); // Rango de 16G para detectar choques fuertes
  mpu.setGyroRange(MPU6050_RANGE_2000_DEG);      // Giros bruscos
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);    // Filtro para ruido de vibracion de motor
}

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Muestra datos crudos
  Serial.print("Accel X: "); Serial.print(a.acceleration.x);
  Serial.print(", Y: "); Serial.print(a.acceleration.y);
  Serial.print(", Z: "); Serial.print(a.acceleration.z);
  Serial.println(" m/s^2");

  Serial.print("Gyro X: "); Serial.print(g.gyro.x);
  Serial.print(", Y: "); Serial.print(g.gyro.y);
  Serial.print(", Z: "); Serial.print(g.gyro.z);
  Serial.println(" rad/s");

  delay(100);
}
