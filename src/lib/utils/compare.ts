export const compare = <T extends string | number>(a: T | T[], b: T | T[]): number => {
	if (Array.isArray(a) && Array.isArray(b)) {
		return compareArray(a, b);
	}
	if (typeof a === 'number' && typeof b === 'number') return a - b;
	return a < b ? -1 : a > b ? 1 : 0;
};

export const compareArray = <T extends string | number>(a: T[], b: T[]): number => {
	const minLength = Math.min(a.length, b.length);
	for (let i = 0; i < minLength; i++) {
		const order = compare(a[i], b[i]);
		if (order !== 0) return order;
	}
	return 0;
};
