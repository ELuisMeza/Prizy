import { useEffect, useState } from "react";
import { productsService } from "@/services/products.service";
import type { TypeProduct } from "@/types/product.types";

interface Props {
  id: string | undefined;
}

export const useGetProductById = ({ id }: Props) => {
  const [product, setProduct] = useState<TypeProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState<TypeProduct[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        
        if (id) {
          const foundProduct = await productsService.getProductById(id);
          setProduct(foundProduct);
          
          if (foundProduct) {
            const relatedProducts = await productsService.getProducts(
              "",
              foundProduct.category.es,
              foundProduct.subcategory.es,
              4 
            );
            const filteredRelated = relatedProducts.filter(p => p.id !== foundProduct.id);
            setSimilarProducts(filteredRelated);
          }
        } 
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  return { product, isLoading, similarProducts };
}     