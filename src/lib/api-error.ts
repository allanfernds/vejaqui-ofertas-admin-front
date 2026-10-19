import { ApiError } from "@/types/api";

const FRIENDLY_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: "Confira os campos destacados e tente novamente.",
  UNAUTHORIZED: "Sua sessão expirou. Entre novamente para continuar.",
  FORBIDDEN: "Você não tem permissão para fazer isso.",
  NOT_FOUND: "Não encontramos o que você procura.",
  CONFLICT: "Esses dados já estão em uso.",
  EMAIL_ALREADY_EXISTS: "Este e-mail já está cadastrado.",
  DOCUMENT_ALREADY_EXISTS: "Este CPF ou CNPJ já está cadastrado.",
  INVALID_CREDENTIALS: "E-mail ou senha incorretos.",
  INVALID_CPF: "Informe um CPF válido.",
  INVALID_CNPJ: "Informe um CNPJ válido.",
  INVALID_PROMOTIONAL_PRICE: "O preço da oferta precisa ser menor que o preço original.",
  INVALID_SHIPPING_PRICE: "Informe um valor de frete válido.",
  INVALID_OFFER_DATES: "Confira as datas de início e fim da oferta.",
  INVALID_PRODUCT_IMAGES: "Adicione pelo menos uma imagem do produto.",
  COMPANY_ACCESS_DENIED: "Você não tem acesso a esta empresa.",
  COMPANY_INACTIVE: "Esta empresa está inativa.",
  RATE_LIMIT_EXCEEDED: "Muitas tentativas. Espere um pouco e tente de novo.",
  INTERNAL_SERVER_ERROR: "Algo deu errado. Tente novamente em instantes.",
};

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return FRIENDLY_MESSAGES[error.code] ?? error.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return fallback;
  }

  return fallback;
}
