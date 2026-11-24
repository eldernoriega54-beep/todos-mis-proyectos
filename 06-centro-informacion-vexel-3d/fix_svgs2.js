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
            
            // Re-extract entities just in case they were left behind
            const entities = {};
            const regex = /<!ENTITY\s+(\w+)\s+"([^"]+)">/g;
            let match;
            while ((match = regex.exec(s)) !== null) {
                entities[match[1]] = match[2];
            }
            
            // Replace entities again just in case
            for (const [key, val] of Object.entries(entities)) {
                s = s.replace(new RegExp('&' + key + ';', 'g'), val);
            }
            
            // Find where <svg begins
            const svgIndex = s.indexOf('<svg');
            if (svgIndex > -1) {
                // Keep the xml declaration if it exists
                const xmlMatch = s.match(/<\?xml[^>]+>/);
                let xmlDecl = xmlMatch ? xmlMatch[0] + '\n' : '';
                
                // Construct the cleaned string
                s = xmlDecl + s.substring(svgIndex);
            }
            
            fs.writeFileSync(fp, s, 'utf8');
            console.log('Fully cleaned SVG:', f);
        }
    });
}

processDir(path.join(__dirname, 'app vexel/estiloscamisas'));
processDir(path.join(__dirname, 'app vexel/estilospantalones'));
