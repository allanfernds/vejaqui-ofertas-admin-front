export const CPF_LENGTH = 11;
export const CNPJ_LENGTH = 14;

const CPF_FIRST_WEIGHTS = [10, 9, 8, 7, 6, 5, 4, 3, 2];
const CPF_SECOND_WEIGHTS = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

/** Removes everything that is not a digit. */
export function normalizeCpf(document: string): string {
  return document.replace(/\D/g, "");
}

/**
 * Keeps letters and digits, uppercases letters.
 * Do not use /\D/g here — that would drop alphanumeric CNPJ characters.
 */
export function normalizeCnpj(document: string): string {
  return document.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

function hasOnlyRepeatedDigits(digits: string): boolean {
  return /^(\d)\1+$/.test(digits);
}

function calculateCpfCheckDigit(digits: string, weights: number[]): number {
  const sum = weights.reduce(
    (total, weight, index) => total + Number(digits[index]) * weight,
    0,
  );
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

/**
 * Official alphanumeric CNPJ DV: ASCII code minus 48.
 * Digits stay 0–9; A=17 … Z=42. See RFB "Manual de Cálculo do DV do CNPJ".
 */
function cnpjCharValue(character: string): number {
  return character.charCodeAt(0) - 48;
}

function calculateCnpjCheckDigit(chars: string, weights: number[]): number {
  const sum = weights.reduce(
    (total, weight, index) => total + cnpjCharValue(chars[index] ?? "") * weight,
    0,
  );
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function validateCpf(document: string): boolean {
  const digits = normalizeCpf(document);

  if (digits.length !== CPF_LENGTH || hasOnlyRepeatedDigits(digits)) {
    return false;
  }

  const firstCheckDigit = calculateCpfCheckDigit(digits.slice(0, 9), CPF_FIRST_WEIGHTS);
  const secondCheckDigit = calculateCpfCheckDigit(
    digits.slice(0, 10),
    CPF_SECOND_WEIGHTS,
  );

  return digits[9] === String(firstCheckDigit) && digits[10] === String(secondCheckDigit);
}

export function validateCnpj(document: string): boolean {
  const normalized = normalizeCnpj(document);

  if (normalized.length !== CNPJ_LENGTH) {
    return false;
  }

  const body = normalized.slice(0, 12);
  const checkDigits = normalized.slice(12);

  if (!/^[A-Z0-9]{12}$/.test(body) || !/^\d{2}$/.test(checkDigits)) {
    return false;
  }

  if (/^\d+$/.test(normalized) && hasOnlyRepeatedDigits(normalized)) {
    return false;
  }

  const firstCheckDigit = calculateCnpjCheckDigit(body, CNPJ_FIRST_WEIGHTS);
  const secondCheckDigit = calculateCnpjCheckDigit(
    `${body}${firstCheckDigit}`,
    CNPJ_SECOND_WEIGHTS,
  );

  return (
    checkDigits[0] === String(firstCheckDigit) &&
    checkDigits[1] === String(secondCheckDigit)
  );
}

export function formatCpf(document: string): string {
  const digits = normalizeCpf(document).slice(0, CPF_LENGTH);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatCnpj(document: string): string {
  const value = normalizeCnpj(document).slice(0, CNPJ_LENGTH);
  return value
    .replace(/([A-Z0-9]{2})([A-Z0-9])/, "$1.$2")
    .replace(/([A-Z0-9]{3})([A-Z0-9])/, "$1.$2")
    .replace(/([A-Z0-9]{3})([A-Z0-9])/, "$1/$2")
    .replace(/([A-Z0-9]{4})(\d{1,2})$/, "$1-$2");
}

export function maskDocument(document: string, personType: "PF" | "PJ"): string {
  if (personType === "PF") {
    const digits = normalizeCpf(document);
    if (digits.length !== CPF_LENGTH) {
      return formatCpf(document);
    }
    return `${digits.slice(0, 3)}.***.***-${digits.slice(9)}`;
  }

  const value = normalizeCnpj(document);
  if (value.length !== CNPJ_LENGTH) {
    return formatCnpj(document);
  }
  return `${value.slice(0, 2)}.***.***/${value.slice(8, 12)}-${value.slice(12)}`;
}
