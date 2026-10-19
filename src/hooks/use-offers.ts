import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { offerService } from "@/services/offer.service";
import type {
  ChangeOfferStatusInput,
  ListOffersQuery,
  ProductOfferInput,
  UpdateProductOfferInput,
} from "@/types/offer";

export const offerKeys = {
  all: ["offers"] as const,
  list: (companyId: string, query: ListOffersQuery) =>
    [...offerKeys.all, companyId, "list", query] as const,
  detail: (companyId: string, offerId: string) =>
    [...offerKeys.all, companyId, offerId] as const,
};

export function useOffers(companyId: string | undefined, query: ListOffersQuery) {
  return useQuery({
    queryKey: offerKeys.list(companyId ?? "", query),
    queryFn: () => offerService.list(companyId!, query),
    enabled: Boolean(companyId),
  });
}

export function useOffer(companyId: string | undefined, offerId: string | undefined) {
  return useQuery({
    queryKey: offerKeys.detail(companyId ?? "", offerId ?? ""),
    queryFn: () => offerService.getById(companyId!, offerId!),
    enabled: Boolean(companyId && offerId),
  });
}

export function useCreateOffer(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProductOfferInput) => offerService.create(companyId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: offerKeys.all });
    },
  });
}

export function useUpdateProductOffer(companyId: string, offerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProductOfferInput) =>
      offerService.update(companyId, offerId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: offerKeys.all });
    },
  });
}

export function useChangeOfferStatus(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ offerId, input }: { offerId: string; input: ChangeOfferStatusInput }) =>
      offerService.changeStatus(companyId, offerId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: offerKeys.all });
    },
  });
}
