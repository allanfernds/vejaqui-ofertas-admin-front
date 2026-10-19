import { api } from "@/lib/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
  ChangeOfferStatusInput,
  ListOffersQuery,
  Offer,
  ProductOfferInput,
  UpdateProductOfferInput,
} from "@/types/offer";

export const offerService = {
  async list(companyId: string, query: ListOffersQuery = {}): Promise<PaginatedResponse<Offer>> {
    return api.get<PaginatedResponse<Offer>>(`/companies/${companyId}/offers`, {
      search: query.search,
      status: query.status === "ENDED" ? undefined : query.status,
      expired: query.status === "ENDED" ? true : undefined,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
  },

  async getById(companyId: string, offerId: string): Promise<Offer> {
    const response = await api.get<ApiResponse<Offer>>(
      `/companies/${companyId}/offers/${offerId}`,
    );
    return response.data;
  },

  async create(companyId: string, input: ProductOfferInput): Promise<Offer> {
    const response = await api.post<ApiResponse<Offer>>(
      `/companies/${companyId}/product-offers`,
      input,
    );
    return response.data;
  },

  async update(
    companyId: string,
    offerId: string,
    input: UpdateProductOfferInput,
  ): Promise<Offer> {
    const response = await api.patch<ApiResponse<Offer>>(
      `/companies/${companyId}/product-offers/${offerId}`,
      input,
    );
    return response.data;
  },

  async changeStatus(
    companyId: string,
    offerId: string,
    input: ChangeOfferStatusInput,
  ): Promise<Offer> {
    const response = await api.patch<ApiResponse<Offer>>(
      `/companies/${companyId}/offers/${offerId}/status`,
      input,
    );
    return response.data;
  },
};
