const fs = require('fs');
const path = require('path');

// Leer el archivo de noticias
const filePath = path.join(__dirname, 'src/data/newsData.js');
let content = fs.readFileSync(filePath, 'utf8');

// Crear fechas variadas para las noticias
const dates = [
  '2025-09-03T14:30:00', // Hoy - más reciente
  '2025-09-02T10:15:00', // Ayer
  '2025-09-01T16:45:00', // Hace 2 días
  '2025-08-31T09:20:00', // Hace 3 días
  '2025-08-30T14:00:00', // Hace 4 días
  '2025-08-29T11:30:00', // Hace 5 días
  '2025-08-28T08:45:00', // Hace 6 días
  '2025-08-27T15:20:00', // Hace 1 semana
  '2025-08-26T12:10:00', // Hace 8 días
  '2025-08-25T17:35:00', // Hace 9 días
  '2025-08-24T13:25:00', // Hace 10 días
  '2025-08-23T10:40:00', // Hace 11 días
  '2025-08-22T16:15:00', // Hace 12 días
  '2025-08-21T09:50:00', // Hace 13 días
  '2025-08-20T14:30:00', // Hace 2 semanas
  '2025-08-19T11:20:00', // Hace 15 días
  '2025-08-18T16:45:00', // Hace 16 días
  '2025-08-17T08:30:00', // Hace 17 días
  '2025-08-16T13:15:00', // Hace 18 días
  '2025-08-15T15:40:00', // Hace 19 días
  '2025-08-14T10:25:00', // Hace 20 días
  '2025-08-13T12:50:00', // Hace 3 semanas
  '2025-08-12T14:35:00', // Hace 22 días
  '2025-08-11T09:15:00', // Hace 23 días
  '2025-08-10T16:20:00', // Hace 24 días
  '2025-08-09T11:45:00', // Hace 25 días
  '2025-08-08T13:30:00', // Hace 26 días
  '2025-08-07T15:10:00', // Hace 27 días
  '2025-08-06T08:55:00', // Hace 28 días
  '2025-08-05T12:40:00', // Hace 29 días
  '2025-08-04T14:25:00', // Hace 1 mes
];

// Contador para las fechas
let dateIndex = 0;

// Reemplazar todas las fechas con fechas variadas
content = content.replace(/date: new Date\('2025-09-03'\),/g, () => {
  const newDate = dates[dateIndex % dates.length];
  dateIndex++;
  return `date: new Date('${newDate}'),`;
});

// Escribir el archivo actualizado
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fechas de noticias actualizadas exitosamente');
console.log(`📅 Se actualizaron ${dateIndex} noticias con fechas variadas`);

