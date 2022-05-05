import { getCounter } from './counter';

export const getDistinct = <T>(items: T[]): T[] => {
	return Array.from(getCounter(items).keys());
};

export const getDuplicates = <T>(items: T[]): T[] => {
	return Array.from(getCounter(items).entries())
		.filter(([, count]) => count !== 1)
		.map(([key]) => key);
};

export const getShuffled = <T>(items: T[]): T[] => {
	items = [...items];
	const shuffled = [];
	while (items.length) {
		const rand = Math.floor(Math.random() * items.length);
		shuffled.push(items.splice(rand, 1)[0]);
	}
	return shuffled;
};
