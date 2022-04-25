import { getCounter } from './counter';

export const getDuplicates = <T>(items: Array<T>): Array<T> => {
	return Array(...getCounter(items).entries())
		.filter(([, count]) => count !== 1)
		.map(([key]) => key);
};
