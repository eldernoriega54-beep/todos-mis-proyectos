# Generador de 14 SVGs anatómicos realistas de manos para Lengua de Señas (LSM)
$letters = @{
    'A' = @{
        'label' = 'A'
        'desc' = 'Puño cerrado con el pulgar apoyado al costado'
        'path' = 'M 75 160 C 70 145, 68 115, 68 95 C 68 85, 75 78, 85 78 C 92 78, 96 82, 100 86 C 104 80, 110 78, 118 78 C 126 78, 132 83, 134 90 C 138 84, 144 82, 150 84 C 158 86, 160 94, 158 108 C 156 125, 150 145, 145 160 Z M 68 105 C 55 105, 46 112, 44 125 C 42 138, 52 148, 68 142 Z'
        'detail' = '<path d="M 98 88 L 98 120 M 122 88 L 122 120 M 142 96 L 142 125" stroke="#FF7A18" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="56" cy="122" rx="6" ry="10" fill="#FF7A18"/>'
    };
    'B' = @{
        'label' = 'B'
        'desc' = 'Cuatro dedos extendidos juntos hacia arriba'
        'path' = 'M 75 165 C 70 145, 68 115, 68 65 C 68 50, 78 45, 86 45 C 94 45, 96 52, 98 62 C 100 48, 108 42, 116 42 C 124 42, 126 50, 128 62 C 130 48, 138 44, 145 44 C 152 44, 154 52, 155 68 C 157 56, 163 52, 168 54 C 174 56, 175 66, 172 88 C 168 115, 158 145, 150 165 Z'
        'detail' = '<path d="M 68 120 C 58 120, 52 126, 55 136 C 58 145, 68 148, 85 142 Z" fill="#D4A87A" stroke="#FF7A18" stroke-width="2"/><line x1="97" y1="60" x2="97" y2="120" stroke="#FF7A18" stroke-width="2"/><line x1="126" y1="60" x2="126" y2="120" stroke="#FF7A18" stroke-width="2"/><line x1="152" y1="68" x2="152" y2="125" stroke="#FF7A18" stroke-width="2"/>'
    };
    'C' = @{
        'label' = 'C'
        'desc' = 'Mano de perfil formando el arco de la letra C'
        'path' = 'M 85 165 C 75 145, 75 125, 80 100 C 85 75, 105 55, 135 55 C 155 55, 165 65, 160 78 C 155 88, 142 82, 132 82 C 115 82, 102 96, 100 112 C 98 128, 110 138, 128 138 C 142 138, 155 132, 160 142 C 165 152, 150 165, 130 165 Z'
        'detail' = '<path d="M 135 60 C 110 60, 92 80, 92 110 C 92 140, 112 158, 135 158" fill="none" stroke="#FF7A18" stroke-width="5" stroke-linecap="round"/>'
    };
    'D' = @{
        'label' = 'D'
        'desc' = 'Dedo índice extendido hacia arriba y círculo en la base'
        'path' = 'M 80 165 C 75 145, 75 125, 75 75 C 75 50, 85 45, 95 45 C 105 45, 108 55, 108 80 L 108 105 C 115 95, 130 92, 142 96 C 155 102, 158 115, 155 132 C 150 150, 135 162, 115 162 Z'
        'detail' = '<circle cx="125" cy="128" r="14" fill="#140F0D" stroke="#FF7A18" stroke-width="3"/><line x1="85" y1="52" x2="85" y2="95" stroke="#FF7A18" stroke-width="2"/>'
    };
    'E' = @{
        'label' = 'E'
        'desc' = 'Dedos doblados hacia la palma mostrando las uñas'
        'path' = 'M 75 160 C 70 145, 68 125, 68 105 C 68 85, 80 80, 95 80 C 115 80, 145 80, 155 88 C 162 95, 160 115, 155 135 C 150 150, 140 160, 125 160 Z'
        'detail' = '<path d="M 75 95 Q 110 90 150 95 M 75 108 Q 110 104 150 108" stroke="#FF7A18" stroke-width="3" fill="none"/><ellipse cx="112" cy="125" rx="35" ry="10" fill="#D4A87A" stroke="#FF7A18" stroke-width="2"/>'
    };
    'F' = @{
        'label' = 'F'
        'desc' = 'Pulgar e índice en círculo, 3 dedos arriba'
        'path' = 'M 75 165 C 70 145, 70 120, 75 100 C 65 95, 62 82, 70 75 C 78 68, 88 74, 92 85 C 100 68, 108 50, 118 50 C 128 50, 130 65, 130 80 C 135 68, 142 55, 150 55 C 158 55, 160 70, 160 85 C 164 75, 170 65, 176 68 C 182 72, 180 85, 175 105 C 168 135, 155 165, 145 165 Z'
        'detail' = '<circle cx="82" cy="95" r="10" fill="#140F0D" stroke="#FF7A18" stroke-width="3"/><line x1="124" y1="62" x2="124" y2="105" stroke="#FF7A18" stroke-width="2"/><line x1="148" y1="68" x2="148" y2="110" stroke="#FF7A18" stroke-width="2"/>'
    };
    'G' = @{
        'label' = 'G'
        'desc' = 'Índice y pulgar extendidos hacia el lado'
        'path' = 'M 80 160 C 75 140, 75 120, 75 105 C 75 90, 85 85, 100 85 L 165 85 C 175 85, 178 95, 168 102 L 115 105 C 120 110, 145 110, 155 112 C 162 114, 160 122, 152 125 L 110 125 C 105 145, 95 160, 80 160 Z'
        'detail' = '<line x1="100" y1="92" x2="160" y2="92" stroke="#FF7A18" stroke-width="3" stroke-linecap="round"/><line x1="105" y1="118" x2="145" y2="118" stroke="#D4A87A" stroke-width="2.5" stroke-linecap="round"/>'
    };
    'I' = @{
        'label' = 'I'
        'desc' = 'Solo dedo meñique levantado hacia arriba'
        'path' = 'M 75 160 C 70 145, 68 125, 68 105 C 68 85, 80 80, 125 80 C 135 80, 140 85, 140 100 L 140 120 C 145 105, 150 65, 155 45 C 160 35, 170 38, 172 48 C 175 65, 170 115, 165 135 C 155 155, 140 160, 125 160 Z'
        'detail' = '<line x1="162" y1="52" x2="162" y2="110" stroke="#FF7A18" stroke-width="3" stroke-linecap="round"/><ellipse cx="102" cy="115" rx="25" ry="15" fill="#D4A87A" stroke="#FF7A18" stroke-width="2"/>'
    };
    'L' = @{
        'label' = 'L'
        'desc' = 'Pulgar e índice en ángulo recto formando una L'
        'path' = 'M 75 160 C 70 145, 70 125, 75 95 C 75 60, 82 45, 92 45 C 102 45, 105 60, 105 90 L 105 110 C 115 110, 130 112, 145 115 C 155 118, 150 135, 135 135 L 98 135 C 92 148, 85 160, 75 160 Z M 45 125 C 45 112, 55 105, 75 105 L 75 130 C 58 130, 45 132, 45 125 Z'
        'detail' = '<line x1="90" y1="55" x2="90" y2="105" stroke="#FF7A18" stroke-width="3" stroke-linecap="round"/><line x1="52" y1="118" x2="88" y2="118" stroke="#FF7A18" stroke-width="3" stroke-linecap="round"/>'
    };
    'M' = @{
        'label' = 'M'
        'desc' = 'Tres dedos doblados sobre el pulgar'
        'path' = 'M 70 160 C 65 145, 65 120, 68 100 C 72 82, 85 80, 95 90 C 102 80, 115 78, 125 88 C 132 80, 145 80, 155 92 C 162 102, 160 125, 155 140 C 145 155, 135 160, 115 160 Z'
        'detail' = '<path d="M 85 92 L 85 135 M 112 88 L 112 135 M 138 92 L 138 135" stroke="#FF7A18" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="112" cy="140" rx="35" ry="8" fill="#D4A87A"/>'
    };
    'O' = @{
        'label' = 'O'
        'desc' = 'Todos los dedos curvados formando un círculo O'
        'path' = 'M 95 165 C 80 145, 72 125, 72 105 C 72 75, 95 55, 125 55 C 155 55, 170 78, 170 105 C 170 135, 150 165, 120 165 Z'
        'detail' = '<ellipse cx="122" cy="108" rx="26" ry="30" fill="#140F0D" stroke="#FF7A18" stroke-width="4"/><circle cx="122" cy="108" r="8" fill="#D4A87A"/>'
    };
    'P' = @{
        'label' = 'P'
        'desc' = 'Índice hacia el frente y medio hacia abajo con pulgar'
        'path' = 'M 75 160 C 70 145, 72 125, 75 105 L 145 80 C 155 76, 160 85, 152 92 L 105 115 L 115 155 C 118 165, 105 170, 98 160 L 92 125 C 88 140, 82 155, 75 160 Z'
        'detail' = '<line x1="88" y1="105" x2="140" y2="86" stroke="#FF7A18" stroke-width="3" stroke-linecap="round"/><line x1="98" y1="120" x2="110" y2="155" stroke="#D4A87A" stroke-width="3" stroke-linecap="round"/>'
    };
    'U' = @{
        'label' = 'U'
        'desc' = 'Dedos índice y medio extendidos juntos hacia arriba'
        'path' = 'M 75 160 C 70 145, 70 120, 72 90 C 75 60, 82 45, 94 45 C 105 45, 108 58, 110 85 C 112 58, 116 45, 128 45 C 138 45, 144 58, 145 90 L 145 110 C 152 112, 155 125, 150 140 C 142 155, 130 160, 115 160 Z'
        'detail' = '<line x1="94" y1="52" x2="94" y2="115" stroke="#FF7A18" stroke-width="3" stroke-linecap="round"/><line x1="128" y1="52" x2="128" y2="115" stroke="#FF7A18" stroke-width="3" stroke-linecap="round"/><ellipse cx="110" cy="135" rx="25" ry="12" fill="#D4A87A" stroke="#FF7A18" stroke-width="2"/>'
    };
    'V' = @{
        'label' = 'V'
        'desc' = 'Dedos índice y medio extendidos separados en V'
        'path' = 'M 75 160 C 70 145, 70 120, 72 95 C 70 70, 68 50, 78 45 C 88 40, 95 55, 102 85 L 115 105 L 132 80 C 140 55, 148 42, 158 45 C 168 48, 165 70, 155 95 L 148 115 C 152 122, 150 135, 142 145 C 135 155, 125 160, 110 160 Z'
        'detail' = '<line x1="84" y1="52" x2="105" y2="100" stroke="#FF7A18" stroke-width="3" stroke-linecap="round"/><line x1="152" y1="52" x2="125" y2="100" stroke="#FF7A18" stroke-width="3" stroke-linecap="round"/><ellipse cx="112" cy="135" rx="22" ry="12" fill="#D4A87A" stroke="#FF7A18" stroke-width="2"/>'
    };
}

$dest = "d:\Sistema TLS (TRADUCTOR DE LENGUAJE DE SEÑAS)\TLS\app\src\main\assets\dictionary\es-LSM"

foreach ($key in $letters.Keys) {
    $item = $letters[$key]
    $label = $item['label']
    $desc = $item['desc']
    $body = $item['path']
    $detail = $item['detail']

    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" width="100%" height="100%">
  <defs>
    <radialGradient id="handBg_$key" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#2D1F18"/>
      <stop offset="100%" stop-color="#140F0D"/>
    </radialGradient>
    <linearGradient id="skinGrad_$key" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F2DEC9"/>
      <stop offset="50%" stop-color="#E5C7A9"/>
      <stop offset="100%" stop-color="#D4AA82"/>
    </linearGradient>
  </defs>
  
  <!-- Fondo redondeado con marco de colimador -->
  <rect width="220" height="220" rx="28" fill="url(#handBg_$key)"/>
  <rect x="5" y="5" width="210" height="210" rx="24" fill="none" stroke="#FF7A18" stroke-width="2" stroke-dasharray="8 6" opacity="0.5"/>
  
  <!-- Silueta anatómica realista de la mano -->
  <path d="$body" fill="url(#skinGrad_$key)" stroke="#FF7A18" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
  
  <!-- Detalles de flexión articular y uñas -->
  $detail
  
  <!-- Tarjeta inferior con la letra en grande -->
  <rect x="60" y="172" width="100" height="34" rx="10" fill="#1C1410" stroke="#FF7A18" stroke-width="2"/>
  <text x="110" y="196" font-family="sans-serif" font-size="22" font-weight="900" fill="#F7ECE1" text-anchor="middle">$label</text>
</svg>
"@
    Set-Content -Path "$dest\$key.svg" -Value $svg -Encoding UTF8
}

Write-Output "Generated $($letters.Count) anatomical hand SVGs!"
