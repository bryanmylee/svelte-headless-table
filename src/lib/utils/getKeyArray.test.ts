import type { RowData } from '$lib/sampleRows';
import type { Column } from '$lib/types/Column';
import { getKeyArray } from './getKeyArray';

describe('getKeyArray', () => {
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

		const actual = getKeyArray(columns);

		const expected = ['firstName', 'lastName', 'age'];

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

		const actual = getKeyArray(columns);

		const expected = ['firstName', 'lastName', 'age'];

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

		const actual = getKeyArray(columns);

		const expected = ['firstName', 'lastName', 'age', 'status', 'progress'];

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

		const actual = getKeyArray(columns);

		const expected = ['firstName', 'lastName', 'age', 'status', 'progress'];

		expect(actual).toStrictEqual(expected);
	});
});
