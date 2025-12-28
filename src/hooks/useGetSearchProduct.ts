import { productsService } from "@/services/products.service";
import type { TypeProduct } from "@/types/product.types";
import { useCallback } from "react";

interface Params {  
  searchTerm: string;
  setHasSearched: (hasSearched: boolean) => void;
  setProducts: (products: TypeProduct[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  selectedCategory: {
    category: string | null;
    subcategory: string | null;
  };
}

export const useGetSearchProduct = ({searchTerm, setHasSearched, setProducts, setIsLoading, selectedCategory}: Params) => {
  const searchProducts = useCallback(async () => {
    if (!searchTerm.trim()) {
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await productsService.getProducts(searchTerm, selectedCategory.category, selectedCategory.subcategory);
      setProducts(response || []);
    } catch (error) {
      console.error("Error al buscar productos:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, setHasSearched, setProducts, setIsLoading]);

  return { searchProducts };
};