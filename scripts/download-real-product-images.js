import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear directorio de imágenes si no existe
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log(`Creado directorio: ${imagesDir}`);
}

// Función para descargar una imagen desde una URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, (response) => {
      // Seguir redirects
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
        request.abort();
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Error al descargar: ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
    
    request.setTimeout(30000, () => {
      request.abort();
      reject(new Error('Timeout al descargar imagen'));
    });
  });
}

// Función para buscar múltiples URLs de imágenes (intenta varias si la primera falla)
async function getImageUrls(searchTerm, browser, maxUrls = 5) {
  let page = null;
  const urls = [];
  
  // Intentar primero con Bing (más confiable)
  try {
    page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const bingUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(searchTerm)}&first=1&qft=+filterui:imagesize-large`;
    await page.goto(bingUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Obtener múltiples URLs de imágenes desde los datos JSON de Bing
    const imageUrls = await page.evaluate((max) => {
      // Función para verificar si es una URL válida (no thumbnail)
      const isValidUrl = (url) => {
        if (!url || !url.startsWith('http')) return false;
        // Excluir thumbnails de Bing
        if (url.includes('th.bing.com/th?')) return false;
        if (url.includes('bing.com/th?q=')) return false;
        if (url.includes('w=42') || url.includes('h=42')) return false;
        return true;
      };
      
      const foundUrls = [];
      const seenUrls = new Set();
      
      // Buscar elementos con atributo m (contiene JSON con la URL)
      const imagesWithData = document.querySelectorAll('a.iusc, div[data-ri]');
      
      for (const element of imagesWithData) {
        if (foundUrls.length >= max) break;
        
        // Buscar el atributo m en el elemento o en imágenes hijas
        const img = element.querySelector('img[m]') || element;
        const m = img.getAttribute('m');
        
        if (m) {
          try {
            const data = JSON.parse(m);
            // Bing almacena la URL en murl (URL original) o turl (thumbnail)
            if (data.murl && isValidUrl(data.murl) && !seenUrls.has(data.murl)) {
              foundUrls.push(data.murl);
              seenUrls.add(data.murl);
            } else if (!data.murl && data.turl && isValidUrl(data.turl) && !seenUrls.has(data.turl)) {
              foundUrls.push(data.turl);
              seenUrls.add(data.turl);
            }
          } catch (e) {
            // Continuar
          }
        }
        
        // Buscar en el atributo href del link
        if (element.href && element.href.includes('mediaurl=')) {
          const match = element.href.match(/mediaurl=([^&]+)/);
          if (match) {
            const url = decodeURIComponent(match[1]);
            if (isValidUrl(url) && !seenUrls.has(url)) {
              foundUrls.push(url);
              seenUrls.add(url);
            }
          }
        }
      }
      
      // Método alternativo: buscar en scripts que contienen datos JSON
      if (foundUrls.length < max) {
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
          if (foundUrls.length >= max) break;
          const content = script.textContent || '';
          if (content.includes('"murl":')) {
            // Buscar todas las ocurrencias de murl
            const matches = content.matchAll(/"murl"\s*:\s*"([^"]+)"/g);
            for (const match of matches) {
              if (foundUrls.length >= max) break;
              const url = match[1].replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
                return String.fromCharCode(parseInt(code, 16));
              });
              if (isValidUrl(url) && !seenUrls.has(url)) {
                foundUrls.push(url);
                seenUrls.add(url);
              }
            }
          }
        }
      }
      
      return foundUrls;
    }, maxUrls);
    
    if (imageUrls && imageUrls.length > 0) {
      await page.close();
      return imageUrls;
    }
    await page.close();
  } catch (bingError) {
    if (page) await page.close().catch(() => {});
  }
  
  // Fallback: Intentar con DuckDuckGo
  try {
    page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const ddgUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchTerm)}&iax=images&ia=images`;
    await page.goto(ddgUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const imageUrls = await page.evaluate((max) => {
      const foundUrls = [];
      const seenUrls = new Set();
      const allImages = Array.from(document.querySelectorAll('img'));
      
      for (const img of allImages) {
        if (foundUrls.length >= max) break;
        
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('srcset');
        if (src) {
          // Si es srcset, tomar la primera URL
          let actualSrc = src;
          if (src.includes(' ')) {
            actualSrc = src.split(' ')[0];
          }
          
          if (actualSrc.startsWith('http') && 
              !actualSrc.includes('data:image') &&
              !actualSrc.includes('duckduckgo.com/i/') &&
              !actualSrc.includes('logo') &&
              !seenUrls.has(actualSrc)) {
            
            // Buscar link padre
            let parent = img.closest('a');
            if (parent && parent.href && parent.href.startsWith('http') && !seenUrls.has(parent.href)) {
              foundUrls.push(parent.href);
              seenUrls.add(parent.href);
            } else if (!seenUrls.has(actualSrc)) {
              foundUrls.push(actualSrc);
              seenUrls.add(actualSrc);
            }
          }
        }
      }
      return foundUrls;
    }, maxUrls);
    
    if (imageUrls && imageUrls.length > 0) {
      await page.close();
      return imageUrls;
    }
    await page.close();
  } catch (ddgError) {
    if (page) await page.close().catch(() => {});
  }
  
  return [];
}

// Función para buscar la primera imagen (wrapper para compatibilidad)
async function getFirstImageUrl(searchTerm, browser) {
  const urls = await getImageUrls(searchTerm, browser, 1);
  return urls.length > 0 ? urls[0] : null;
}

// Función para obtener término de búsqueda mejorado
function getSearchTerm(productName, category, subcategory) {
  // Limpiar el nombre del producto y usar solo las primeras palabras clave
  const nameLower = productName.toLowerCase();
  
  // Traducciones comunes para mejorar la búsqueda
  const translations = {
    'iphone': 'iphone',
    'samsung': 'samsung',
    'xiaomi': 'xiaomi',
    'motorola': 'motorola',
    'huawei': 'huawei',
    'laptop': 'laptop',
    'macbook': 'macbook',
    'ipad': 'ipad',
    'tablet': 'tablet',
    'tv': 'television',
    'televisor': 'television',
    'audífonos': 'headphones',
    'auriculares': 'headphones',
    'parlante': 'speaker',
    'refrigerador': 'refrigerator',
    'lavadora': 'washing machine',
    'microondas': 'microwave',
    'aspiradora': 'vacuum cleaner'
  };
  
  // Usar las primeras 2-3 palabras del nombre del producto directamente
  // (ya que las traducciones pueden crear duplicados innecesarios)
  const words = productName.split(' ').slice(0, 3).join(' ');
  return words;
}

// Función principal
async function main() {
  const productsPath = path.join(__dirname, '..', 'public', 'data', 'products.json');
  const categoriesPath = path.join(__dirname, '..', 'public', 'data', 'categories.json');
  const outputPath = productsPath;
  
  console.log('Leyendo productos y categorías...');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
  
  // Agrupar productos por nombre base para reutilizar imágenes
  const imageMap = new Map();
  products.forEach(product => {
    // Extraer nombre base (sin tienda)
    const nameBase = product.name.toLowerCase()
      .replace(/\s+(techstore|mobile world|electrosmart|falabella|ripley|saga|oechsle|linio|plaza vea|tottus|supermercados|real plaza|paruro|gamarra|mercadolibre).*$/i, '')
      .trim();
    
    if (!imageMap.has(nameBase)) {
      const category = categories.find(cat => 
        cat.name.es === product.category.es || cat.name.en === product.category.es
      );
      const subcategory = category?.subcategories?.find(sub => 
        sub.name.es === product.subcategory.es || sub.name.en === product.subcategory.es
      );
      
      imageMap.set(nameBase, {
        product: product,
        category: category ? { id: category.id, name: category.name } : null,
        subcategory: subcategory ? { id: subcategory.id, name: subcategory.name } : null
      });
    }
  });
  
  console.log(`\nEncontrados ${imageMap.size} productos únicos para buscar imágenes`);
  console.log('Iniciando navegador...\n');
  
  // Iniciar navegador
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage'
    ]
  });
  
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  let processed = 0;
  
  try {
    for (const [nameBase, { product, category, subcategory }] of imageMap.entries()) {
      const searchTerm = getSearchTerm(product.name, category, subcategory);
      const filename = `${product.id}.jpg`;
      const filepath = path.join(imagesDir, filename);
      
      // Si el archivo ya existe, reutilizarlo
      if (fs.existsSync(filepath)) {
        const localUrl = `/images/products/${filename}`;
        products.forEach(p => {
          const pNameBase = p.name.toLowerCase()
            .replace(/\s+(techstore|mobile world|electrosmart|falabella|ripley|saga|oechsle|linio|plaza vea|tottus|supermercados|real plaza|paruro|gamarra|mercadolibre).*$/i, '')
            .trim();
          // Asignar imagen siempre si el producto coincide (asegurar que tenga el atributo image)
          if (pNameBase === nameBase) {
            p.image = localUrl;
          }
        });
        skipped++;
        processed++;
        if (processed % 10 === 0) {
          console.log(`Procesados ${processed}/${imageMap.size} productos únicos...`);
        }
        continue;
      }
      
      try {
        console.log(`Buscando imagen para: ${searchTerm}...`);
        // Obtener múltiples URLs para intentar si la primera falla
        const imageUrls = await getImageUrls(searchTerm, browser, 5);
        
        if (!imageUrls || imageUrls.length === 0) {
          throw new Error('No se encontró imagen');
        }
        
        let downloadedSuccess = false;
        let lastError = null;
        
        // Intentar descargar cada URL hasta que una funcione
        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          
          if (!imageUrl || imageUrl === 'null' || imageUrl.includes('th.bing.com/th?')) {
            continue;
          }
          
          try {
            console.log(`   Intentando URL ${i + 1}/${imageUrls.length}: ${imageUrl.substring(0, 80)}...`);
            // Descargar imagen
            await downloadImage(imageUrl, filepath);
            
            // Verificar que el archivo se descargó correctamente (al menos 5KB para imágenes reales)
            if (fs.existsSync(filepath) && fs.statSync(filepath).size > 5000) {
              const localUrl = `/images/products/${filename}`;
              
              // Asignar imagen a todos los productos con el mismo nombre base
              products.forEach(p => {
                const pNameBase = p.name.toLowerCase()
                  .replace(/\s+(techstore|mobile world|electrosmart|falabella|ripley|saga|oechsle|linio|plaza vea|tottus|supermercados|real plaza|paruro|gamarra|mercadolibre).*$/i, '')
                  .trim();
                if (pNameBase === nameBase) {
                  p.image = localUrl;
                }
              });
              
              downloadedSuccess = true;
              processed++;
              console.log(`✅ Descargada: ${searchTerm}`);
              break; // Éxito, salir del bucle
            } else {
              // Eliminar archivo si está corrupto
              if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
              }
              lastError = new Error(`Archivo descargado está vacío o es muy pequeño (${fs.existsSync(filepath) ? fs.statSync(filepath).size : 0} bytes)`);
            }
          } catch (downloadError) {
            // Eliminar archivo si existe
            if (fs.existsSync(filepath)) {
              try {
                fs.unlinkSync(filepath);
              } catch (e) {
                // Ignorar errores al eliminar
              }
            }
            lastError = downloadError;
            // Continuar con la siguiente URL
            continue;
          }
        }
        
        if (!downloadedSuccess) {
          throw lastError || new Error('Todas las URLs fallaron');
        }
        
        // Incrementar contador global de descargadas
        downloaded++;
      } catch (error) {
        console.error(`❌ Error para "${searchTerm}":`, error.message);
        failed++;
        processed++;
      }
      
      // Pausa entre búsquedas (2 segundos para evitar bloqueos)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Guardar progreso cada 10 productos
      if (processed % 10 === 0) {
        fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf8');
        console.log(`\n💾 Progreso guardado: ${processed}/${imageMap.size} productos únicos procesados\n`);
      }
    }
  } finally {
    await browser.close();
  }
  
  // Escribir archivo final actualizado
  console.log('\nGuardando productos actualizados...');
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf8');
  
  console.log(`\n✅ Proceso completado:`);
  console.log(`   - Descargadas: ${downloaded} imágenes nuevas`);
  console.log(`   - Reutilizadas: ${skipped} imágenes existentes`);
  console.log(`   - Fallidas: ${failed} búsquedas`);
  console.log(`\n📁 Imágenes guardadas en: ${imagesDir}`);
  console.log(`📄 Productos actualizados en: ${outputPath}`);
}

// Ejecutar
main().catch(console.error);

