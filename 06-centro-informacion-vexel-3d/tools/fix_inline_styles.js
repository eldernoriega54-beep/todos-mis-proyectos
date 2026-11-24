const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const CSS_PATH = path.join(ROOT, 'app vexel', 'style.css');
const BACKUP_DIR = path.join(ROOT, 'backups', 'inline-style-fix');

if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

const exts = ['.html', '.js', '.svg'];

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) {
      files = files.concat(walk(fp));
    } else if (exts.includes(path.extname(f).toLowerCase())) {
      files.push(fp);
    }
  }
  return files;
}

function hashStyle(s) {
  return 'is-' + crypto.createHash('md5').update(s).digest('hex').slice(0, 8);
}

const files = walk(ROOT);
let cssAdded = '';
let modified = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  // backup
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  fs.writeFileSync(path.join(BACKUP_DIR, rel.replace(/[\\/]/g, '_') + '.bak'), original, 'utf8');

  // replace style="..."
  content = content.replace(/style\s*=\s*\"([^\"]+?)\"/g, (m, style) => {
    const className = hashStyle(style);
    // create CSS rule
    const rule = `.${className} { ${style.trim()} }\n`;
    if (!cssAdded.includes(rule)) cssAdded += rule;
    // add class attr or append
    return `class=\"${className}\"`;
  });

  // Also handle style='...'
  content = content.replace(/style\s*=\s*\'([^\']+?)\'/g, (m, style) => {
    const className = hashStyle(style);
    const rule = `.${className} { ${style.trim()} }\n`;
    if (!cssAdded.includes(rule)) cssAdded += rule;
    return `class=\"${className}\"`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modified++;
  }
}

if (cssAdded) {
  fs.appendFileSync(CSS_PATH, '\n/* Auto-extracted inline styles */\n' + cssAdded, 'utf8');
}

console.log('Processed files:', files.length, 'Modified:', modified);
console.log('CSS rules added:', cssAdded ? cssAdded.split('\n').length - 1 : 0);
