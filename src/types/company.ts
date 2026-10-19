export type PersonType = "PF" | "PJ";
export type CompanyRole = "OWNER" | "ADMIN" | "EDITOR";

export interface Company {
  id: string;
  personType: PersonType;
  document: string;
  name: string;
  legalName: string | null;
  logoUrl: string | null;
  logoPublicId: string | null;
  businessEmail: string;
  phone: string;
  whatsapp: string | null;
  postalCode: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyWithRole extends Company {
  role: CompanyRole;
}

export interface CreateCompanyInput {
  personType: PersonType;
  document: string;
  name: string;
  legalName?: string | null;
  logoUrl?: string | null;
  logoPublicId?: string | null;
  businessEmail: string;
  phone: string;
  whatsapp?: string | null;
  postalCode: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
}

export type UpdateCompanyInput = Partial<
  Omit<CreateCompanyInput, "personType" | "document">
>;
