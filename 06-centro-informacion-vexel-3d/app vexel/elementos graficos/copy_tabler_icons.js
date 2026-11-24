const fs = require('fs').promises;
const path = require('path');

const srcBase = path.join(__dirname, 'tabler-icons-main', 'tabler-icons-main', 'icons');
const destBase = path.join(__dirname, 'tabler');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyDir(src, dest) {
  try {
    const entries = await fs.readdir(src, { withFileTypes: true });
    await ensureDir(dest);
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        // copy only .svg files
        if (entry.name.toLowerCase().endsWith('.svg')) {
          await fs.copyFile(srcPath, destPath);
        }
      }
    }
  } catch (err) {
    console.error('Error copying', src, '->', dest, err.message);
    throw err;
  }
}

async function main() {
  try {
    const categories = ['filled', 'outline'];
    for (const cat of categories) {
      const src = path.join(srcBase, cat);
      const dest = path.join(destBase, cat);
      console.log(`Copying ${src} -> ${dest}`);
      await copyDir(src, dest);
    }
    console.log('Copy complete.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
