import { getCounter } from './counter';

export const getDistinct = <T>(items: T[]): T[] => {
	return Array.from(getCounter(items).keys());
};

export const getDuplicates = <T>(items: T[]): T[] => {
	return Array.from(getCounter(items).entries())
		.filter(([, count]) => count !== 1)
		.map(([key]) => key);
};
