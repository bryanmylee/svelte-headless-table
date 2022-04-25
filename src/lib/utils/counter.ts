export const getCounter = <T>(items: Array<T>): Map<T, number> => {
	const result = new Map<T, number>();
	items.forEach((item) => {
		result.set(item, (result.get(item) ?? 0) + 1);
	});
	return result;
};
