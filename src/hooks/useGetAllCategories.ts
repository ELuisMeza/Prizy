import { categoriesService } from "@/services/categories.service";
import type { Category } from "@/types/product.types";
import { useEffect, useState } from "react";

export const useGetAllCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await categoriesService.getCategories();
        setCategories(response || []);
      } catch (error) {
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, isLoadingCategories };
};