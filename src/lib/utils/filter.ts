export const nonNull = <T>(value: T | null): value is T => {
	return value !== null;
};

export const nonUndefined = <T>(value: T | undefined): value is T => {
	return value !== undefined;
};

export const nonNullish = <T>(value: T | null | undefined): value is T => {
	return value != null;
};
