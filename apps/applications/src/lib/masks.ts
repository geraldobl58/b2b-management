// Máscara para CNPJ: XX.XXX.XXX/XXXX-XX
export const cnpjMask = (value: string): string => {
  // Remove tudo que não é número
  const digits = value.replace(/\D/g, '');

  // Aplica a máscara progressivamente
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 5) {
    return digits.replace(/(\d{2})(\d+)/, '$1.$2');
  } else if (digits.length <= 8) {
    return digits.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
  } else if (digits.length <= 12) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
  } else {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, '$1.$2.$3/$4-$5');
  }
};

// Máscara para telefone brasileiro: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
export const phoneMask = (value: string): string => {
  // Remove tudo que não é número
  const digits = value.replace(/\D/g, '');

  // Aplica a máscara progressivamente
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 6) {
    return digits.replace(/(\d{2})(\d+)/, '($1) $2');
  } else if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
  } else {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
};

// Máscara para CEP: XXXXX-XXX
export const cepMask = (value: string): string => {
  // Remove tudo que não é número
  const digits = value.replace(/\D/g, '');

  // Aplica a máscara
  if (digits.length <= 5) {
    return digits;
  } else {
    return digits.replace(/(\d{5})(\d+)/, '$1-$2');
  }
};

// Remove todas as máscaras, deixando apenas números
export const removeMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

// Verifica se o valor tem a máscara completa
export const isCnpjComplete = (value: string): boolean => {
  return removeMask(value).length === 14;
};

export const isPhoneComplete = (value: string): boolean => {
  const digits = removeMask(value);
  return digits.length === 10 || digits.length === 11;
};

export const isCepComplete = (value: string): boolean => {
  return removeMask(value).length === 8;
};