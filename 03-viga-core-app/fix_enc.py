import os

replacements = {
    'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú', 'Ã±': 'ñ',
    'Ã ': 'Á', 'Ã‰': 'É', 'Ã ': 'Í', 'Ã“': 'Ó', 'Ãš': 'Ú', 'Ã‘': 'Ñ',
    'Â¿': '¿', 'Â¡': '¡', 'â”€': '─', 'Ã¢â€\x80\x99': '→', 'Ã¢â€ â€™': '→',
    'â–¶': '▶', 'ðŸ  ': '🏁', 'â†±': '↱', 'â¬†': '⬆', 'Ã\x83Â³': 'ó'
}

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for k, v in replacements.items():
        content = content.replace(k, v)
        
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {path}")

for root, dirs, files in os.walk('d:/viga core app/app/src/main/java'):
    for f in files:
        if f.endswith('.kt'):
            fix_file(os.path.join(root, f))
print('Done')
