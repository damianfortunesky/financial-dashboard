export const optionalSelectId = (value: unknown) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? null : numericValue;
};

export const normalizeUnitOfMeasure = (value: unknown) => String(value ?? "").trim().toLocaleUpperCase("es-AR");
