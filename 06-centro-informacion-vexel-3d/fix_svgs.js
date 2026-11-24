const fs = require('fs');
const path = require('path');

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        const fp = path.join(dir, f);
        if (fs.statSync(fp).isDirectory()) {
            processDir(fp);
        } else if (fp.endsWith('.svg')) {
            let s = fs.readFileSync(fp, 'utf8');
            
            // Extract entities
            const entities = {};
            const regex = /<!ENTITY\s+(\w+)\s+"([^"]+)">/g;
            let match;
            while ((match = regex.exec(s)) !== null) {
                entities[match[1]] = match[2];
            }
            
            // Replace entities
            for (const [key, val] of Object.entries(entities)) {
                s = s.replace(new RegExp('&' + key + ';', 'g'), val);
            }
            
            // Remove DOCTYPE as it causes issues in FabricJS sometimes
            s = s.replace(/<!DOCTYPE[^>]+>/g, '');
            
            fs.writeFileSync(fp, s, 'utf8');
            console.log('Fixed SVG:', f);
        }
    });
}

processDir(path.join(__dirname, 'app vexel/estiloscamisas'));
processDir(path.join(__dirname, 'app vexel/estilospantalones'));
