export const compare = <T extends string | number>(a: T, b: T): number => {
	if (typeof a === 'number' && typeof b === 'number') {
		return a - b;
	}
	return a < b ? -1 : a > b ? 1 : 0;
};
