import type { SampleRow } from '$lib/sampleRows';
import type { ColumnData } from '$lib/types/Column';
import { DataCell } from '$lib/types/DataCell';
import { DataRow } from '$lib/types/DataRow';
import { getDataRows } from './getDataRows';

describe('getDataRows', () => {
	const data: SampleRow[] = [
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
	];

	const columns: ColumnData<SampleRow>[] = [
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
	];

	describe('data shape', () => {
		test('transforms empty data', () => {
			const actual = getDataRows([], columns);

			const expected: DataRow<SampleRow>[] = [];

			expect(actual).toStrictEqual(expected);
		});

		test('transforms data', () => {
			const actual = getDataRows(data, columns);

			const expected: DataRow<SampleRow>[] = [
				new DataRow({
					cells: [
						new DataCell({
							key: 'firstName',
							value: 'Adam',
							label: undefined,
						}),
						new DataCell({
							key: 'lastName',
							value: 'West',
							label: undefined,
						}),
						new DataCell({
							key: 'progress',
							value: 75,
							label: undefined,
						}),
					],
				}),
				new DataRow({
					cells: [
						new DataCell({
							key: 'firstName',
							value: 'Becky',
							label: undefined,
						}),
						new DataCell({
							key: 'lastName',
							value: 'White',
							label: undefined,
						}),
						new DataCell({
							key: 'progress',
							value: 43,
							label: undefined,
						}),
					],
				}),
			];

			expect(actual).toStrictEqual(expected);
		});
	});

	describe('data prototype', () => {
		it('creates instances of DataRow and DataCell', () => {
			const actual = getDataRows(data, columns);

			actual.forEach((row) => {
				expect(row).toBeInstanceOf(DataRow);
				row.cells.forEach((cell) => {
					expect(cell).toBeInstanceOf(DataCell);
				});
			});
		});
	});
});
