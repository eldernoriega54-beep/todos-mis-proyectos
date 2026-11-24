$dest = "d:\Sistema TLS (TRADUCTOR DE LENGUAJE DE SEÑAS)\TLS\app\src\main\assets\dictionary\es-LSM"

# Plantillas de iconos SVG limpios, minimalistas y anatómicos (estilo silueta moderna)
$svgData = @{
    # A: Puño cerrado con pulgar al costado hacia arriba
    'A' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Muñeca y palma -->
  <path d="M 70 180 C 70 145, 60 120, 60 95 C 60 85, 70 75, 85 75 C 92 75, 96 80, 100 85 C 104 80, 110 75, 118 75 C 126 75, 130 80, 134 85 C 138 80, 146 76, 154 78 C 162 82, 162 90, 160 105 C 158 135, 150 155, 140 180 Z" fill="#E87A30"/>
  <!-- Pulgar vertical al lado del puño -->
  <path d="M 68 115 C 50 115, 42 105, 42 85 C 42 70, 52 65, 62 65 C 72 65, 78 75, 78 95 C 78 110, 72 115, 68 115 Z" fill="#E87A30"/>
  <!-- Líneas sutiles de separación de dedos doblados -->
  <line x1="100" y1="85" x2="100" y2="120" stroke="#1A1210" stroke-width="3" stroke-linecap="round"/>
  <line x1="130" y1="85" x2="130" y2="120" stroke="#1A1210" stroke-width="3" stroke-linecap="round"/>
</svg>
'@

    # B: 4 dedos extendidos juntos hacia arriba, pulgar doblado
    'B' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- 4 dedos extendidos juntos -->
  <path d="M 70 180 C 70 135, 68 95, 68 45 C 68 32, 80 25, 90 25 C 100 25, 102 35, 102 45 L 102 38 C 102 26, 114 20, 122 20 C 130 20, 134 26, 134 38 L 134 42 C 134 30, 146 25, 154 25 C 162 25, 164 32, 164 45 L 164 55 C 164 42, 174 40, 180 45 C 186 50, 184 62, 182 80 C 178 120, 160 155, 145 180 Z" fill="#E87A30"/>
  <!-- Pulgar doblado horizontalmente sobre la palma -->
  <path d="M 68 125 C 54 125, 50 135, 55 145 C 60 152, 75 152, 95 145 C 110 140, 115 130, 105 125 Z" fill="#D4A87A"/>
  <!-- Separaciones entre dedos -->
  <line x1="102" y1="45" x2="102" y2="105" stroke="#1A1210" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="134" y1="42" x2="134" y2="105" stroke="#1A1210" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="164" y1="55" x2="164" y2="108" stroke="#1A1210" stroke-width="2.5" stroke-linecap="round"/>
</svg>
'@

    # C: Mano en curva lateral formando la letra C
    'C' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Arco continuo en C con puntas redondeadas anatómicas -->
  <path d="M 85 180 C 72 150, 68 120, 72 95 C 78 60, 105 40, 145 40 C 165 40, 175 52, 168 65 C 160 76, 142 68, 130 68 C 105 68, 95 85, 95 105 C 95 125, 105 142, 130 142 C 145 142, 160 135, 168 145 C 174 156, 162 170, 140 170 C 105 170, 92 165, 85 180 Z" fill="#E87A30"/>
</svg>
'@

    # D: Índice hacia arriba, resto en círculo con pulgar
    'D' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Muñeca y dedo índice apuntando recto arriba -->
  <path d="M 80 180 C 80 145, 80 100, 80 45 C 80 30, 94 22, 104 22 C 114 22, 116 32, 116 55 L 116 100 C 125 90, 145 88, 158 95 C 172 105, 172 125, 165 142 C 156 160, 138 175, 115 175 C 100 175, 90 180, 80 180 Z" fill="#E87A30"/>
  <!-- Círculo interior entre pulgar y dedos -->
  <circle cx="134" cy="132" r="18" fill="#140F0D"/>
</svg>
'@

    # E: Dedos recogidos tocando el pulgar
    'E' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Cuerpo del puño cerrado con uñas expuestas -->
  <path d="M 70 180 C 70 145, 65 120, 65 95 C 65 78, 80 70, 95 70 C 115 70, 145 70, 155 80 C 165 90, 165 110, 158 135 C 150 160, 135 180, 115 180 Z" fill="#E87A30"/>
  <!-- Pulgar cruzado en la base -->
  <path d="M 65 130 C 50 130, 48 142, 55 152 C 65 162, 85 160, 115 150 C 135 142, 140 132, 128 126 Z" fill="#D4A87A"/>
  <!-- Ranura entre dedos recogidos y pulgar -->
  <line x1="75" y1="108" x2="148" y2="108" stroke="#1A1210" stroke-width="4" stroke-linecap="round"/>
</svg>
'@

    # F: Pulgar e índice en círculo, 3 dedos extendidos arriba
    'F' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- 3 dedos extendidos (medio, anular, meñique) -->
  <path d="M 75 180 C 75 145, 70 120, 75 105 C 62 98, 62 82, 72 75 C 84 68, 95 78, 98 90 L 98 48 C 98 34, 110 26, 120 26 C 130 26, 132 36, 132 50 L 132 45 C 132 32, 144 28, 152 28 C 160 28, 164 35, 164 52 L 164 58 C 164 45, 174 42, 180 46 C 188 52, 185 68, 180 88 C 172 130, 155 165, 140 180 Z" fill="#E87A30"/>
  <!-- Círculo del índice y pulgar -->
  <circle cx="85" cy="100" r="14" fill="#140F0D"/>
  <line x1="132" y1="55" x2="132" y2="110" stroke="#1A1210" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="164" y1="62" x2="164" y2="115" stroke="#1A1210" stroke-width="2.5" stroke-linecap="round"/>
</svg>
'@

    # G: Índice y pulgar paralelos en horizontal
    'G' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Mano con índice apuntando a la derecha -->
  <path d="M 70 180 C 70 145, 68 120, 68 95 C 68 80, 80 75, 100 75 L 175 75 C 186 75, 188 88, 178 95 L 115 98 C 120 102, 145 102, 162 105 C 172 108, 170 120, 158 122 L 112 122 C 105 145, 95 165, 80 180 Z" fill="#E87A30"/>
  <line x1="102" y1="86" x2="170" y2="86" stroke="#1A1210" stroke-width="3" stroke-linecap="round"/>
  <line x1="108" y1="114" x2="152" y2="114" stroke="#D4A87A" stroke-width="3" stroke-linecap="round"/>
</svg>
'@

    # I: Solo dedo meñique levantado hacia arriba
    'I' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Puño cerrado con meñique vertical a la derecha -->
  <path d="M 70 180 C 70 145, 65 125, 65 105 C 65 85, 80 78, 120 78 C 135 78, 142 85, 142 105 L 142 75 C 142 55, 148 35, 158 35 C 168 35, 172 45, 172 70 L 172 110 C 172 135, 160 160, 140 180 Z" fill="#E87A30"/>
  <!-- Pulgar cruzado sobre los otros dedos doblados -->
  <path d="M 65 120 C 50 120, 48 132, 55 142 C 68 152, 95 150, 118 138 C 128 132, 125 120, 110 118 Z" fill="#D4A87A"/>
  <!-- Separación meñique / palma -->
  <line x1="142" y1="80" x2="142" y2="135" stroke="#1A1210" stroke-width="3" stroke-linecap="round"/>
</svg>
'@

    # L: Índice y pulgar a 90 grados formando una L
    'L' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Índice apuntando hacia arriba y pulgar extendido hacia la izquierda -->
  <path d="M 85 180 C 85 150, 85 120, 85 55 C 85 35, 96 26, 108 26 C 120 26, 122 38, 122 65 L 122 112 C 135 112, 150 115, 162 120 C 172 125, 168 140, 152 140 L 118 140 C 108 160, 98 175, 85 180 Z" fill="#E87A30"/>
  <!-- Pulgar horizontal a 90 grados -->
  <path d="M 88 112 L 35 112 C 22 112, 20 125, 30 132 L 88 135 Z" fill="#E87A30"/>
  <line x1="88" y1="112" x2="88" y2="145" stroke="#1A1210" stroke-width="3" stroke-linecap="round"/>
</svg>
'@

    # M: Tres dedos sobre el pulgar
    'M' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Puño con tres nudillos/dedos cayendo sobre el pulgar -->
  <path d="M 68 180 C 68 145, 62 120, 68 95 C 72 80, 85 75, 96 85 C 104 76, 118 75, 126 85 C 134 76, 148 76, 156 88 C 164 100, 162 125, 156 145 C 145 165, 130 180, 110 180 Z" fill="#E87A30"/>
  <!-- Líneas que marcan los 3 dedos -->
  <line x1="96" y1="85" x2="96" y2="135" stroke="#1A1210" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="126" y1="85" x2="126" y2="135" stroke="#1A1210" stroke-width="3.5" stroke-linecap="round"/>
  <ellipse cx="112" cy="142" rx="36" ry="8" fill="#D4A87A"/>
</svg>
'@

    # O: Círculo cerrado de la letra O
    'O' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Silueta ovalada externa -->
  <path d="M 85 180 C 75 150, 65 125, 65 105 C 65 65, 90 45, 125 45 C 160 45, 175 70, 175 105 C 175 140, 150 175, 120 180 Z" fill="#E87A30"/>
  <!-- Orificio central limpio que forma la O -->
  <ellipse cx="122" cy="106" rx="26" ry="32" fill="#140F0D"/>
</svg>
'@

    # P: Dedo índice hacia el frente y dedo medio hacia abajo con pulgar
    'P' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Mano inclinada con dedo extendido horizontal e índice inclinado -->
  <path d="M 70 180 C 70 145, 70 120, 75 105 L 165 75 C 176 72, 180 82, 170 90 L 115 112 L 122 165 C 124 176, 110 180, 102 170 L 96 125 C 90 145, 82 165, 70 180 Z" fill="#E87A30"/>
  <line x1="90" y1="108" x2="155" y2="84" stroke="#1A1210" stroke-width="3" stroke-linecap="round"/>
  <line x1="100" y1="120" x2="115" y2="165" stroke="#D4A87A" stroke-width="3" stroke-linecap="round"/>
</svg>
'@

    # U: Índice y medio juntos extendidos hacia arriba
    'U' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Índice y medio juntos rectos hacia arriba -->
  <path d="M 75 180 C 75 145, 72 120, 72 65 C 72 45, 84 35, 96 35 C 106 35, 110 45, 112 65 L 112 55 C 112 42, 122 35, 134 35 C 146 35, 150 45, 150 65 L 150 115 C 158 118, 162 130, 156 145 C 148 165, 135 178, 115 180 Z" fill="#E87A30"/>
  <!-- Pulgar doblado sobre anular y meñique -->
  <path d="M 68 125 C 55 125, 52 136, 60 145 C 72 154, 98 152, 122 142 C 132 136, 128 125, 115 124 Z" fill="#D4A87A"/>
  <!-- Separación entre índice y medio -->
  <line x1="112" y1="45" x2="112" y2="120" stroke="#1A1210" stroke-width="3" stroke-linecap="round"/>
</svg>
'@

    # V: Índice y medio separados en forma de V
    'V' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Índice hacia la izquierda y medio hacia la derecha en ángulo V -->
  <path d="M 75 180 C 75 145, 75 120, 78 95 L 68 55 C 65 38, 78 30, 88 35 C 98 42, 102 58, 108 85 L 115 105 L 132 78 C 142 55, 150 38, 162 42 C 172 48, 170 65, 158 92 L 148 115 C 155 122, 152 135, 142 148 C 132 165, 120 178, 105 180 Z" fill="#E87A30"/>
  <!-- Pulgar doblado -->
  <path d="M 72 125 C 60 125, 58 135, 65 144 C 75 152, 100 150, 120 140 C 130 134, 126 124, 115 122 Z" fill="#D4A87A"/>
</svg>
'@
}

foreach ($key in $svgData.Keys) {
    Set-Content -Path "$dest\$key.svg" -Value $svgData[$key] -Encoding UTF8
}

Write-Output "Generated 14 clean, iconic silhouette hand SVGs!"
