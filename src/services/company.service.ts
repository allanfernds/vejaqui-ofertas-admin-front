import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type {
  Company,
  CompanyWithRole,
  CreateCompanyInput,
  UpdateCompanyInput,
} from "@/types/company";

export const companyService = {
  async list(): Promise<CompanyWithRole[]> {
    const response = await api.get<ApiResponse<CompanyWithRole[]>>("/companies");
    return response.data;
  },

  async getById(companyId: string): Promise<Company> {
    const response = await api.get<ApiResponse<Company>>(`/companies/${companyId}`);
    return response.data;
  },

  async create(input: CreateCompanyInput): Promise<Company> {
    const response = await api.post<ApiResponse<Company>>("/companies", input);
    return response.data;
  },

  async update(companyId: string, input: UpdateCompanyInput): Promise<Company> {
    const response = await api.patch<ApiResponse<Company>>(`/companies/${companyId}`, input);
    return response.data;
  },
};
