const fs = require('fs');
let js = fs.readFileSync('C:\\Users\\ELDER NORIEGA\\Downloads\\chevez-para-github\\js\\admin-panel.js', 'utf8');
let idx = js.indexOf('async function editUser');
console.log(js.substring(idx, idx + 400));
