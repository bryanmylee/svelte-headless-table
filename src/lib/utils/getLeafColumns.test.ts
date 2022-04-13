import type { SampleRow } from '$lib/sampleRows';
import type { ColumnDef, ColumnLeafDef } from '$lib/types/ColumnDef';
import { getLeafColumns } from './getLeafColumns';

describe('getLeafColumns', () => {
	test('3 columns', () => {
		const columns: ColumnDef<SampleRow>[] = [
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

		const expected: ColumnLeafDef<SampleRow>[] = [
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
		const columns: ColumnDef<SampleRow>[] = [
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

		const expected: ColumnLeafDef<SampleRow>[] = [
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
		const columns: ColumnDef<SampleRow>[] = [
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

		const expected: ColumnLeafDef<SampleRow>[] = [
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
		const columns: ColumnDef<SampleRow>[] = [
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

		const expected: ColumnLeafDef<SampleRow>[] = [
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
