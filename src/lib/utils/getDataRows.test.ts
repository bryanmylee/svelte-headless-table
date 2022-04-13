import type { SampleRow } from '$lib/sampleRows';
import type { DataRow } from '$lib/types/DataRow';
import { getDataRows } from './getDataRows';

describe('getDataRows', () => {
	test('transforms empty data', () => {
		const actual = getDataRows<SampleRow>([], ['firstName', 'lastName']);

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
			['firstName', 'lastName', 'progress']
		);

		const expected: DataRow<SampleRow>[] = [
			{
				cells: [
					{
						key: 'firstName',
						value: 'Adam',
					},
					{
						key: 'lastName',
						value: 'West',
					},
					{
						key: 'progress',
						value: 75,
					},
				],
			},
			{
				cells: [
					{
						key: 'firstName',
						value: 'Becky',
					},
					{
						key: 'lastName',
						value: 'White',
					},
					{
						key: 'progress',
						value: 43,
					},
				],
			},
		];

		expect(actual).toStrictEqual(expected);
	});
});
