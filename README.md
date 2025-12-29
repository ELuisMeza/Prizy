# 🛒 Prizy - Comparador de Precios

**Prizy** es una aplicación web moderna de comparación de precios que permite a los usuarios buscar productos, comparar precios entre múltiples tiendas y visualizar el historial de precios para tomar decisiones de compra inteligentes.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Scripts](#-scripts)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades Principales](#-funcionalidades-principales)

## ✨ Características

### Funcionalidades Principales

- 🔍 **Búsqueda de Productos**: Búsqueda avanzada por nombre de producto con coincidencia parcial de palabras
- 📊 **Comparación de Precios**: Compara precios de múltiples tiendas para el mismo producto
- 📈 **Historial de Precios**: Visualiza la evolución de precios a lo largo del tiempo con gráficos interactivos
- 🏷️ **Filtros por Categoría**: Filtra productos por categoría y subcategoría
- 🌐 **Multilenguaje**: Soporte para español e inglés con detección automática del idioma del navegador
- 🌓 **Modo Oscuro/Claro**: Interfaz adaptativa con soporte para tema claro y oscuro
- 📱 **Diseño Responsive**: Interfaz optimizada para dispositivos móviles, tablets y desktop
- 🎨 **UI Moderna**: Interfaz construida con Chakra UI v3 con diseño moderno y accesible

### Características Técnicas

- ⚡ **Rendimiento Optimizado**: Construido con Vite para compilación rápida y HMR (Hot Module Replacement)
- 🔒 **TypeScript**: Tipado estático para mayor seguridad y mejor experiencia de desarrollo
- 📦 **Arquitectura Modular**: Código organizado en componentes reutilizables y servicios separados
- 🎯 **Optimización de Datos**: Carga eficiente de productos desde archivos JSON estáticos

## 🛠️ Tecnologías

### Frontend

- **React 19.2.0** - Biblioteca de UI
- **TypeScript 5.9.3** - Superset tipado de JavaScript
- **Vite 7.2.4** - Herramienta de construcción y desarrollo
- **Chakra UI 3.30.0** - Biblioteca de componentes UI
- **React Router DOM 7.11.0** - Enrutamiento cliente
- **i18next 25.7.3** - Internacionalización (i18n)
- **Chart.js 4.5.1 + react-chartjs-2** - Gráficos para visualización de datos
- **Axios 1.13.2** - Cliente HTTP
- **react-icons 5.5.0** - Iconos
- **next-themes 0.4.6** - Gestión de temas claro/oscuro

### Herramientas de Desarrollo

- **ESLint 9.39.1** - Linter para código JavaScript/TypeScript
- **TypeScript ESLint 8.46.4** - Reglas de ESLint para TypeScript
- **Puppeteer 24.34.0** - Automatización para scripts de generación de datos

## 🏗️ Arquitectura

### Estructura General

```
compare_products/
├── public/                 # Archivos estáticos
│   ├── data/              # Datos JSON (productos y categorías)
│   └── images/            # Imágenes de productos
├── scripts/               # Scripts Node.js para gestión de datos
├── src/
│   ├── components/        # Componentes React reutilizables
│   ├── hooks/             # Custom hooks
│   ├── i18n/              # Configuración y traducciones
│   ├── pages/             # Páginas de la aplicación
│   ├── services/          # Servicios de API y lógica de negocio
│   ├── types/             # Definiciones de tipos TypeScript
│   └── utils/             # Utilidades y helpers
└── dist/                  # Build de producción (generado)
```

### Arquitectura de Componentes

```
App
├── Home
│   ├── HeaderBar
│   ├── HeroSection
│   ├── ResultSection
│   │   ├── SideBarFilters
│   │   └── ProductCard (múltiples)
│   └── Features Section
└── ProductDetail
    ├── HeaderBar
    ├── ProductInfo
    ├── GraphicPrices
    └── SimilarProducts
```

### Flujo de Datos

1. **Búsqueda de Productos**:
   - Usuario ingresa término de búsqueda en `HeroSection`
   - Se dispara `useGetSearchProduct` hook
   - `productsService.getProducts()` filtra desde `products.json`
   - Resultados se actualizan en estado de `Home`

2. **Visualización de Detalles**:
   - Usuario navega a `/product/:id`
   - `useGetProductById` obtiene el producto específico
   - `GraphicPrices` renderiza el historial de precios con Chart.js

3. **Filtrado por Categoría**:
   - Usuario selecciona categoría en `SideBarFilters`
   - Filtros se aplican en `productsService.getProducts()`
   - Resultados se actualizan dinámicamente

## 📦 Instalación

### Prerrequisitos

- **Node.js** 18.0.0 o superior
- **npm** 9.0.0 o superior (incluido con Node.js)

### Pasos de Instalación

1. **Clonar el repositorio**:
```bash
git clone <url-del-repositorio>
cd compare_products
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Iniciar servidor de desarrollo**:
```bash
npm run dev
```

4. **Abrir en el navegador**:
   - La aplicación estará disponible en `http://localhost:5173` (puerto por defecto de Vite)

## 🚀 Uso

### Desarrollo

```bash
# Iniciar servidor de desarrollo con HMR
npm run dev

# Compilar para producción
npm run build

# Preview de la build de producción
npm run preview

# Ejecutar linter
npm run lint
```

### Scripts de Gestión de Datos

```bash
# Generar productos desde templates
node scripts/generate-products.js

# Actualizar tendencias de precios
node scripts/update-price-trends.js

# Redistribuir tendencias de precios
node scripts/redistribute-trends.js

# Verificar tendencias
node scripts/check-trends.js

# Limpiar todos los datos
node scripts/clean-all-data.js

# Descargar imágenes reales de productos (requiere Puppeteer)
node scripts/download-real-product-images.js
```

## 📁 Estructura del Proyecto

### `/src/components`

Componentes React reutilizables:

- **`HeaderBar.tsx`**: Barra de navegación superior con selector de idioma
- **`HeroSection.tsx`**: Sección hero con barra de búsqueda principal
- **`ResultSection.tsx`**: Sección de resultados con paginación y ordenamiento
- **`SideBarFilters.tsx`**: Panel lateral con filtros de categoría y subcategoría
- **`GraphicPrices.tsx`**: Componente de gráfico para historial de precios
- **`ProductCard.tsx`**: Tarjeta individual de producto (usado en ResultSection)
- **`LanguageSelector.tsx`**: Selector de idioma
- **`NotFoundProduct.tsx`**: Componente para producto no encontrado
- **`ui/`**: Componentes base de UI (provider, color-mode, tooltip, toaster)

### `/src/hooks`

Custom hooks para lógica reutilizable:

- **`useGetSearchProduct.ts`**: Hook para búsqueda de productos
- **`useGetBestProducts.ts`**: Hook para obtener mejores productos por categoría
- **`useGetProductById.ts`**: Hook para obtener producto por ID con productos similares
- **`useGetAllCategories.ts`**: Hook para obtener todas las categorías

### `/src/services`

Servicios para comunicación con datos:

- **`api.client.ts`**: Cliente HTTP configurado con Axios
- **`products.service.ts`**: Servicio para operaciones con productos (búsqueda, filtrado)
- **`categories.service.ts`**: Servicio para operaciones con categorías

### `/src/pages`

Páginas principales de la aplicación:

- **`Home.tsx`**: Página principal con búsqueda y resultados
- **`ProductDetail.tsx`**: Página de detalle de producto con gráfico de precios

### `/src/types`

Definiciones de tipos TypeScript:

- **`product.types.d.ts`**: Interfaces para Product, Category, Subcategory

### `/scripts`

Scripts Node.js para gestión de datos:

- **`generate-products.js`**: Genera productos sintéticos desde templates
- **`update-price-trends.js`**: Actualiza tendencias de precios en productos existentes
- **`redistribute-trends.js`**: Redistribuye tendencias de precios entre productos
- **`check-trends.js`**: Verifica y analiza tendencias de precios
- **`clean-all-data.js`**: Limpia todos los datos generados
- **`download-real-product-images.js`**: Descarga imágenes reales usando Puppeteer

### `/public/data`

Archivos JSON estáticos:

- **`products.json`**: Base de datos de productos (34,000+ productos)
- **`categories.json`**: Definiciones de categorías y subcategorías

## 🎯 Funcionalidades Principales

### 1. Búsqueda de Productos

La búsqueda utiliza coincidencia parcial de palabras, permitiendo encontrar productos incluso con términos parciales:

- Divide el término de búsqueda en palabras individuales
- Busca coincidencias en el nombre del producto
- Soporta búsqueda case-insensitive
- Filtra resultados en tiempo real

### 2. Filtrado por Categoría

- Sistema jerárquico de categorías y subcategorías
- Filtrado dinámico que se combina con la búsqueda
- Interfaz intuitiva con navegación anidada
- Posibilidad de limpiar filtros y volver a todas las categorías

### 3. Visualización de Historial de Precios

- Gráfico de líneas interactivo usando Chart.js
- Filtros por rango de tiempo (3, 6, 12 meses, todo el historial)
- Indicadores de precio mínimo, máximo y variación porcentual
- Visualización clara de tendencias alcistas, bajistas y estables

### 4. Comparación de Precios

- Muestra todos los productos que coinciden con la búsqueda
- Ordenamiento por precio (mejor precio primero)
- Identificación visual de mejor oferta
- Información de tienda para cada producto

### 5. Internacionalización (i18n)

- Soporte completo para español e inglés
- Detección automática del idioma del navegador
- Cambio manual de idioma
- Todas las traducciones en `/src/i18n/locales/`

### 6. Modo Oscuro/Claro

- Cambio de tema dinámico
- Persistencia de preferencia del usuario
- Colores adaptativos en todos los componentes
- Transiciones suaves entre temas