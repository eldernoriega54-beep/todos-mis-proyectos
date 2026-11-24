# Tabler Icons (categorized)

Esta carpeta contiene una copia categorizada de los iconos Tabler para usar directamente desde el proyecto.

Estructura:
- `tabler/filled` — iconos en estilo "filled" (SVG)
- `tabler/outline` — iconos en estilo "outline" (SVG)

Cómo generar las copias (desde la raíz `app vexel/elementos graficos`):

```bash
node copy_tabler_icons.js
```

El script copiará solo los archivos `.svg` desde `tabler-icons-main/tabler-icons-main/icons/{filled,outline}`.
