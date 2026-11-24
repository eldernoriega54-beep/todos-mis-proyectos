import os

signs = {
    'A': ('A', 'Puño con pulgar al lado', [
        '<rect x="65" y="80" width="70" height="80" rx="20" fill="#E8D7C3" stroke="#FF7A18" stroke-width="4"/>',
        '<rect x="45" y="90" width="25" height="60" rx="12" fill="#D4A87A" stroke="#FF7A18" stroke-width="4"/>',
        '<line x1="85" y1="80" x2="85" y2="130" stroke="#FF7A18" stroke-width="3"/>',
        '<line x1="105" y1="80" x2="105" y2="130" stroke="#FF7A18" stroke-width="3"/>',
        '<line x1="120" y1="80" x2="120" y2="130" stroke="#FF7A18" stroke-width="3"/>'
    ]),
    'E': ('E', 'Dedos curvados sobre palma', [
        '<rect x="60" y="85" width="80" height="75" rx="16" fill="#E8D7C3" stroke="#FF7A18" stroke-width="4"/>',
        '<rect x="65" y="75" width="70" height="25" rx="10" fill="#D4A87A" stroke="#FF7A18" stroke-width="4"/>',
        '<rect x="70" y="120" width="60" height="20" rx="8" fill="#B85A18" stroke="#FF7A18" stroke-width="3"/>'
    ]),
    'I': ('I', 'Meñique levantado', [
        '<rect x="60" y="90" width="70" height="70" rx="18" fill="#E8D7C3" stroke="#FF7A18" stroke-width="4"/>',
        '<rect x="115" y="35" width="18" height="70" rx="9" fill="#FF7A18" stroke="#140F0D" stroke-width="3"/>',
        '<rect x="50" y="100" width="25" height="40" rx="10" fill="#D4A87A" stroke="#FF7A18" stroke-width="3"/>'
    ]),
    'O': ('O', 'Mano en círculo', [
        '<ellipse cx="100" cy="105" rx="45" ry="45" fill="none" stroke="#FF7A18" stroke-width="16"/>',
        '<ellipse cx="100" cy="105" rx="25" ry="25" fill="#140F0D"/>',
        '<circle cx="100" cy="105" r="12" fill="#D4A87A"/>'
    ]),
    'U': ('U', 'Índice y medio juntos arriba', [
        '<rect x="60" y="95" width="80" height="65" rx="16" fill="#E8D7C3" stroke="#FF7A18" stroke-width="4"/>',
        '<rect x="82" y="30" width="16" height="75" rx="8" fill="#FF7A18" stroke="#140F0D" stroke-width="3"/>',
        '<rect x="102" y="30" width="16" height="75" rx="8" fill="#FF7A18" stroke="#140F0D" stroke-width="3"/>',
        '<rect x="52" y="105" width="22" height="40" rx="9" fill="#D4A87A" stroke="#FF7A18" stroke-width="3"/>'
    ]),
    'B': ('B', '4 dedos juntos extendidos', [
        '<rect x="65" y="95" width="75" height="65" rx="16" fill="#E8D7C3" stroke="#FF7A18" stroke-width="4"/>',
        '<rect x="68" y="35" width="15" height="70" rx="7" fill="#FF7A18" stroke="#140F0D" stroke-width="2"/>',
        '<rect x="86" y="30" width="15" height="75" rx="7" fill="#FF7A18" stroke="#140F0D" stroke-width="2"/>',
        '<rect x="104" y="32" width="15" height="73" rx="7" fill="#FF7A18" stroke="#140F0D" stroke-width="2"/>',
        '<rect x="122" y="42" width="15" height="63" rx="7" fill="#FF7A18" stroke="#140F0D" stroke-width="2"/>',
        '<rect x="55" y="105" width="30" height="20" rx="8" fill="#D4A87A" stroke="#FF7A18" stroke-width="3"/>'
    ]),
    'C': ('C', 'Palma en C lateral', [
        '<path d="M 130 60 C 70 60, 60 140, 130 140" fill="none" stroke="#FF7A18" stroke-width="18" stroke-linecap="round"/>',
        '<path d="M 130 60 C 80 60, 75 140, 130 140" fill="none" stroke="#D4A87A" stroke-width="8" stroke-linecap="round"/>'
    ]),
    'D': ('D', 'Índice arriba y círculo', [
        '<rect x="65" y="85" width="65" height="65" rx="25" fill="#E8D7C3" stroke="#FF7A18" stroke-width="4"/>',
        '<rect x="75" y="25" width="16" height="70" rx="8" fill="#FF7A18" stroke="#140F0D" stroke-width="3"/>',
        '<circle cx="100" cy="115" r="16" fill="#140F0D" stroke="#FF7A18" stroke-width="3"/>'
    ]),
    'L': ('L', 'Índice y pulgar en L', [
        '<rect x="70" y="85" width="60" height="65" rx="16" fill="#E8D7C3" stroke="#FF7A18" stroke-width="4"/>',
        '<rect x="75" y="25" width="16" height="75" rx="8" fill="#FF7A18" stroke="#140F0D" stroke-width="3"/>',
        '<rect x="35" y="95" width="45" height="16" rx="8" fill="#FF7A18" stroke="#140F0D" stroke-width="3"/>'
    ]),
    'HOLA': ('Hola', 'Saludo con mano abierta', [
        '<path d="M 65 110 L 80 40 L 95 35 L 110 38 L 125 45 L 135 60 L 130 130 Z" fill="#E8D7C3" stroke="#FF7A18" stroke-width="4"/>',
        '<path d="M 140 30 Q 155 45 140 60" stroke="#FF7A18" stroke-width="4" fill="none" stroke-linecap="round"/>',
        '<path d="M 150 20 Q 170 45 150 70" stroke="#D4A87A" stroke-width="4" fill="none" stroke-linecap="round"/>'
    ]),
    'GRACIAS': ('Gracias', 'Mano al pecho extendida', [
        '<rect x="65" y="70" width="70" height="80" rx="20" fill="#E8D7C3" stroke="#FF7A18" stroke-width="4"/>',
        '<circle cx="100" cy="60" r="12" fill="#FF7A18"/>',
        '<path d="M 60 135 Q 100 160 140 135" stroke="#FF7A18" stroke-width="5" fill="none" stroke-linecap="round"/>',
        '<polygon points="95,165 105,165 100,175" fill="#FF7A18"/>'
    ]),
    'SI': ('Sí', 'Puño que asiente', [
        '<rect x="65" y="75" width="70" height="70" rx="25" fill="#E8D7C3" stroke="#FF7A18" stroke-width="4"/>',
        '<path d="M 100 35 L 100 65" stroke="#FF7A18" stroke-width="6" stroke-linecap="round"/>',
        '<polygon points="90,45 110,45 100,30" fill="#FF7A18"/>',
        '<path d="M 100 155 L 100 175" stroke="#D4A87A" stroke-width="4" stroke-linecap="round"/>',
        '<polygon points="92,165 108,165 100,180" fill="#D4A87A"/>'
    ]),
    'NO': ('No', 'Dedos en tijera negación', [
        '<rect x="65" y="90" width="70" height="65" rx="18" fill="#E8D7C3" stroke="#FF7A18" stroke-width="4"/>',
        '<rect x="75" y="35" width="15" height="65" rx="7" fill="#FF7A18" stroke="#140F0D" stroke-width="2"/>',
        '<rect x="105" y="35" width="15" height="65" rx="7" fill="#FF7A18" stroke="#140F0D" stroke-width="2"/>',
        '<path d="M 50 100 Q 100 105 150 100" stroke="#FF7A18" stroke-width="4" stroke-dasharray="6 4" fill="none"/>'
    ]),
    'AYUDA': ('Ayuda', 'Puño sobre palma de apoyo', [
        '<rect x="45" y="135" width="110" height="18" rx="8" fill="#D4A87A" stroke="#FF7A18" stroke-width="3"/>',
        '<rect x="70" y="70" width="60" height="60" rx="16" fill="#E8D7C3" stroke="#FF7A18" stroke-width="4"/>',
        '<rect x="55" y="50" width="20" height="35" rx="8" fill="#FF7A18" stroke="#140F0D" stroke-width="3"/>'
    ])
}

base_dir = r"d:\Sistema TLS (TRADUCTOR DE LENGUAJE DE SEÑAS)\TLS\app\src\main\assets\dictionary\es-LSM"
os.makedirs(base_dir, exist_ok=True)

for key, (label, desc, elements) in signs.items():
    elems = "\n  ".join(elements)
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGrad_{key}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2C211C"/>
      <stop offset="100%" stop-color="#140F0D"/>
    </radialGradient>
  </defs>
  <rect width="200" height="200" rx="24" fill="url(#bgGrad_{key})"/>
  <rect x="4" y="4" width="192" height="192" rx="20" fill="none" stroke="#FF7A18" stroke-width="2" stroke-dasharray="8 6" opacity="0.6"/>
  {elems}
  <rect x="25" y="160" width="150" height="28" rx="8" fill="#1F1815" stroke="#FF7A18" stroke-width="1.5"/>
  <text x="100" y="179" font-family="sans-serif" font-size="14" font-weight="bold" fill="#F7ECE1" text-anchor="middle">{label}</text>
</svg>"""
    with open(os.path.join(base_dir, f"{key}.svg"), "w", encoding="utf-8") as f:
        f.write(svg)

print(f"Generated {len(signs)} SVGs in {base_dir}")
