// Monitor de Bateria Lipo 3.7V (Max 4.2V)
// Requiere un divisor de voltaje para bajar de 4.2V a max 3.3V (ADC del ESP32)
// Ejemplo de divisor: R1 = 100k (Bateria a Pin), R2 = 100k (Pin a GND) -> 4.2V se lee como 2.1V

const int BATTERY_PIN = 34; // Pin ADC del ESP32
const float VOLTAGE_DIVIDER_RATIO = 2.0; // Ratio del divisor de voltaje (100k y 100k = 2)
const float MAX_ADC_VALUE = 4095.0; // 12-bit ADC
const float REFERENCE_VOLTAGE = 3.3; // Referencia de ADC ESP32

void setup() {
  Serial.begin(115200);
  pinMode(BATTERY_PIN, INPUT);
}

void loop() {
  int adcValue = analogRead(BATTERY_PIN);
  
  // Calcular voltaje en el pin
  float pinVoltage = (adcValue / MAX_ADC_VALUE) * REFERENCE_VOLTAGE;
  
  // Calcular voltaje real de la bateria
  float batteryVoltage = pinVoltage * VOLTAGE_DIVIDER_RATIO;
  
  // Calcular porcentaje (Aprox Lipo: 4.2V = 100%, 3.2V = 0%)
  float percentage = ((batteryVoltage - 3.2) / (4.2 - 3.2)) * 100.0;
  
  // Limites
  if (percentage > 100) percentage = 100;
  if (percentage < 0) percentage = 0;

  // Logica basica de salud (Salud cae si el voltaje maximo es bajo aun cargada)
  // En un sistema real esto se evalua midiendo la caida bajo carga o ciclos completos.
  String salud = "BUENA";
  if (batteryVoltage < 3.5 && percentage > 50) {
      salud = "DEGRADADA"; // Falsa lectura por daño interno
  }

  Serial.print("Voltaje de Bateria: "); Serial.print(batteryVoltage); Serial.println(" V");
  Serial.print("Porcentaje: "); Serial.print(percentage); Serial.println(" %");
  Serial.print("Salud estimada: "); Serial.println(salud);
  
  delay(2000);
}
