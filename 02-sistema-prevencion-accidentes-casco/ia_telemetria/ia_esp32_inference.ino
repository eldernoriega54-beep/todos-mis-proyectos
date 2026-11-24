#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_HMC5883_U.h>
#include <MS5611.h>

#include <TensorFlowLite.h>
#include "tensorflow/lite/micro/all_ops_resolver.h"
#include "tensorflow/lite/micro/micro_error_reporter.h"
#include "tensorflow/lite/micro/micro_interpreter.h"
#include "tensorflow/lite/schema/schema_generated.h"

// Importar la IA y los parametros de normalizacion
#include "model_data.h"
#include "model_params.h"

Adafruit_MPU6050 mpu;
Adafruit_HMC5883_Unified mag = Adafruit_HMC5883_Unified(12345);
MS5611 ms5611;
double referencePressure;

// Buffer para la ventana temporal (10 muestras * 10 sensores)
float window_buffer[WINDOW_SIZE * NUM_FEATURES];
int current_sample_idx = 0;

tflite::ErrorReporter* error_reporter = nullptr;
const tflite::Model* model = nullptr;
tflite::MicroInterpreter* interpreter = nullptr;
TfLiteTensor* input = nullptr;
TfLiteTensor* output = nullptr;

// Ajustar si la red neuronal demanda mas memoria 
constexpr int kTensorArenaSize = 8 * 1024;
uint8_t tensor_arena[kTensorArenaSize];

void setup() {
  Serial.begin(115200);
  Wire.begin(18, 19); 
  
  if (!mpu.begin()) { Serial.println("MPU6050 Error"); while(1); }
  mpu.setAccelerometerRange(MPU6050_RANGE_16_G);
  mpu.setGyroRange(MPU6050_RANGE_1000_DEG);
  
  if (!mag.begin()) { Serial.println("HMC5883L Error"); while(1); }
  if (!ms5611.begin()) { Serial.println("MS5611 Error"); while(1); }
  referencePressure = ms5611.readPressure();

  static tflite::MicroErrorReporter micro_error_reporter;
  error_reporter = &micro_error_reporter;
  model = tflite::GetModel(modelo_telemetria_tflite);
  
  static tflite::AllOpsResolver resolver;
  static tflite::MicroInterpreter static_interpreter(model, resolver, tensor_arena, kTensorArenaSize, error_reporter);
  interpreter = &static_interpreter;
  interpreter->AllocateTensors();
  
  input = interpreter->input(0);
  output = interpreter->output(0);
  
  // Limpiar buffer
  for(int i=0; i < (WINDOW_SIZE * NUM_FEATURES); i++){
    window_buffer[i] = 0;
  }
}

void loop() {
  // 1. Leer Sensores
  sensors_event_t a, g, temp, eventMag;
  mpu.getEvent(&a, &g, &temp);
  mag.getEvent(&eventMag);
  float altitude = ms5611.getAltitude(ms5611.readPressure(), referencePressure);

  // 2. Desplazar la ventana temporal hacia atras (Sliding Window)
  for (int i = 0; i < (WINDOW_SIZE - 1) * NUM_FEATURES; i++) {
    window_buffer[i] = window_buffer[i + NUM_FEATURES];
  }

  // 3. Insertar la nueva lectura al final de la ventana
  int base_idx = (WINDOW_SIZE - 1) * NUM_FEATURES;
  window_buffer[base_idx + 0] = a.acceleration.x;
  window_buffer[base_idx + 1] = a.acceleration.y;
  window_buffer[base_idx + 2] = a.acceleration.z;
  window_buffer[base_idx + 3] = g.gyro.x * 180 / PI;
  window_buffer[base_idx + 4] = g.gyro.y * 180 / PI;
  window_buffer[base_idx + 5] = g.gyro.z * 180 / PI;
  window_buffer[base_idx + 6] = eventMag.magnetic.x;
  window_buffer[base_idx + 7] = eventMag.magnetic.y;
  window_buffer[base_idx + 8] = eventMag.magnetic.z;
  window_buffer[base_idx + 9] = altitude;

  // Esperar a que el buffer se llene al encender el aparato
  if (current_sample_idx < WINDOW_SIZE) {
    current_sample_idx++;
    delay(50); // Muestreo a 20Hz
    return;
  }

  // 4. NORMALIZACION Y ALIMENTACION DE LA IA
  for (int i = 0; i < (WINDOW_SIZE * NUM_FEATURES); i++) {
    // Normalizar usando los parametros de Python (Z-Score)
    float val_norm = (window_buffer[i] - norm_mean[i]) / norm_std[i];
    input->data.f[i] = val_norm;
  }

  // 5. INFERENCIA
  if (interpreter->Invoke() != kTfLiteOk) {
    Serial.println("Error de Inferencia");
    return;
  }

  // 6. TOMA DE DECISION
  float max_prob = 0;
  int clase = 0;
  for(int i = 0; i < 4; i++){
    if(output->data.f[i] > max_prob){
      max_prob = output->data.f[i];
      clase = i;
    }
  }

  Serial.print("Estado de Moto: ");
  Serial.print(clase);
  Serial.print(" (Prob: "); Serial.print(max_prob * 100); Serial.println("%)");

  delay(50); // Frecuencia de muestreo
}
