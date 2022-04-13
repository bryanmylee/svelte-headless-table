export const sum = (...numbers: number[]): number => numbers.reduce((a, b) => a + b, 0);

export const mean = (...numbers: number[]): number => sum(...numbers) / numbers.length;
