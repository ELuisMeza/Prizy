import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para determinar si un historial tiene tendencia bajista
function hasDownwardTrend(priceHistory) {
  if (priceHistory.length < 2) return false;
  
  const firstPrice = priceHistory[0].price;
  const lastPrice = priceHistory[priceHistory.length - 1].price;
  
  // Si el último precio es significativamente menor que el primero (más del 5% de diferencia)
  const priceChange = (lastPrice - firstPrice) / firstPrice;
  return priceChange < -0.05;
}

// Función para regenerar historial de precios con nueva tendencia
function regeneratePriceHistory(oldHistory, newTrend) {
  if (oldHistory.length === 0) return oldHistory;
  
  const firstPrice = oldHistory[0].price;
  const months = oldHistory.length;
  const startMonth = oldHistory[0].month;
  
  const history = [];
  const [startYear, startMonthNum] = startMonth.split('-').map(Number);
  let currentPrice = firstPrice;
  
  for (let i = 0; i < months; i++) {
    const monthNum = startMonthNum + i;
    const year = startYear + Math.floor((monthNum - 1) / 12);
    const month = ((monthNum - 1) % 12) + 1;
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    
    let variation = 0;
    
    switch (newTrend) {
      case 'upward':
        // Tendencia alcista: variación entre +2% y +6% con ligera aceleración
        variation = (Math.random() * 0.04 + 0.02) + (i * 0.005);
        break;
        
      case 'stable':
        // Precio estable: variaciones pequeñas entre -2% y +2%
        variation = Math.random() * 0.04 - 0.02;
        break;
        
      case 'volatile':
        // Precio volátil: variaciones grandes aleatorias entre -8% y +8%
        variation = Math.random() * 0.16 - 0.08;
        break;
        
      default:
        // Por defecto, comportamiento aleatorio ligero
        variation = Math.random() * 0.04 - 0.02;
    }
    
    currentPrice = Math.round(currentPrice * (1 + variation));
    
    history.push({
      month: monthStr,
      price: Math.max(100, currentPrice) // Precio mínimo de 100
    });
  }
  
  return history;
}

// Función principal
function main() {
  const productsPath = path.join(__dirname, '..', 'public', 'data', 'products.json');
  
  console.log('Leyendo productos...');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  console.log(`Total de productos: ${products.length}`);
  
  let updated = 0;
  let upward = 0;
  let stable = 0;
  let volatile = 0;
  
  products.forEach((product, index) => {
    if (hasDownwardTrend(product.price_history)) {
      // Determinar nueva tendencia (evitar bajista)
      const trendRandom = Math.random();
      let newTrend;
      
      if (trendRandom < 0.4) {
        newTrend = 'upward'; // 40% alcista
        upward++;
      } else if (trendRandom < 0.7) {
        newTrend = 'stable'; // 30% estable
        stable++;
      } else {
        newTrend = 'volatile'; // 30% volátil
        volatile++;
      }
      
      // Regenerar historial con nueva tendencia
      product.price_history = regeneratePriceHistory(product.price_history, newTrend);
      updated++;
      
      if (updated % 100 === 0) {
        console.log(`Procesados ${updated} productos con tendencia bajista...`);
      }
    }
  });
  
  // Guardar productos actualizados
  console.log('\nGuardando productos actualizados...');
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  
  console.log(`\n✅ Proceso completado:`);
  console.log(`   - Productos actualizados: ${updated}`);
  console.log(`   - Nueva tendencia alcista: ${upward}`);
  console.log(`   - Nueva tendencia estable: ${stable}`);
  console.log(`   - Nueva tendencia volátil: ${volatile}`);
}

// Ejecutar
try {
  main();
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}

