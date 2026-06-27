const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '01 -Internos');
const dirs = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

const template = (title) => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | La Singcopedia</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../css/styles.css">
</head>
<body>
  <header class="site-header">
    <a class="site-logo" href="../../index.html" aria-label="Ir al inicio">La Singcopedia</a>
    <nav class="site-nav" aria-label="Navegación principal">
      <a href="../../index.html">Inicio</a>
      <a href="../02 - Cursos/Index.html">Cursos</a>
      <a href="../../index.html#about">Acerca de</a>
    </nav>
  </header>

  <main style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 2rem;">
    <h1 style="font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 6vw, 5rem); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: -0.05em;">${title}</h1>
    <p style="color: var(--muted); font-size: 1.25rem; max-width: 600px; margin-bottom: 2rem; line-height: 1.6;">Esta sección de la Singcopedia estará disponible muy pronto con información técnica, interactiva e inmersiva sobre este material.</p>
    <a href="../02 - Cursos/Index.html" style="display: inline-flex; align-items: center; padding: 0.9rem 1.4rem; border-radius: 999px; background: var(--orange); color: white; text-decoration: none; font-weight: 600; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 30px rgba(255,76,41,0.3)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">Volver al mapa</a>
  </main>
</body>
</html>
`;

dirs.forEach(dir => {
  const dirPath = path.join(baseDir, dir);
  const files = fs.readdirSync(dirPath);
  const indexFile = files.find(f => f.toLowerCase() === 'index.html');
  if (indexFile) {
    const filePath = path.join(dirPath, indexFile);
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      const match = dir.match(/^\d+\s*-\s*(.*)$/);
      let title = match ? match[1] : dir;
      title = title.charAt(0).toUpperCase() + title.slice(1);
      console.log(`Writing placeholder for ${title} to ${filePath}`);
      fs.writeFileSync(filePath, template(title), 'utf8');
    }
  }
});
console.log('All placeholders generated successfully.');
