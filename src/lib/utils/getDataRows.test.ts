import type { SampleRow } from '$lib/sampleRows';
import type { DataRow } from '$lib/types/DataRow';
import { getDataRows } from './getDataRows';

describe('getDataRows', () => {
	test('transforms empty data', () => {
		const actual = getDataRows<SampleRow>(
			[],
			[
				{
					type: 'data',
					key: 'firstName',
					header: 'First Name',
				},
				{
					type: 'data',
					key: 'lastName',
					header: 'Last Name',
				},
			]
		);

		const expected: DataRow<SampleRow>[] = [];

		expect(actual).toStrictEqual(expected);
	});

	test('transforms data', () => {
		const actual = getDataRows<SampleRow>(
			[
				{
					firstName: 'Adam',
					lastName: 'West',
					age: 50,
					progress: 75,
					status: 'completed',
					visits: 32,
				},
				{
					firstName: 'Becky',
					lastName: 'White',
					age: 93,
					progress: 43,
					status: 'completed',
					visits: 10,
				},
			],
			[
				{
					type: 'data',
					key: 'firstName',
					header: 'First Name',
				},
				{
					type: 'data',
					key: 'lastName',
					header: 'Last Name',
				},
				{
					type: 'data',
					key: 'progress',
					header: 'Progress',
				},
			]
		);

		const expected: DataRow<SampleRow>[] = [
			{
				cells: [
					{
						key: 'firstName',
						value: 'Adam',
						label: undefined,
					},
					{
						key: 'lastName',
						value: 'West',
						label: undefined,
					},
					{
						key: 'progress',
						value: 75,
						label: undefined,
					},
				],
			},
			{
				cells: [
					{
						key: 'firstName',
						value: 'Becky',
						label: undefined,
					},
					{
						key: 'lastName',
						value: 'White',
						label: undefined,
					},
					{
						key: 'progress',
						value: 43,
						label: undefined,
					},
				],
			},
		];

		expect(actual).toStrictEqual(expected);
	});
});
