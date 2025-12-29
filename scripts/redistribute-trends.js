import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      case 'downward':
        // Tendencia bajista: variación entre -6% y -2% con ligera aceleración
        variation = (Math.random() * 0.04 - 0.06) - (i * 0.005);
        break;
        
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
  
  const trends = ['downward', 'upward', 'stable', 'volatile'];
  const targetDistribution = {
    'downward': 0.25,  // 25% bajista
    'upward': 0.35,    // 35% alcista
    'stable': 0.25,    // 25% estable
    'volatile': 0.15   // 15% volátil
  };
  
  const counts = {
    'downward': 0,
    'upward': 0,
    'stable': 0,
    'volatile': 0
  };
  
  // Redistribuir todas las tendencias
  products.forEach((product, index) => {
    // Asignar tendencia basada en el índice para distribución uniforme
    const position = index / products.length;
    let assignedTrend;
    
    if (position < targetDistribution.downward) {
      assignedTrend = 'downward';
    } else if (position < targetDistribution.downward + targetDistribution.upward) {
      assignedTrend = 'upward';
    } else if (position < targetDistribution.downward + targetDistribution.upward + targetDistribution.stable) {
      assignedTrend = 'stable';
    } else {
      assignedTrend = 'volatile';
    }
    
    // Regenerar historial con la nueva tendencia
    product.price_history = regeneratePriceHistory(product.price_history, assignedTrend);
    counts[assignedTrend]++;
    
    if ((index + 1) % 100 === 0) {
      console.log(`Procesados ${index + 1}/${products.length} productos...`);
    }
  });
  
  // Guardar productos actualizados
  console.log('\nGuardando productos actualizados...');
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  
  console.log(`\n✅ Proceso completado:`);
  console.log(`   - Total de productos: ${products.length}`);
  console.log(`   - Tendencia bajista: ${counts.downward} (${((counts.downward / products.length) * 100).toFixed(1)}%)`);
  console.log(`   - Tendencia alcista: ${counts.upward} (${((counts.upward / products.length) * 100).toFixed(1)}%)`);
  console.log(`   - Tendencia estable: ${counts.stable} (${((counts.stable / products.length) * 100).toFixed(1)}%)`);
  console.log(`   - Tendencia volátil: ${counts.volatile} (${((counts.volatile / products.length) * 100).toFixed(1)}%)`);
}

// Ejecutar
try {
  main();
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}

