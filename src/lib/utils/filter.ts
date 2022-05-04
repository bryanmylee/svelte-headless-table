export const nonNull = <T>(value: T | null): value is T => value !== null;

export const nonUndefined = <T>(value: T | undefined): value is T => value !== undefined;

export const nonNullish = <T>(value: T | null | undefined): value is T => value != null;

export const isNumber = (value: unknown): value is number => typeof value === 'number';
