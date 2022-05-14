import { name } from 'faker';

export interface Sample {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
	children?: Sample[];
}

export const createSamples = (...lengths: number[]) => {
	const createSamplesLevel = (depth = 0): Sample[] => {
		const length = lengths[depth];
		return [...Array(length)].map(() => {
			return {
				...getSample(depth),
				...(lengths[depth + 1] !== undefined ? { children: createSamplesLevel(depth + 1) } : {}),
			};
		});
	};
	return createSamplesLevel();
};

const getSample = (depth = 0): Sample => {
	const statusChance = Math.random();
	return {
		firstName: `${depth}, ${name.firstName()}`,
		lastName: name.lastName(),
		age: Math.floor(Math.random() * 30),
		visits: Math.floor(Math.random() * 100),
		progress: Math.floor(Math.random() * 100),
		status: statusChance > 0.66 ? 'relationship' : statusChance > 0.33 ? 'complicated' : 'single',
	};
};
