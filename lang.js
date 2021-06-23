export default {
  en: {
    required: () => `Is required!`,
    minimum: s => `Must be at least: ${s}`,
    maximum: s => `Must be at most: ${s}`,
    multipleOf: s => `Must be multiple of: ${s}`,
    minLength: s => `Must have at least ${s} character${s != 1 ? 's' : ''}`,
    maxLength: s => `Must have at most ${s} character${s != 1 ? 's' : ''}`,
    pattern: s => `Must be of specified type!`
  },
  pt: {
    required: () => `É obrigatório!`,
    minimum: s => `Deve ser no mínimo: ${s}`,
    maximum: s => `Deve ser no máximo: ${s}`,
    multipleOf: s => `Deve ser múltiplo de: ${s}`,
    minLength: s => `Deve ter no mínimo ${s} caractere${s != 1 ? 's' : ''}`,
    maxLength: s => `Deve ter no máximo ${s} caractere${s != 1 ? 's' : ''}`,
    pattern: s => `Deve ser do tipo especificado!`
  }
}
