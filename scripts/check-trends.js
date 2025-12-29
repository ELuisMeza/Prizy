import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para determinar la tendencia de un historial
function getTrend(priceHistory) {
  if (priceHistory.length < 2) return 'unknown';
  
  const firstPrice = priceHistory[0].price;
  const lastPrice = priceHistory[priceHistory.length - 1].price;
  const priceChange = (lastPrice - firstPrice) / firstPrice;
  
  if (priceChange < -0.05) return 'downward';
  if (priceChange > 0.05) return 'upward';
  return 'stable';
}

function main() {
  const productsPath = path.join(__dirname, '..', 'public', 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  const trends = {
    downward: 0,
    upward: 0,
    stable: 0,
    unknown: 0
  };
  
  products.forEach(product => {
    const trend = getTrend(product.price_history);
    trends[trend]++;
  });
  
  console.log('Análisis de tendencias de precios:');
  console.log(`Total de productos: ${products.length}`);
  console.log(`\nTendencias:`);
  console.log(`  - Bajista (downward): ${trends.downward} (${((trends.downward / products.length) * 100).toFixed(1)}%)`);
  console.log(`  - Alcista (upward): ${trends.upward} (${((trends.upward / products.length) * 100).toFixed(1)}%)`);
  console.log(`  - Estable (stable): ${trends.stable} (${((trends.stable / products.length) * 100).toFixed(1)}%)`);
  console.log(`  - Desconocida: ${trends.unknown}`);
}

main();

