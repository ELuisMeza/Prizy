import type { TypeProduct } from "@/types/product.types";
import { apiClient } from "./api.client";

export const productsService = {
  getProducts: async (productName: string, category: string | null, subcategory: string | null, limit?: number) => {
    const response = await apiClient.get<TypeProduct[]>("/data/products.json");
    let filteredProducts = response.data;
    
    if (category) {
      filteredProducts = filteredProducts.filter((product: TypeProduct) => {
        return product.category.es === category || product.category.en === category;
      });
    }
    
    if (subcategory) {
      filteredProducts = filteredProducts.filter((product: TypeProduct) => {
        return product.subcategory.es === subcategory || product.subcategory.en === subcategory;
      });
    }
    
    const searchTerm = productName.toLowerCase().trim();
    if (searchTerm) {
      const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);
      
      filteredProducts = filteredProducts.filter((product: TypeProduct) => {
        const productNameLower = product.name.toLowerCase();
        const productWords = productNameLower.split(/\s+/);
        
        return searchWords.some((searchWord: string) => 
          productWords.some((productWord: string) => productWord === searchWord)
        );
      });
    }
    
    if (limit && limit > 0) {
      filteredProducts = filteredProducts.slice(0, limit);
    }
    
    return filteredProducts;
  },

  getBestProducts: async (category: string | null = null, subcategory: string | null = null) => {
    const response = await apiClient.get<TypeProduct[]>("/data/products.json");
    let filteredProducts = response.data;

    if (category) {
      filteredProducts = filteredProducts.filter((product: TypeProduct) => {
        return product.category.es === category || product.category.en === category;
      });
    }
    
    if (subcategory) {
      filteredProducts = filteredProducts.filter((product: TypeProduct) => {
        return product.subcategory.es === subcategory || product.subcategory.en === subcategory;
      });
    }

    const bestProducts = filteredProducts.sort((a, b) => {
      const lowestPriceA = Math.min(...a.price_history.map((entry) => entry.price));
      const lowestPriceB = Math.min(...b.price_history.map((entry) => entry.price));
      return lowestPriceA - lowestPriceB;
    });

    return bestProducts.slice(0, 4);
  },

  getProductById: async (id: string): Promise<TypeProduct | null> => {
    const response = await apiClient.get<TypeProduct[]>("/data/products.json");
    const product = response.data.find((p) => p.id === id);
    return product || null;
  }
};