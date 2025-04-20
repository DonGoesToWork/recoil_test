// utils.ts
export const generate_unique_id = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const get_current_date = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const get_snake_case = (input: string): string => {
  return input.replace(" ", "_");
};

export const get_snake_case_lowercase_input = (input: string): string => {
  return input.replace(" ", "_").toLocaleLowerCase();
};

export const get_pascal_case = (s: string): string => {
  return s.replace(/(\w)(\w*)/g, function (_g0, g1, g2) {
    return g1.toUpperCase() + g2.toLowerCase();
  });
};
