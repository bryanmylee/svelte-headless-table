import type { RowData } from '$lib/sampleRows';
import type { Column, ColumnLeaf } from '$lib/types/Column';
import { getLeafColumns } from './getLeafColumns';

describe('getLeafColumns', () => {
	test('3 columns', () => {
		const columns: Column<RowData>[] = [
			{
				header: 'First Name',
				key: 'firstName',
			},
			{
				header: 'Last Name',
				key: 'lastName',
			},
			{
				header: 'Age',
				key: 'age',
			},
		];

		const actual = getLeafColumns(columns);

		const expected: ColumnLeaf<RowData>[] = [
			{
				header: 'First Name',
				key: 'firstName',
			},
			{
				header: 'Last Name',
				key: 'lastName',
			},
			{
				header: 'Age',
				key: 'age',
			},
		];

		expect(actual).toStrictEqual(expected);
	});

	test('1 group column over 3 columns', () => {
		const columns: Column<RowData>[] = [
			{
				header: 'Info',
				columns: [
					{
						header: 'First Name',
						key: 'firstName',
					},
					{
						header: 'Last Name',
						key: 'lastName',
					},
					{
						header: 'Age',
						key: 'age',
					},
				],
			},
		];

		const actual = getLeafColumns(columns);

		const expected: ColumnLeaf<RowData>[] = [
			{
				header: 'First Name',
				key: 'firstName',
			},
			{
				header: 'Last Name',
				key: 'lastName',
			},
			{
				header: 'Age',
				key: 'age',
			},
		];

		expect(actual).toStrictEqual(expected);
	});

	test('1 group column over 2 columns, 1 group column over 3 columns', () => {
		const columns: Column<RowData>[] = [
			{
				header: 'Name',
				columns: [
					{
						header: 'First Name',
						key: 'firstName',
					},
					{
						header: 'Last Name',
						key: 'lastName',
					},
				],
			},
			{
				header: 'Info',
				columns: [
					{
						header: 'Age',
						key: 'age',
					},
					{
						header: 'Status',
						key: 'status',
					},
					{
						header: 'Profile Progress',
						key: 'progress',
					},
				],
			},
		];

		const actual = getLeafColumns(columns);

		const expected: ColumnLeaf<RowData>[] = [
			{
				header: 'First Name',
				key: 'firstName',
			},
			{
				header: 'Last Name',
				key: 'lastName',
			},
			{
				header: 'Age',
				key: 'age',
			},
			{
				header: 'Status',
				key: 'status',
			},
			{
				header: 'Profile Progress',
				key: 'progress',
			},
		];

		expect(actual).toStrictEqual(expected);
	});

	test('uneven columns, 1 group column over 2 columns, 3 columns', () => {
		const columns: Column<RowData>[] = [
			{
				header: 'Name',
				columns: [
					{
						header: 'First Name',
						key: 'firstName',
					},
					{
						header: 'Last Name',
						key: 'lastName',
					},
				],
			},
			{
				header: 'Age',
				key: 'age',
			},
			{
				header: 'Status',
				key: 'status',
			},
			{
				header: 'Profile Progress',
				key: 'progress',
			},
		];

		const actual = getLeafColumns(columns);

		const expected: ColumnLeaf<RowData>[] = [
			{
				header: 'First Name',
				key: 'firstName',
			},
			{
				header: 'Last Name',
				key: 'lastName',
			},
			{
				header: 'Age',
				key: 'age',
			},
			{
				header: 'Status',
				key: 'status',
			},
			{
				header: 'Profile Progress',
				key: 'progress',
			},
		];

		expect(actual).toStrictEqual(expected);
	});
});
