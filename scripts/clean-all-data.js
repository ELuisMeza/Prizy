import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función principal
async function main() {
  const productsPath = path.join(__dirname, '..', 'public', 'data', 'products.json');
  const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');
  
  console.log('Limpiando datos...\n');
  
  // 1. Eliminar todas las imágenes
  if (fs.existsSync(imagesDir)) {
    console.log(`Eliminando imágenes de: ${imagesDir}`);
    const files = fs.readdirSync(imagesDir);
    let deletedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      try {
        fs.unlinkSync(filePath);
        deletedCount++;
      } catch (error) {
        console.error(`Error al eliminar ${file}:`, error.message);
      }
    }
    
    console.log(`✅ Eliminadas ${deletedCount} imágenes\n`);
  } else {
    console.log('⚠️  Directorio de imágenes no existe\n');
  }
  
  // 2. Limpiar campo image de productos
  if (fs.existsSync(productsPath)) {
    console.log(`Limpiando campo 'image' de productos...`);
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    let cleanedCount = 0;
    
    products.forEach(product => {
      if (product.image) {
        delete product.image;
        cleanedCount++;
      }
    });
    
    // Guardar productos actualizados
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
    console.log(`✅ Eliminado campo 'image' de ${cleanedCount} productos\n`);
  } else {
    console.log('⚠️  Archivo de productos no existe\n');
  }
  
  console.log('✅ Limpieza completada');
}

// Ejecutar
main().catch(console.error);

