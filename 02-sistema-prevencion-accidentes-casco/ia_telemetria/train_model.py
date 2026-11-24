import os
import sys
import numpy as np

# Intentar importar tensorflow, si no esta, lo instalamos autmaticamente (para facilitar)
try:
    import tensorflow as tf
except ImportError:
    print("TensorFlow no encontrado. Instalando localmente...")
    os.system(f"{sys.executable} -m pip install tensorflow numpy")
    import tensorflow as tf

# =========================================================================
# 1. SECCIÓN PARA APRENDIZAJE (DATOS REALES)
# =========================================================================
# AQUI ES DONDE TU PONDRAS TUS DATOS EN EL FUTURO.
# Para entrenar la IA con choques reales de moto, debes guardar las lecturas
# de tu ESP32 en una tarjeta SD (o mandarlas por Serial) en un archivo CSV.
# Luego, reemplazarias la funcion "generar_datos_sinteticos" por:
# import pandas as pd
# df = pd.read_csv("mis_choques_reales.csv")
# X_data = df.drop('etiqueta', axis=1).values
# y_data = df['etiqueta'].values
# =========================================================================

def generar_datos_sinteticos(num_samples=5000, window_size=10):
    """
    Genera ventanas temporales de datos. En vez de 1 muestra, la IA mirara 
    10 muestras seguidas (medio segundo) para entender el 'movimiento'.
    """
    X = []
    y = []
    
    for _ in range(num_samples):
        estado = np.random.randint(0, 4)
        ventana = []
        
        for _ in range(window_size):
            if estado == 0: # Normal
                acc = [np.random.normal(0, 0.5), np.random.normal(0, 0.5), np.random.normal(9.8, 1.0)]
                gyro = [np.random.normal(0, 10), np.random.normal(0, 10), np.random.normal(0, 20)]
            elif estado == 1: # Leve
                acc = [np.random.normal(15, 5), np.random.normal(15, 5), np.random.normal(9.8, 5)]
                gyro = [np.random.normal(100, 20), np.random.normal(100, 20), np.random.normal(100, 20)]
            elif estado == 2: # Medio
                acc = [np.random.normal(40, 10), np.random.normal(40, 10), np.random.normal(0, 10)]
                gyro = [np.random.normal(250, 50), np.random.normal(250, 50), np.random.normal(250, 50)]
            else: # Grave
                acc = [np.random.normal(80, 20), np.random.normal(80, 20), np.random.normal(80, 20)]
                gyro = [np.random.normal(500, 100), np.random.normal(500, 100), np.random.normal(500, 100)]
                
            mag = [np.random.normal(0, 50), np.random.normal(0, 50), np.random.normal(0, 50)]
            alt = [np.random.normal(500, 2)]
            
            ventana.extend(acc + gyro + mag + alt)
            
        X.append(ventana)
        y.append(estado)
        
    return np.array(X, dtype=np.float32), np.array(y, dtype=np.int32)

print("Generando dataset con ventanas temporales...")
# 10 muestras x 10 sensores = 100 entradas por prediccion
WINDOW_SIZE = 10 
X_data, y_data = generar_datos_sinteticos(5000, WINDOW_SIZE)

# =========================================================================
# 2. NORMALIZACION (Z-Score) PARA QUE LA IA NO SE CONFUNDA
# =========================================================================
print("Normalizando datos...")
mean_vals = np.mean(X_data, axis=0)
std_vals = np.std(X_data, axis=0)
# Evitar division por cero
std_vals[std_vals == 0] = 1e-6 

X_data_norm = (X_data - mean_vals) / std_vals

# Exportar las medias y desviaciones a C++ para que el ESP32 normalice igual
def exportar_parametros_cpp(mean, std, filename="model_params.h"):
    with open(filename, "w") as f:
        f.write("#ifndef MODEL_PARAMS_H\n#define MODEL_PARAMS_H\n\n")
        f.write("const int WINDOW_SIZE = 10;\n")
        f.write("const int NUM_FEATURES = 10;\n\n")
        
        f.write("const float norm_mean[100] = {\n  ")
        f.write(", ".join([f"{x:.4f}" for x in mean]))
        f.write("\n};\n\n")
        
        f.write("const float norm_std[100] = {\n  ")
        f.write(", ".join([f"{x:.4f}" for x in std]))
        f.write("\n};\n\n")
        f.write("#endif\n")

exportar_parametros_cpp(mean_vals, std_vals)

# =========================================================================
# 3. CREACION Y ENTRENAMIENTO DE LA RED NEURONAL
# =========================================================================
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(WINDOW_SIZE * 10,)),
    # Capas ocultas un poco mas robustas para entender la ventana temporal
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dropout(0.2), # Previene que memorice, fomenta aprendizaje real
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(4, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

print("Entrenando el modelo...")
model.fit(X_data_norm, y_data, epochs=30, batch_size=32, validation_split=0.2)

# =========================================================================
# 4. CUANTIZACION INT8 HIBRIDA Y EXPORTACION A TFLITE MICRO
# =========================================================================
print("Convirtiendo a TensorFlow Lite optimizado para ESP32...")
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT] # Cuantizacion de pesos para ahorrar Flash
tflite_model = converter.convert()

def hex_to_c_array(hex_data, var_name):
    c_str = f"const unsigned char {var_name}[] = {{\n"
    hex_array = [hex_data[i:i+1].hex() for i in range(len(hex_data))]
    for i in range(0, len(hex_array), 12):
        c_str += "  " + ", ".join([f"0x{x}" for x in hex_array[i:i+12]]) + ",\n"
    c_str += f"}};\nconst unsigned int {var_name}_len = {len(hex_data)};\n"
    return c_str

c_code = hex_to_c_array(tflite_model, "modelo_telemetria_tflite")

with open("model_data.h", "w") as f:
    f.write("#ifndef MODEL_DATA_H\n#define MODEL_DATA_H\n\n")
    f.write(c_code)
    f.write("\n#endif\n")

print("¡IA ENTRENADA! Archivos model_data.h y model_params.h generados exitosamente.")
