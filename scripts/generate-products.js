import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Datos para generar productos
const stores = [
  'TechStore Perú',
  'Mobile World',
  'ElectroSmart',
  'Falabella',
  'Ripley',
  'Saga Falabella',
  'Oechsle',
  'Linio',
  'Plaza Vea',
  'Tottus',
  'Supermercados Peruanos',
  'Real Plaza',
  'Paruro',
  'Gamarra Market',
  'MercadoLibre'
];

// Productos por categoría
const productTemplates = {
  'tecnologia': {
    'telefonia': [
      { brand: 'iPhone', models: ['13', '14', '15', 'SE'], capacities: ['64GB', '128GB', '256GB', '512GB'], colors: ['Midnight', 'Starlight', 'Azul', 'Rosa', 'Verde', 'Rojo', 'Amarillo'] },
      { brand: 'Samsung Galaxy', models: ['S22', 'S23', 'A54', 'A34'], capacities: ['64GB', '128GB', '256GB'], colors: ['Phantom Black', 'Green', 'Lavender', 'Cream', 'Graphite'] },
      { brand: 'Xiaomi', models: ['13', '12', '11T', 'Redmi Note 12'], capacities: ['64GB', '128GB', '256GB'], colors: ['Negro', 'Azul', 'Verde', 'Rosa', 'Blanco'] },
      { brand: 'Motorola', models: ['Edge 40', 'G84', 'Razr'], capacities: ['128GB', '256GB'], colors: ['Negro', 'Azul', 'Rosa'] },
      { brand: 'Huawei', models: ['P60', 'Nova 11', 'Mate 50'], capacities: ['128GB', '256GB'], colors: ['Negro', 'Azul', 'Plateado'] }
    ],
    'computo': [
      { brand: 'Laptop', models: ['HP', 'Dell', 'Lenovo', 'ASUS', 'Acer'], specs: ['i5 8GB', 'i7 16GB', 'Ryzen 5', 'Ryzen 7'], sizes: ['14"', '15.6"', '17"'] },
      { brand: 'MacBook', models: ['Air M1', 'Air M2', 'Pro M2'], specs: ['8GB', '16GB'], sizes: ['13"', '14"', '16"'] },
      { brand: 'Tablet', models: ['iPad', 'Samsung Tab', 'Xiaomi Pad'], specs: ['64GB', '128GB', '256GB'], sizes: ['10.2"', '11"', '12.9"'] }
    ],
    'televisores': [
      { brand: 'TV', models: ['Samsung', 'LG', 'Sony', 'Panasonic'], specs: ['4K 43"', '4K 50"', '4K 55"', '4K 65"', '4K 75"'] }
    ],
    'consolas': [
      { brand: 'PlayStation', models: ['5'], specs: ['Standard', 'Digital'], colors: ['Blanco', 'Negro'] },
      { brand: 'Xbox', models: ['Series X', 'Series S'], specs: ['1TB', '512GB'] },
      { brand: 'Nintendo', models: ['Switch', 'Switch OLED', 'Switch Lite'], specs: ['Standard', 'OLED', 'Lite'], colors: ['Rojo/Azul', 'Gris', 'Blanco', 'Verde', 'Rosa'] }
    ],
    'audio': [
      { brand: 'Audífonos', models: ['Sony WH', 'AirPods', 'Samsung Buds'], specs: ['Pro', 'Max', 'Standard'], colors: ['Negro', 'Blanco', 'Azul'] },
      { brand: 'Parlante', models: ['JBL', 'Sony', 'Bose'], specs: ['Portátil', 'Bluetooth', 'Premium'], sizes: ['Pequeño', 'Mediano', 'Grande'] }
    ],
    'tablets': [
      { brand: 'iPad', models: ['Air', 'Pro', 'Mini'], specs: ['64GB', '128GB', '256GB'], sizes: ['10.2"', '11"', '12.9"'] },
      { brand: 'Samsung Tab', models: ['S8', 'S9', 'A8'], specs: ['64GB', '128GB'], sizes: ['10.1"', '11"'] }
    ],
    'smartwatch': [
      { brand: 'Apple Watch', models: ['Series 9', 'Series 8', 'SE'], specs: ['GPS', 'GPS+Cellular'], sizes: ['40mm', '44mm', '41mm', '45mm'] },
      { brand: 'Samsung Watch', models: ['Galaxy Watch 6', 'Watch 5'], specs: ['40mm', '44mm'], colors: ['Negro', 'Plata', 'Rosa'] }
    ]
  },
  'electrohogar': {
    'refrigeradores': [
      { brand: 'Refrigerador', models: ['Samsung', 'LG', 'Mabe', 'Indurama'], specs: ['No Frost 300L', 'No Frost 400L', 'Frost Free 250L', 'Side by Side 600L'], colors: ['Blanco', 'Plateado', 'Negro'] }
    ],
    'lavadoras': [
      { brand: 'Lavadora', models: ['Samsung', 'LG', 'Mabe', 'Whirlpool'], specs: ['18kg', '20kg', '22kg'], types: ['Automática', 'Semi-automática'] }
    ],
    'microondas': [
      { brand: 'Microondas', models: ['Samsung', 'LG', 'Panasonic'], specs: ['20L', '25L', '30L'], colors: ['Blanco', 'Negro', 'Plateado'] }
    ],
    'aspiradoras': [
      { brand: 'Aspiradora', models: ['Dyson', 'Shark', 'Rowenta'], specs: ['Inalámbrica', 'Con Cable'], types: ['Robot', 'Manual'] }
    ],
    'licuadoras': [
      { brand: 'Licuadora', models: ['Oster', 'Hamilton Beach', 'Ninja'], specs: ['500W', '750W', '1000W'], types: ['Personal', 'Profesional'] }
    ]
  },
  'moda': {
    'ropa-mujer': [
      { brand: 'Vestido', types: ['Casual', 'Formal', 'Verano', 'Elegante'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Negro', 'Blanco', 'Rojo', 'Azul', 'Rosa'] },
      { brand: 'Blusa', types: ['Manga Corta', 'Manga Larga', 'Sin Mangas'], sizes: ['S', 'M', 'L', 'XL'] },
      { brand: 'Jean', types: ['Skinny', 'Recto', 'Flare'], sizes: ['26', '28', '30', '32'], colors: ['Azul Claro', 'Azul Oscuro', 'Negro'] }
    ],
    'ropa-hombre': [
      { brand: 'Camisa', types: ['Formal', 'Casual', 'Manga Corta'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Blanco', 'Azul', 'Negro', 'Gris'] },
      { brand: 'Pantalón', types: ['Formal', 'Jeans', 'Cargo'], sizes: ['30', '32', '34', '36'], colors: ['Negro', 'Gris', 'Azul', 'Beige'] },
      { brand: 'Polo', types: ['Manga Corta', 'Manga Larga'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Blanco', 'Negro', 'Azul', 'Rojo'] }
    ],
    'zapatos': [
      { brand: 'Zapatos', types: ['Formales', 'Deportivos', 'Casuales'], sizes: ['38', '39', '40', '41', '42', '43', '44'], colors: ['Negro', 'Marrón', 'Blanco', 'Azul'] },
      { brand: 'Zapatillas', types: ['Running', 'Casual', 'Deportivas'], sizes: ['38', '39', '40', '41', '42', '43', '44'], colors: ['Negro', 'Blanco', 'Rojo', 'Azul'] }
    ]
  },
  'hogar': {
    'muebles': [
      { brand: 'Sofá', types: ['3 Plazas', '2 Plazas', 'Esquinero'], colors: ['Gris', 'Beige', 'Negro', 'Azul'] },
      { brand: 'Mesa', types: ['Comedor', 'Centro', 'Escritorio'], materials: ['Madera', 'Vidrio', 'Metal'], sizes: ['Pequeña', 'Mediana', 'Grande'] },
      { brand: 'Silla', types: ['Ejecutiva', 'Comedor', 'Oficina'], materials: ['Madera', 'Metal', 'Plástico'] }
    ],
    'decoracion': [
      { brand: 'Lámpara', types: ['Mesa', 'Pie', 'Techo'], styles: ['Moderno', 'Clásico', 'Rústico'], colors: ['Blanco', 'Negro', 'Oro', 'Plata'] },
      { brand: 'Cuadro', types: ['Abstracto', 'Paisaje', 'Retrato'], sizes: ['Pequeño', 'Mediano', 'Grande'], materials: ['Lienzo', 'Madera', 'Metal'] }
    ]
  },
  'deporte-aire-libre': {
    'fitness': [
      { brand: 'Pesas', types: ['Ajustables', 'Mancuernas', 'Barra'], weights: ['5kg', '10kg', '20kg', '30kg'] },
      { brand: 'Colchoneta', types: ['Yoga', 'Ejercicio', 'Pilates'], sizes: ['Estándar', 'Extra Grande'], colors: ['Azul', 'Rosa', 'Negro', 'Púrpura'] },
      { brand: 'Bicicleta', types: ['Ejercicio', 'Spinning'], features: ['Resistencia Magnética', 'LCD Display'] }
    ],
    'running': [
      { brand: 'Zapatillas Running', brands: ['Nike', 'Adidas', 'Puma'], sizes: ['38', '39', '40', '41', '42', '43', '44'], colors: ['Negro', 'Blanco', 'Rojo', 'Azul'] },
      { brand: 'Smartwatch Running', types: ['Garmin', 'Polar', 'Fitbit'], features: ['GPS', 'Ritmo Cardíaco'] }
    ]
  },
  'belleza-salud': {
    'cuidado-facial': [
      { brand: 'Crema Facial', types: ['Hidratante', 'Antiedad', 'Protector Solar'], sizes: ['50ml', '100ml', '200ml'], brands: ['Nivea', 'Olay', 'Neutrogena'] },
      { brand: 'Serum', types: ['Vitamina C', 'Ácido Hialurónico', 'Retinol'], sizes: ['30ml', '50ml'] }
    ],
    'maquillaje': [
      { brand: 'Base', brands: ['MAC', 'Maybelline', 'L\'Oreal'], shades: ['Claro', 'Medio', 'Oscuro'], sizes: ['30ml', '50ml'] },
      { brand: 'Labial', brands: ['MAC', 'Revlon', 'NYX'], types: ['Mate', 'Brillo', 'Líquido'], colors: ['Rojo', 'Rosa', 'Nude', 'Coral'] }
    ]
  },
  'automotriz': {
    'accesorios-auto': [
      { brand: 'Cargador', types: ['USB-C', 'Lightning', 'Wireless'], brands: ['Belkin', 'Anker', 'Baseus'] },
      { brand: 'Porta Celular', types: ['Ventosa', 'Magnético', 'Clip'], styles: ['Ajustable', 'Flexible'] },
      { brand: 'Cámara Reversa', types: ['HD', 'Full HD', '4K'], brands: ['Garmin', 'Papago', 'Rexing'] },
      { brand: 'GPS Navegador', types: ['Portátil', 'Fijo'], brands: ['Garmin', 'TomTom'], sizes: ['5"', '6"', '7"'] }
    ],
    'repuestos': [
      { brand: 'Filtro de Aire', brands: ['Bosch', 'Mann', 'Fram'], sizes: ['Estándar', 'Premium'] },
      { brand: 'Aceite Motor', brands: ['Mobil', 'Castrol', 'Shell'], types: ['5W-30', '10W-40', '15W-50'], sizes: ['1L', '4L', '5L'] },
      { brand: 'Batería Auto', brands: ['ACDelco', 'Bosch', 'Varta'], types: ['12V 50Ah', '12V 60Ah', '12V 70Ah'] },
      { brand: 'Pastillas Freno', brands: ['Bosch', 'Brembo', 'Ferodo'], types: ['Delanteras', 'Traseras'] }
    ],
    'neumaticos': [
      { brand: 'Neumático', brands: ['Michelin', 'Bridgestone', 'Goodyear'], sizes: ['185/65 R15', '195/60 R15', '205/55 R16', '225/50 R17'], types: ['Verano', 'Invierno', 'All Season'] }
    ],
    'herramientas-auto': [
      { brand: 'Gato Hidráulico', types: ['1.5 Ton', '2 Ton', '3 Ton'], brands: ['Black & Decker', 'Bosch', 'Einhell'] },
      { brand: 'Compresor de Aire', types: ['Portátil', 'Estacionario'], capacities: ['50L', '100L', '150L'] },
      { brand: 'Juego de Llaves', types: ['Métrica', 'SAE'], sizes: ['Juego 10 piezas', 'Juego 20 piezas', 'Juego 30 piezas'] }
    ],
    'car-audio': [
      { brand: 'Radio Auto', types: ['Bluetooth', 'USB', 'CD'], brands: ['Pioneer', 'Sony', 'JVC'], sizes: ['Single DIN', 'Double DIN'] },
      { brand: 'Parlantes Auto', types: ['Frontales', 'Traseros', 'Tweeters'], sizes: ['4"', '5.25"', '6.5"'], brands: ['Pioneer', 'JBL', 'Kenwood'] },
      { brand: 'Subwoofer', types: ['10"', '12"', '15"'], brands: ['Rockford Fosgate', 'Kicker', 'JL Audio'] }
    ],
    'mantenimiento': [
      { brand: 'Aceite Transmisión', brands: ['Valvoline', 'Castrol', 'Mobil'], types: ['ATF', 'Manual'], sizes: ['1L', '4L'] },
      { brand: 'Anticongelante', brands: ['Prestone', 'Zerex', 'Peak'], types: ['Concentrado', 'Premezclado'], sizes: ['1L', '3.78L', '5L'] },
      { brand: 'Líquido de Freno', brands: ['DOT 3', 'DOT 4', 'DOT 5'], sizes: ['250ml', '500ml', '1L'] },
      { brand: 'Filtro de Combustible', brands: ['Bosch', 'Mann', 'Fram'], types: ['Exterior', 'Interior'] }
    ]
  }
};

// Función para generar un ID único
function generateId(productName, store, index) {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + store.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + index;
}

// Función para generar historial de precios con diferentes tendencias
function generatePriceHistory(basePrice, startMonth = '2024-01', months = 12, trend = 'random') {
  const history = [];
  const [startYear, startMonthNum] = startMonth.split('-').map(Number);
  let currentPrice = basePrice;
  
  // Determinar la tendencia si es 'random'
  let actualTrend = trend;
  if (trend === 'random') {
    const random = Math.random();
    if (random < 0.35) {
      actualTrend = 'downward'; // 35% bajista
    } else if (random < 0.70) {
      actualTrend = 'upward'; // 35% alcista
    } else if (random < 0.85) {
      actualTrend = 'stable'; // 15% estable
    } else {
      actualTrend = 'volatile'; // 15% volátil (sube y baja)
    }
  }
  
  for (let i = 0; i < months; i++) {
    const monthNum = startMonthNum + i;
    const year = startYear + Math.floor((monthNum - 1) / 12);
    const month = ((monthNum - 1) % 12) + 1;
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    
    let variation = 0;
    
    switch (actualTrend) {
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
        // Por defecto, comportamiento aleatorio
        variation = Math.random() * 0.08 - 0.04;
    }
    
    currentPrice = Math.round(currentPrice * (1 + variation));
    
    history.push({
      month: monthStr,
      price: Math.max(100, currentPrice) // Precio mínimo de 100
    });
  }
  
  return history;
}

// Función para obtener categoría y subcategoría (SOLO con templates definidos)
function getRandomCategory(categories) {
  // SOLO usar categorías que tienen templates definidos
  const prioritizedCategories = categories.filter(cat => productTemplates[cat.id]);
  
  if (prioritizedCategories.length === 0) {
    throw new Error('No hay categorías con templates definidos');
  }
  
  // Seleccionar categoría con template
  const category = prioritizedCategories[Math.floor(Math.random() * prioritizedCategories.length)];
  
  // SOLO seleccionar subcategorías que tienen templates
  const subcategoriesWithTemplates = category.subcategories.filter(sub => 
    productTemplates[category.id] && productTemplates[category.id][sub.id]
  );
  
  if (subcategoriesWithTemplates.length === 0) {
    // Si ninguna subcategoría tiene template, volver a intentar con otra categoría
    return getRandomCategory(categories);
  }
  
  const subcategory = subcategoriesWithTemplates[Math.floor(Math.random() * subcategoriesWithTemplates.length)];
  return { category, subcategory };
}

// Función para obtener categoría específica (útil para generar productos populares)
function getSpecificCategory(categories, categoryId, subcategoryId = null) {
  const category = categories.find(cat => cat.id === categoryId);
  if (!category || !productTemplates[categoryId]) {
    // Si no existe la categoría o no tiene templates, usar una aleatoria con template
    return getRandomCategory(categories);
  }
  
  if (subcategoryId) {
    // Verificar que la subcategoría tenga template
    if (productTemplates[categoryId][subcategoryId]) {
      const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
      if (subcategory) return { category, subcategory };
    }
    // Si no tiene template, usar una aleatoria de la misma categoría con template
    const subcategoriesWithTemplates = category.subcategories.filter(sub => 
      productTemplates[categoryId][sub.id]
    );
    if (subcategoriesWithTemplates.length > 0) {
      const subcategory = subcategoriesWithTemplates[Math.floor(Math.random() * subcategoriesWithTemplates.length)];
      return { category, subcategory };
    }
  }
  
  // Seleccionar subcategoría con template
  const subcategoriesWithTemplates = category.subcategories.filter(sub => 
    productTemplates[categoryId][sub.id]
  );
  
  if (subcategoriesWithTemplates.length === 0) {
    return getRandomCategory(categories);
  }
  
  const subcategory = subcategoriesWithTemplates[Math.floor(Math.random() * subcategoriesWithTemplates.length)];
  return { category, subcategory };
}

// Función para generar un producto base (sin tienda específica)
function generateProductBase(categories, index, forceCategory = null, forceSubcategory = null) {
  let categoryData;
  if (forceCategory && forceSubcategory) {
    categoryData = getSpecificCategory(categories, forceCategory, forceSubcategory);
  } else if (forceCategory) {
    categoryData = getSpecificCategory(categories, forceCategory);
  } else {
    categoryData = getRandomCategory(categories);
  }
  const { category, subcategory } = categoryData;
  
  // Obtener template si existe
  const categoryId = category.id;
  const subcategoryId = subcategory.id;
  
  let productName = '';
  let basePrice = 500;
  
  if (productTemplates[categoryId] && productTemplates[categoryId][subcategoryId]) {
    const templates = productTemplates[categoryId][subcategoryId];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Construir nombre del producto
    const parts = [template.brand];
    
    if (template.brands) {
      parts.push(template.brands[Math.floor(Math.random() * template.brands.length)]);
    }
    
    if (template.models) {
      parts.push(template.models[Math.floor(Math.random() * template.models.length)]);
    }
    
    if (template.capacities) {
      parts.push(template.capacities[Math.floor(Math.random() * template.capacities.length)]);
    }
    
    if (template.colors) {
      parts.push(template.colors[Math.floor(Math.random() * template.colors.length)]);
    }
    
    if (template.specs) {
      parts.push(template.specs[Math.floor(Math.random() * template.specs.length)]);
    }
    
    if (template.sizes) {
      parts.push(template.sizes[Math.floor(Math.random() * template.sizes.length)]);
    }
    
    if (template.types) {
      parts.push(template.types[Math.floor(Math.random() * template.types.length)]);
    }
    
    if (template.features) {
      parts.push(template.features[Math.floor(Math.random() * template.features.length)]);
    }
    
    productName = parts.join(' ');
    
    // Generar precio base según el tipo de producto
    if (categoryId === 'tecnologia') {
      if (subcategoryId === 'telefonia') {
        basePrice = 800 + Math.random() * 3000;
      } else if (subcategoryId === 'computo') {
        basePrice = 1200 + Math.random() * 5000;
      } else if (subcategoryId === 'televisores') {
        basePrice = 800 + Math.random() * 4000;
      } else if (subcategoryId === 'consolas') {
        basePrice = 400 + Math.random() * 800;
      } else {
        basePrice = 100 + Math.random() * 800;
      }
    } else if (categoryId === 'electrohogar') {
      basePrice = 300 + Math.random() * 2000;
    } else if (categoryId === 'moda') {
      basePrice = 50 + Math.random() * 400;
    } else if (categoryId === 'hogar') {
      basePrice = 200 + Math.random() * 1500;
    } else if (categoryId === 'deporte-aire-libre') {
      basePrice = 80 + Math.random() * 600;
    } else if (categoryId === 'belleza-salud') {
      basePrice = 20 + Math.random() * 150;
    } else if (categoryId === 'automotriz') {
      basePrice = 30 + Math.random() * 300;
    } else {
      basePrice = 50 + Math.random() * 500;
    }
  } else {
    // NO generar productos si no hay template - esto no debería pasar
    // pero si pasa, lanzar error en lugar de generar nombre genérico
    throw new Error(`No hay template para categoría ${categoryId}, subcategoría ${subcategoryId}. Todos los productos deben tener templates definidos.`);
  }
  
  return {
    name: productName,
    category: {
      es: category.name.es,
      en: category.name.en
    },
    subcategory: {
      es: subcategory.name.es,
      en: subcategory.name.en
    },
    basePrice
  };
}

// Función para generar variantes de un producto base en diferentes tiendas
function generateProductVariants(productBase, baseIndex, numVariants = null) {
  // Número de variantes entre 3 y 6 tiendas (más común: 4-5)
  const variantsCount = numVariants || Math.floor(Math.random() * 4) + 3;
  
  // Seleccionar tiendas aleatorias sin repetir
  const selectedStores = [];
  const storesCopy = [...stores];
  
  for (let i = 0; i < variantsCount && storesCopy.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * storesCopy.length);
    selectedStores.push(storesCopy.splice(randomIndex, 1)[0]);
  }
  
  const variants = [];
  
  selectedStores.forEach((store, storeIndex) => {
    // Variación de precio base entre -15% y +10% para diferentes tiendas
    const priceVariation = 0.85 + Math.random() * 0.25;
    const storeBasePrice = Math.round(productBase.basePrice * priceVariation);
    
    const id = generateId(productBase.name, store, baseIndex * 1000 + storeIndex);
    // Cada variante puede tener una tendencia diferente, pero preferiblemente la misma para el mismo producto base
    // Esto hace que productos similares tengan comportamientos similares de precio
    const trend = baseIndex % 10 < 3 ? 'downward' : (baseIndex % 10 < 6 ? 'upward' : 'random');
    const priceHistory = generatePriceHistory(storeBasePrice, '2024-01', 12, trend);
    
    variants.push({
      id,
      name: productBase.name,
      category: productBase.category,
      subcategory: productBase.subcategory,
      store,
      price_history: priceHistory
    });
  });
  
  return variants;
}

// Función principal
function main() {
  const categoriesPath = path.join(__dirname, '..', 'public', 'data', 'categories.json');
  const outputPath = path.join(__dirname, '..', 'public', 'data', 'products.json');
  
  // Leer categorías
  const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
  
  // Generar productos base (unos 120-150 productos base)
  // Asegurar que se generen suficientes productos populares
  const numBaseProducts = 120;
  const products = [];
  
  console.log(`Generando ${numBaseProducts} productos base...`);
  
  const baseProducts = [];
  let index = 0;
  
  // Generar productos prioritarios primero (telefonía - los más buscados)
  const numPhoneProducts = 40; // 40 productos base de telefonía
  console.log(`Generando ${numPhoneProducts} productos base de telefonía...`);
  for (let i = 0; i < numPhoneProducts; i++) {
    baseProducts.push(generateProductBase(categories, index++, 'tecnologia', 'telefonia'));
  }
  
  // Generar otros productos de tecnología
  const numTechProducts = 30;
  console.log(`Generando ${numTechProducts} productos base de tecnología...`);
  for (let i = 0; i < numTechProducts; i++) {
    baseProducts.push(generateProductBase(categories, index++, 'tecnologia'));
  }
  
  // Generar productos de electrohogar
  const numElectroProducts = 20;
  console.log(`Generando ${numElectroProducts} productos base de electrohogar...`);
  for (let i = 0; i < numElectroProducts; i++) {
    baseProducts.push(generateProductBase(categories, index++, 'electrohogar'));
  }
  
  // Generar productos aleatorios del resto
  const remainingProducts = numBaseProducts - baseProducts.length;
  console.log(`Generando ${remainingProducts} productos base adicionales...`);
  for (let i = 0; i < remainingProducts; i++) {
    baseProducts.push(generateProductBase(categories, index++));
  }
  
  console.log(`Generando variantes en múltiples tiendas...`);
  
  // Para cada producto base, generar múltiples variantes en diferentes tiendas
  baseProducts.forEach((baseProduct, index) => {
    const variants = generateProductVariants(baseProduct, index);
    products.push(...variants);
    
    if ((index + 1) % 20 === 0) {
      console.log(`Generadas variantes para ${index + 1} productos base (total: ${products.length} productos)...`);
    }
  });
  
  // Mezclar productos para que no estén agrupados por producto base
  for (let i = products.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [products[i], products[j]] = [products[j], products[i]];
  }
  
  // Escribir archivo
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf8');
  
  console.log(`✅ ${products.length} productos generados exitosamente en ${outputPath}`);
  console.log(`   (${numBaseProducts} productos base × promedio ${(products.length / numBaseProducts).toFixed(1)} variantes por producto)`);
}

// Ejecutar
main();

