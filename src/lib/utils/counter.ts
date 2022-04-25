export const counter = <T>(items: Array<T>): Map<T, number> => {
	const counts = new Map<T, number>();
	items.forEach((item) => {
		counts.set(item, (counts.get(item) ?? 0) + 1);
	});
	return counts;
};
