import { productsService } from "@/services/products.service";
import type { TypeProduct } from "@/types/product.types";
import { useEffect } from "react";

interface Params {
  selectedCategory: {
    category: string | null;
    subcategory: string | null;
  }
  setProducts: (products: TypeProduct[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  hasSearched: boolean;
}

export const useGetBestProducts = ({selectedCategory, setProducts, setIsLoading, hasSearched}: Params) => {

  useEffect(() => {
    if (hasSearched) {
      return;
    }

    const loadBestProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productsService.getBestProducts(
          selectedCategory.category,
          selectedCategory.subcategory
        );
        setProducts(response || []);
      } catch (error) {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBestProducts();
  }, [selectedCategory, hasSearched]);
};