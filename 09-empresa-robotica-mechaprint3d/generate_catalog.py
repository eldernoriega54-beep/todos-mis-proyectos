import os
import json
import trimesh
import numpy as np
import matplotlib.pyplot as plt
import shutil

directorios = [
    "./accesorios 3d",
    "./carcasas y soportes 3d",
    "./NASA-3D-Resources-master"
]

carpeta_imagenes_global = "./assets/img/catalogo/"
os.makedirs(carpeta_imagenes_global, exist_ok=True)

catalogo_productos = []
contador = 0

print("Escaneando directorios de recursos 3D...")

for carpeta_principal in directorios:
    categoria = "General"
    if "accesorios" in carpeta_principal.lower():
        categoria = "Accesorios"
    elif "carcasas" in carpeta_principal.lower():
        categoria = "Carcasas y Soportes"
    elif "nasa" in carpeta_principal.lower():
        categoria = "NASA 3D"

    for root, dirs, files in os.walk(carpeta_principal):
        for archivo in files:
            if archivo.lower().endswith(".stl"):
                ruta_completa = os.path.join(root, archivo)
                nombre_base = os.path.splitext(archivo)[0]
                nombre_limpio = nombre_base.replace("-", " ").replace("_", " ").title()
                
                imagen_existente = None
                for f_local in os.listdir(root):
                    if f_local.lower().endswith(('.png', '.jpg', '.jpeg')) and os.path.splitext(f_local)[0].lower() in nombre_base.lower():
                        imagen_existente = os.path.join(root, f_local)
                        break
                
                nombre_archivo_img = f"{nombre_base}.png"
                ruta_imagen_destino = os.path.join(carpeta_imagenes_global, nombre_archivo_img)
                ruta_imagen_relativa = f"assets/img/catalogo/{nombre_archivo_img}"
                
                if imagen_existente:
                    shutil.copy(imagen_existente, ruta_imagen_destino)
                    print(f"[{contador+1}] Usando imagen existente para: {archivo}")
                else:
                    try:
                        mesh = trimesh.load(ruta_completa)
                        if isinstance(mesh, trimesh.Scene) and len(mesh.geometry) > 0:
                            mesh = next(iter(mesh.geometry.values()))
                        
                        fig = plt.figure(figsize=(6, 6))
                        ax = fig.add_subplot(projection='3d')
                        
                        if hasattr(mesh, 'vertices') and len(mesh.vertices) > 0:
                            vertices = mesh.vertices
                            faces = mesh.faces
                            ax.plot_trisurf(
                                vertices[:, 0], vertices[:, 1], vertices[:, 2], 
                                triangles=faces, color='#2563eb', lw=0.1, alpha=0.9
                            )
                            ax.axis('off')
                            plt.savefig(ruta_imagen_destino, bbox_inches='tight', transparent=True, dpi=150)
                        plt.close(fig)
                        print(f"[{contador+1}] Renderizado generado para: {archivo}")
                    except Exception as e:
                        print(f"Error procesando render para {archivo}: {e}")
                        ruta_imagen_relativa = "assets/img/default.png"

                contador += 1
                
                precio_estimado = round(np.random.uniform(50.00, 500.00), 2)
                
                catalogo_productos.append({
                    "id": contador,
                    "nombre": nombre_limpio,
                    "categoria": categoria,
                    "precio_lempiras": precio_estimado,
                    "imagen": ruta_imagen_relativa,
                    "archivo_stl": ruta_completa
                })

with open("catalogo.json", "w", encoding="utf-8") as f:
    json.dump(catalogo_productos, f, indent=4, ensure_ascii=False)

print(f"Proceso finalizado. Total de elementos en el catalogo: {contador}")
