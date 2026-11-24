#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_HMC5883_U.h>
#include <MS5611.h>

// --- OBJETOS DE SENSORES ---
Adafruit_MPU6050 mpu;
Adafruit_HMC5883_Unified mag = Adafruit_HMC5883_Unified(12345);
MS5611 ms5611;

// --- VARIABLES GLOBALES Y DE ESTADO ---
double referencePressure;
float currentPitch = 0, currentRoll = 0, currentYaw = 0;
float prevRoll = 0, prevYaw = 0, prevPitch = 0;
unsigned long lastTime;
float dt;

// --- UMBRALES PROFESIONALES DE TELEMETRIA PARA MOTOCICLETAS ---
// Ajustados para diferenciar maniobras extremas de accidentes reales
const float G_CHOQUE_FRONTAL = 5.0;     // Impacto directo frena la moto violentamente
const float G_CHOQUE_LATERAL = 4.0;     // Impacto de costado
const float MAX_LEAN_ANGLE = 65.0;      // Inclinación máxima en curva antes de considerar caída
const float LOWSIDER_ROLL_RATE = 150.0; // Velocidad de caída lateral suave (resbala la llanta)
const float HIGHSIDER_YAW_RATE = 250.0; // Latigazo violento (derrape seguido de agarre brusco)
const float PITCH_VUELCO = 70.0;        // Inclinación frontal/trasera extrema (caballito o invertido que sale mal)

void setup() {
  Serial.begin(115200);
  Wire.begin(); 

  // Inicializar MPU6050 (Acelerometro y Giroscopio)
  if (!mpu.begin()) {
    Serial.println("Falla crítica: MPU6050 no detectado");
    while(1);
  }
  // Rangos muy altos para telemetría de accidentes
  mpu.setAccelerometerRange(MPU6050_RANGE_16_G); 
  mpu.setGyroRange(MPU6050_RANGE_1000_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_44_HZ); // Buen balance entre latencia y filtrado de vibración de motor

  // Inicializar HMC5883L (Magnetometro)
  if(!mag.begin()) {
    Serial.println("Falla: HMC5883L no detectado");
    while(1);
  }

  // Inicializar MS5611 (Barometro)
  if (!ms5611.begin()) {
    Serial.println("Falla: MS5611 no detectado");
    while(1);
  }
  referencePressure = ms5611.readPressure();
  
  lastTime = millis();
  Serial.println("--- SISTEMA DE TELEMETRIA INICIADO ---");
}

void loop() {
  // 1. CALCULO DE TIEMPO (dt)
  unsigned long currentTime = millis();
  dt = (currentTime - lastTime) / 1000.0;
  lastTime = currentTime;

  // 2. OBTENER DATOS CRUDOS DE LA IMU (MPU6050)
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Normalizar aceleracion a Fuerzas G
  float ax = a.acceleration.x / 9.81;
  float ay = a.acceleration.y / 9.81;
  float az = a.acceleration.z / 9.81;
  float totalG = sqrt(ax*ax + ay*ay + az*az);

  // Giroscopio a grados por segundo
  float gyroX = g.gyro.x * 180 / PI; // Tasa de Roll (balanceo lateral)
  float gyroY = g.gyro.y * 180 / PI; // Tasa de Pitch (caballito/frenada)
  float gyroZ = g.gyro.z * 180 / PI; // Tasa de Yaw (giro direccional)

  // 3. FUSION DE SENSORES (FILTRO COMPLEMENTARIO)
  // Calculo estático basado en la gravedad
  float accelPitch = atan2(ay, sqrt(ax * ax + az * az)) * 180 / PI;
  float accelRoll = atan2(-ax, az) * 180 / PI;

  // Actualizar ángulos reales
  prevRoll = currentRoll;
  prevPitch = currentPitch;
  
  currentPitch = 0.98 * (currentPitch + gyroY * dt) + 0.02 * accelPitch;
  currentRoll = 0.98 * (currentRoll + gyroX * dt) + 0.02 * accelRoll;

  // 4. MAGNETOMETRO CON COMPENSACION DE INCLINACION (TILT COMPENSATION)
  sensors_event_t eventMag;
  mag.getEvent(&eventMag);
  
  // Para que la brújula funcione en una moto inclinada en curva, DEBE compensarse con el Roll y Pitch del giroscopio/acelerometro
  float cosRoll = cos(currentRoll * PI/180);
  float sinRoll = sin(currentRoll * PI/180);
  float cosPitch = cos(currentPitch * PI/180);
  float sinPitch = sin(currentPitch * PI/180);
  
  float Xh = eventMag.magnetic.x * cosPitch + eventMag.magnetic.z * sinPitch;
  float Yh = eventMag.magnetic.x * sinRoll * sinPitch + eventMag.magnetic.y * cosRoll - eventMag.magnetic.z * sinRoll * cosPitch;
  
  prevYaw = currentYaw;
  currentYaw = atan2(Yh, Xh) * 180 / PI;
  if(currentYaw < 0) currentYaw += 360;

  // 5. BAROMETRO (ALTITUD)
  long pressure = ms5611.readPressure();
  float altitude = ms5611.getAltitude(pressure, referencePressure);

  // =================================================================================
  // --- ALGORITMOS DE DETECCION DE ACCIDENTES POR COMBINACION DE SENSORES ---
  // =================================================================================

  String eventoDetectado = "NORMAL";
  bool accidenteGrave = false;

  // A. CHOQUE FRONTAL O TRASERO (Combinación de Pico de Gs en eje X + Cambio brusco de Pitch)
  if (abs(ax) > G_CHOQUE_FRONTAL && abs(gyroY) > 150) {
      eventoDetectado = "¡CHOQUE FRONTAL / IMPACTO SEVERO!";
      accidenteGrave = true;
  }
  
  // B. CHOQUE LATERAL (Combinación de Pico de Gs en eje Y + Latigazo en Roll)
  else if (abs(ay) > G_CHOQUE_LATERAL && abs(gyroX) > 200) {
      eventoDetectado = "¡IMPACTO LATERAL!";
      accidenteGrave = true;
  }

  // C. HIGHSIDER (La llanta trasera derrapa y luego recupera tracción de golpe, catapultando al piloto)
  // Se detecta por un Yaw rápido (derrape) seguido de un Roll violentisimo en dirección opuesta al giro
  else if (abs(gyroZ) > 100 && abs(gyroX) > HIGHSIDER_YAW_RATE) {
      eventoDetectado = "¡CAIDA HIGHSIDER (LATIGAZO/CATAPULTA)!";
      accidenteGrave = true;
  }

  // D. LOWSIDER / CAÍDA EN GIRO (Pérdida de tracción frontal o trasera en curva, la moto resbala por el suelo)
  // Se detecta por inclinación extrema (Roll > 65) + Fuerza G baja o sostenida constante en caída + sin latigazo (Gyro X medio)
  else if (abs(currentRoll) > MAX_LEAN_ANGLE && abs(gyroX) > 50 && abs(gyroX) < LOWSIDER_ROLL_RATE) {
      eventoDetectado = "¡CAIDA LOWSIDER (RESBALON EN CURVA)!";
      accidenteGrave = true;
  }

  // E. PERDIDA DE CONTROL / DERRAPE (Pérdida de adherencia, coleo)
  // Se detecta si la moto gira sobre su eje vertical (Yaw/Brújula cambia rapidísimo) pero la fuerza lateral G no coincide
  else if (abs(gyroZ) > 120 && abs(ay) < 0.5) {
      eventoDetectado = "¡ALERTA: DERRAPE / PERDIDA DE TRACCION TRASERA!";
  }

  // F. VUELCO / CABALLITO QUE SALIÓ MAL (Loop out o Invertido extremo)
  // Pitch supera los grados de vuelco físico + la altura cambia bruscamente (MS5611) o hay G de impacto Z
  else if (abs(currentPitch) > PITCH_VUELCO) {
      eventoDetectado = "¡VUELCO (PITCH EXTREMO)!";
      accidenteGrave = true;
  }

  // --- IMPRESION DE TELEMETRIA PROFESIONAL ---
  Serial.print("R:"); Serial.print(currentRoll, 1);
  Serial.print(" P:"); Serial.print(currentPitch, 1);
  Serial.print(" Y:"); Serial.print(currentYaw, 1);
  Serial.print(" G(xyz):["); Serial.print(ax, 1); Serial.print(","); Serial.print(ay, 1); Serial.print(","); Serial.print(az, 1); Serial.print("]");
  
  if (accidenteGrave) {
      Serial.print(" || CRITICO -> ");
      Serial.println(eventoDetectado);
      // Aqui se activaria el GSM para enviar SMS de SOS
  } else if (eventoDetectado != "NORMAL") {
      Serial.print(" || ADVERTENCIA -> ");
      Serial.println(eventoDetectado);
  } else {
      Serial.println(" || OK");
  }
  
  // Muestreo rapido para no perder eventos dinamicos (telemetria suele ir a 50Hz-100Hz)
  delay(20); 
}
