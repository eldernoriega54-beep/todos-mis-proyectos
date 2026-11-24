const fs = require('fs');
let js = fs.readFileSync('C:\\Users\\ELDER NORIEGA\\Downloads\\chevez-para-github\\js\\admin-panel.js', 'utf8');
js = js.replace(/html:\s*<div style="text-align: left; margin-bottom: 10px;">/g, 'html: \\n<div style="text-align: left; margin-bottom: 10px;">');
js = js.replace(/<\/div>,\s*confirmButtonText:/g, '</div>,\n        confirmButtonText:');
fs.writeFileSync('C:\\Users\\ELDER NORIEGA\\Downloads\\chevez-para-github\\js\\admin-panel.js', js, 'utf8');
