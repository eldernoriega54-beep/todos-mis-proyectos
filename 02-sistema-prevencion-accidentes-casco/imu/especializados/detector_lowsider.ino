#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_MPU6050.h>

Adafruit_MPU6050 mpu;

float currentRoll = 0;
unsigned long lastTime;
const float MAX_LEAN = 60.0; // Grados maximos antes de que el caucho pierda agarre

void setup() {
  Serial.begin(115200);
  Wire.begin();
  
  if (!mpu.begin()) while (1);
  
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  
  lastTime = millis();
}

void loop() {
  unsigned long currentTime = millis();
  float dt = (currentTime - lastTime) / 1000.0;
  lastTime = currentTime;

  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  float ax = a.acceleration.x / 9.81;
  float az = a.acceleration.z / 9.81;

  float accelRoll = atan2(-ax, az) * 180 / PI;
  float gyroRollRate = g.gyro.x * 180 / PI;

  currentRoll = 0.96 * (currentRoll + gyroRollRate * dt) + 0.04 * accelRoll;

  // Analisis especializado de Lowsider
  if (abs(currentRoll) > MAX_LEAN) {
    // Si pasamos de la inclinacion maxima, evaluamos si nos estamos cayendo
    if (abs(gyroRollRate) > 30) {
      // Estamos perdiendo la moto, cayendo hacia el asfalto.
      Serial.print("ALERTA CAIDA LOWSIDER - Inclinacion: ");
      Serial.print(currentRoll);
      Serial.print("Velocidad de caida (RollRate): ");
      Serial.println(gyroRollRate);
    } else {
      // Posiblemente rozando la rodilla, pero estable.
      Serial.println("INCLINACION CRITICA - Al limite del agarre.");
    }
  }

  delay(20);
}
