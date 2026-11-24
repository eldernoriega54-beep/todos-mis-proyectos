const fs = require('fs');
const file = 'D:/centro de informacion vexel 3d/app vexel/index.html';
let data = fs.readFileSync(file, 'utf8');
const headerEnd = data.indexOf('</header>');
const textFontRow = data.indexOf('<div class="prop-row hidden" id="text-font-row">');
const block = `</header>

                    <div class="editor-body">
                        <!-- Barra de herramientas izquierda -->
                        <aside class="editor-tools-left">
                            <div class="tool-section">
                                <h5>Prenda</h5>
                                <select id="garment-selector" class="garment-select" aria-label="Seleccionar prenda">
                                    <option value="shirt-short">Manga Corta</option>
                                    <option value="shirt-long">Manga Larga</option>
                                    <option value="shirt-sleeveless">Sin Mangas</option>
                                    <option value="shirt-collar">Manga Larga Cuello</option>
                                    <option value="shirt-polo">Polo</option>
                                    <option value="pants-long">Pantalón Largo</option>
                                    <option value="pants-short">Short</option>
                                    <option value="blank">Lienzo en Blanco</option>
                                </select>
                            </div>

                            <div class="tools-divider"></div>

                            <div class="tool-section">
                                <h5>Herramientas</h5>
                                <div class="tools-grid">
                                    <!-- Nuevas herramientas -->
                                    <button class="tool-btn active" id="tool-select" title="Selección Única">
                                        <i class="fa-solid fa-arrow-pointer"></i>
                                        <span>Selección</span>
                                    </button>
                                    <button class="tool-btn" id="tool-group-select" title="Selección Múltiple">
                                        <i class="fa-solid fa-object-group"></i>
                                        <span>Múltiple</span>
                                    </button>
                                    <button class="tool-btn" id="tool-pencil" title="Lápiz Libre">
                                        <i class="fa-solid fa-pencil"></i>
                                        <span>Lápiz</span>
                                    </button>
                                    <button class="tool-btn" id="tool-slice" title="Dividir SVG">
                                        <i class="fa-solid fa-scissors"></i>
                                        <span>Cortar</span>
                                    </button>
                                    <button class="tool-btn" id="tool-curve" title="Curvar Línea de Corte">
                                        <i class="fa-solid fa-bezier-curve"></i>
                                        <span>Curva</span>
                                    </button>
                                    <button class="tool-btn" id="tool-group-objects" title="Agrupar Objetos">
                                        <i class="fa-solid fa-link"></i>
                                        <span>Agrupar</span>
                                    </button>
                                    <!-- Herramientas originales -->
                                    <button class="tool-btn" id="tool-text" title="Añadir Texto">
                                        <i class="fa-solid fa-font"></i>
                                        <span>Texto</span>
                                    </button>
                                    <button class="tool-btn" id="tool-shape" title="Añadir Forma">
                                        <i class="fa-solid fa-shapes"></i>
                                        <span>Forma</span>
                                    </button>
                                    <label class="tool-btn" for="tool-upload" title="Importar imagen o SVG">
                                        <i class="fa-solid fa-image"></i>
                                        <span>Importar</span>
                                    </label>
                                    <input type="file" id="tool-upload" accept="image/png,image/jpeg,image/svg+xml,image/gif" class="hidden">
                                    <button class="tool-btn" id="tool-text-arch" title="Texto curvado">
                                        <i class="fa-solid fa-text-slash"></i>
                                        <span>Curvar</span>
                                    </button>
                                    <button class="tool-btn" id="tool-elementos" title="Elementos Gráficos">
                                        <i class="fa-solid fa-shapes"></i>
                                        <span>Elementos</span>
                                    </button>
                                    <button class="tool-btn" id="tool-marcos" title="Añadir Marco">
                                        <i class="fa-regular fa-image"></i>
                                        <span>Marcos</span>
                                    </button>
                                </div>
                            </div>

                            <div class="tools-divider"></div>

                            <!-- Panel de propiedades del objeto seleccionado -->
                            <div class="tool-section hidden" id="properties-panel">
                                <h5>Propiedades</h5>
                                <div class="prop-row">
                                    <label for="prop-fill">Color de relleno</label>
                                    <input type="color" id="prop-fill" value="#4A148C" class="prop-color">
                                </div>
                                <div class="prop-row" id="stroke-row">
                                    <label for="prop-stroke">Borde</label>
                                    <input type="color" id="prop-stroke" value="#000000" class="prop-color">
                                    <label for="prop-stroke-width" class="sr-only">Ancho del borde</label>
                                    <input type="number" id="prop-stroke-width" min="0" max="20" value="0" class="prop-number" aria-label="Ancho del borde">
                                </div>
                                <div class="prop-row" id="opacity-row">
                                    <label for="prop-opacity">Opacidad <span id="opacity-label">100%</span></label>
                                    <input type="range" id="prop-opacity" min="0" max="100" value="100" class="prop-range" aria-label="Opacidad">
                                </div>
                                <div class="prop-row hidden" id="text-props-row">
                                    <label for="prop-font-size">Tamaño de fuente</label>
                                    <input type="number" id="prop-font-size" min="8" max="200" value="40" class="prop-number" aria-label="Tamaño de fuente">
                                </div>
                                `;
data = data.substring(0, headerEnd) + block + data.substring(textFontRow);
fs.writeFileSync(file, data);
console.log('Done');
