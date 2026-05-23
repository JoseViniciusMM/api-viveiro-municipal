export const STATUS_ESPECIE = Object.freeze({
  Ativo:   "ATIVO",
  Inativo: "INATIVO"
});

export const TIPO_ESPECIE = Object.freeze({
  Semente: "SEMENTE",
  Muda:    "MUDA"
});

export const CATEGORIA_ESPECIE = Object.freeze({
  Arborea:    "ARBOREA",
  Frutifera:  "FRUTIFERA",
  Ornamental: "ORNAMENTAL",
  Nativa:     "NATIVA",
  Exotica:    "EXOTICA"
});

export const STATUS_ESPECIE_ENUM    = Object.freeze(Object.values(STATUS_ESPECIE));
export const TIPO_ESPECIE_ENUM      = Object.freeze(Object.values(TIPO_ESPECIE));
export const CATEGORIA_ESPECIE_ENUM = Object.freeze(Object.values(CATEGORIA_ESPECIE));