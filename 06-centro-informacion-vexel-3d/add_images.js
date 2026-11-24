const fs = require('fs');
let c = fs.readFileSync('d:/centro de informacion vexel 3d/merch.html', 'utf8');

const images = [
    'app vexel/imagenes de la app/minecraft_creeper.png',
    'app vexel/imagenes de la app/minecraft_steve.png',
    'app vexel/imagenes de la app/Gemini_Generated_Image_4k2gej4k2gej4k2g.png',
    'app vexel/imagenes de la app/Gemini_Generated_Image_6kr4na6kr4na6kr4.png',
    'app vexel/imagenes de la app/Gemini_Generated_Image_exskudexskudexsk.png',
    'app vexel/imagenes de la app/Gemini_Generated_Image_km02blkm02blkm02.png'
];

let i = 0;
// Replace <div class="product-icon-wrap">...</div> with image tags
c = c.replace(/<div class="product-icon-wrap">[\s\S]*?<\/div>/g, function(match) {
    const imgStr = `<div class="product-img-wrap"><img src="${images[i % images.length]}" alt="Producto" style="width:100%; height:auto; border-radius:12px; margin-bottom:15px; box-shadow:0 0 20px rgba(224,64,251,0.2);"></div>`;
    i++;
    return imgStr;
});

fs.writeFileSync('d:/centro de informacion vexel 3d/merch.html', c, 'utf8');
console.log('Images added to merch.html!');
