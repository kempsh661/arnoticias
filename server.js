const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Servir archivos estáticos
app.use(express.static('dist'));

// Middleware para servir páginas estáticas de noticias
app.get('/noticia/:id', (req, res) => {
  const newsId = req.params.id;
  const staticPagePath = path.join(__dirname, 'public', 'noticia', `${newsId}.html`);
  
  // Verificar si existe la página estática
  if (fs.existsSync(staticPagePath)) {
    console.log(`📄 Sirviendo página estática para noticia ${newsId}`);
    res.sendFile(staticPagePath);
  } else {
    // Si no existe, servir la SPA
    console.log(`🔄 Redirigiendo a SPA para noticia ${newsId}`);
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

// Todas las demás rutas sirven la SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📁 Sirviendo archivos estáticos desde: ${path.join(__dirname, 'dist')}`);
  console.log(`📄 Páginas estáticas de noticias desde: ${path.join(__dirname, 'public', 'noticia')}`);
});
