import socket
import subprocess
import time
import sys

ADB_PATH = r"C:\Users\ELDER NORIEGA\AppData\Local\Android\Sdk\platform-tools\adb.exe"
HOST = '0.0.0.0'
PORT = 5000

def enviar_alerta_telefono(nivel):
    print(f"\n[ALERTA RECIBIDA DEL PLC] Nivel: {nivel}")
    if nivel == 1:
        print(">>> Enviando ALERTA VERDE (Notificación) al celular...")
        cmd = [ADB_PATH, "shell", "am", "broadcast", "-a", "com.example.atri.ACTION_ALERT", "--ei", "level", "1", "-n", "com.example.atri/.AlertReceiver"]
        subprocess.run(cmd)
    elif nivel == 2:
        print(">>> Enviando ALERTA AMARILLA (Notificación) al celular...")
        cmd = [ADB_PATH, "shell", "am", "broadcast", "-a", "com.example.atri.ACTION_ALERT", "--ei", "level", "2", "-n", "com.example.atri/.AlertReceiver"]
        subprocess.run(cmd)
    elif nivel == 3:
        print(">>> Enviando ALERTA ROJA (Pantalla Completa + Audio + Alarma) al celular...")
        cmd = [ADB_PATH, "shell", "am", "start", "-n", "com.example.atri/.RedAlertActivity"]
        subprocess.run(cmd)
    elif nivel == 0:
        print(">>> Nivel NORMAL (Sin inundación)")

def main():
    print("=" * 60)
    print(" SERVIDOR PUENTE LAN ATRI (PLC -> LAPTOP -> CELULAR)")
    print(f" Escuchando al PLC Siemens en el puerto {PORT}...")
    print(" Presione Ctrl+C para detener.")
    print("=" * 60)

    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        server.bind((HOST, PORT))
        server.listen(5)
    except Exception as e:
        print(f"Error al iniciar servidor en puerto {PORT}: {e}")
        return

    ultimo_nivel = -1

    while True:
        try:
            conn, addr = server.accept()
            print(f"[CONEXIÓN] PLC conectado desde: {addr[0]}:{addr[1]}")
            while True:
                data = conn.recv(1024)
                if not data:
                    break
                # El PLC manda 'A', 'T', 'R', <nivel_byte>
                if len(data) >= 4 and data[0:3] == b'ATR':
                    nivel = int(data[3])
                    if nivel != ultimo_nivel:
                        ultimo_nivel = nivel
                        enviar_alerta_telefono(nivel)
        except KeyboardInterrupt:
            print("\nServidor detenido.")
            break
        except Exception as e:
            print(f"Error en comunicación con PLC: {e}")
            time.sleep(1)

if __name__ == '__main__':
    main()
