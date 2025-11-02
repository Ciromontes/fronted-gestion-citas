const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  const publicDir = path.join(__dirname, 'public');
  
  // Convertir icon-192.svg a PNG
  await sharp(path.join(publicDir, 'icon-192.svg'))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  
  console.log('✅ icon-192.png creado');
  
  // Convertir icon-512.svg a PNG
  await sharp(path.join(publicDir, 'icon-512.svg'))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  
  console.log('✅ icon-512.png creado');
}

convertSvgToPng().catch(console.error);

