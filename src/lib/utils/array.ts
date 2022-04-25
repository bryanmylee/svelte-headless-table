import { counter } from './counter';

export const duplicates = <T>(items: Array<T>): Array<T> => {
	return Array(...counter(items).entries())
		.filter(([, count]) => count !== 1)
		.map(([key]) => key);
};
