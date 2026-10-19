import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { companyService } from "@/services/company.service";
import type { CreateCompanyInput, UpdateCompanyInput } from "@/types/company";

export const companyKeys = {
  all: ["companies"] as const,
  list: () => [...companyKeys.all, "list"] as const,
  detail: (companyId: string) => [...companyKeys.all, companyId] as const,
};

export function useCompanies(enabled = true) {
  return useQuery({
    queryKey: companyKeys.list(),
    queryFn: () => companyService.list(),
    enabled,
  });
}

export function useCompany(companyId: string | undefined) {
  return useQuery({
    queryKey: companyKeys.detail(companyId ?? ""),
    queryFn: () => companyService.getById(companyId!),
    enabled: Boolean(companyId),
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCompanyInput) => companyService.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}

export function useUpdateCompany(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCompanyInput) => companyService.update(companyId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}
