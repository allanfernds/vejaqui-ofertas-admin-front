import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Category } from "@/types/category";

export const categoryService = {
  async list(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>("/public/categories");
    return response.data;
  },
};
