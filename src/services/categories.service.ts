import { apiClient } from "./api.client";
import type { Category } from "@/types/product.types";

export const categoriesService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>("/data/categories.json");
    return response.data;
  }
};
