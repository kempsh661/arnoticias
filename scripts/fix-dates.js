const fs = require('fs');
const path = require('path');

// Leer el archivo de noticias
const filePath = path.join(__dirname, 'src/data/newsData.js');
let content = fs.readFileSync(filePath, 'utf8');

// Mapeo de títulos a fechas correctas
const newsDates = {
  // Noticias del 2 de septiembre
  'EN LIBERTAD MUJERES Y MENOR SECUESTRADOS EN TAME': '2025-09-02T16:15:00',
  'Avanza el proyecto del multicampus universitario en Saravena': '2025-09-02T09:50:00',
  'Subsidio Familiar de Vivienda en Arrendamiento para Población Migrante': '2025-09-02T12:10:00',
  'Más colegios de Arauca, a tono con la cultura tributaria': '2025-09-02T17:35:00',
  'Vigilancia y control del Programa de Alimentación Escolar PAE': '2025-09-02T13:25:00',
  'Lanzamiento del Circuito de la Llanura 2025': '2025-09-02T10:40:00',
  
  // Noticias del 3 de septiembre
  'Bienestar Familiar promueve la unión y el diálogo en familias de Arauca': '2025-09-03T10:15:00',
  'Avances en la Comisión Primera de Cámara de Representantes Colombia': '2025-09-03T10:15:00',
  'Reinicia entrega de comidas calientes para adultos mayores en Arauca': '2025-09-03T16:45:00',
  'Gestora social promueve el Cacao araucano y grandes eventos en Arauquita': '2025-09-03T09:20:00',
  'Diputada Alexa Quirife anuncia la pavimentación de la vía hacia Alto Cravo en Tame': '2025-09-03T14:00:00',
  'Gestores de convivencia llegan a instituciones educativas de Arauca': '2025-09-03T11:30:00',
  'Arauca ocupa el tercer lugar nacional en tutelas por servicios de salud': '2025-09-03T08:45:00',
  'Alteración del orden público en Saravena deja dos uniformados de la Sijín muertos': '2025-09-03T14:30:00'
};

// Función para encontrar y reemplazar fechas basándose en títulos
Object.entries(newsDates).forEach(([title, date]) => {
  // Buscar el patrón que incluye el título y la fecha
  const pattern = new RegExp(`(title: '${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'.*?date: new Date\\(')[^']+('\\),)`, 's');
  const replacement = `$1${date}$2`;
  
  content = content.replace(pattern, replacement);
});

// Escribir el archivo actualizado
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fechas de noticias corregidas según las fechas reales de subida');
console.log('📅 Noticias del 2 de septiembre: 6 noticias');
console.log('📅 Noticias del 3 de septiembre: 8 noticias');

