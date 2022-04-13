import type { SampleRow } from '$lib/sampleRows';
import type { DataCell } from '$lib/types/DataCell';
import { getDataRows } from './getDataRows';

describe('getDataRows', () => {
	test('transforms empty data', () => {
		const actual = getDataRows<SampleRow>([], ['firstName', 'lastName']);

		const expected: DataCell<SampleRow>[][] = [];

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

		const expected: DataCell<SampleRow>[][] = [
			[
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
			[
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
		];

		expect(actual).toStrictEqual(expected);
	});
});
