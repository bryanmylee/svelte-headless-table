import type { RowData } from '$lib/sampleRows';
import type { Column } from '$lib/types/Column';
import type { Header } from '$lib/types/Header';
import { getHeaderRows } from './getHeaderRows';
import { NBSP } from '../constants';

describe('getHeaderRows', () => {
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

		const actual = getHeaderRows(columns);

		const expected: Header<RowData>[][] = [
			[
				{
					type: 'leaf',
					header: 'First Name',
					key: 'firstName',
					colspan: 1,
				},
				{
					type: 'leaf',
					header: 'Last Name',
					key: 'lastName',
					colspan: 1,
				},
				{
					type: 'leaf',
					header: 'Age',
					key: 'age',
					colspan: 1,
				},
			],
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

		const actual = getHeaderRows(columns);

		const expected: Header<RowData>[][] = [
			[
				{
					type: 'group',
					colspan: 3,
					header: 'Info',
				},
			],
			[
				{
					type: 'leaf',
					header: 'First Name',
					key: 'firstName',
					colspan: 1,
				},
				{
					type: 'leaf',
					header: 'Last Name',
					key: 'lastName',
					colspan: 1,
				},
				{
					type: 'leaf',
					header: 'Age',
					key: 'age',
					colspan: 1,
				},
			],
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

		const actual = getHeaderRows(columns);

		const expected: Header<RowData>[][] = [
			[
				{
					type: 'group',
					colspan: 2,
					header: 'Name',
				},
				{
					type: 'group',
					colspan: 3,
					header: 'Info',
				},
			],
			[
				{
					type: 'leaf',
					header: 'First Name',
					key: 'firstName',
					colspan: 1,
				},
				{
					type: 'leaf',
					header: 'Last Name',
					key: 'lastName',
					colspan: 1,
				},
				{
					type: 'leaf',
					header: 'Age',
					key: 'age',
					colspan: 1,
				},
				{
					type: 'leaf',
					header: 'Status',
					key: 'status',
					colspan: 1,
				},
				{
					type: 'leaf',
					header: 'Profile Progress',
					key: 'progress',
					colspan: 1,
				},
			],
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

		const actual = getHeaderRows(columns);

		const expected: Header<RowData>[][] = [
			[
				{
					type: 'group',
					colspan: 2,
					header: 'Name',
				},
				{
					type: 'blank',
					colspan: 1,
					header: NBSP,
				},
				{
					type: 'blank',
					colspan: 1,
					header: NBSP,
				},
				{
					type: 'blank',
					colspan: 1,
					header: NBSP,
				},
			],
			[
				{
					type: 'leaf',
					header: 'First Name',
					key: 'firstName',
					colspan: 1,
				},
				{
					type: 'leaf',
					header: 'Last Name',
					key: 'lastName',
					colspan: 1,
				},
				{
					type: 'leaf',
					header: 'Age',
					key: 'age',
					colspan: 1,
				},
				{
					type: 'leaf',
					header: 'Status',
					key: 'status',
					colspan: 1,
				},
				{
					type: 'leaf',
					header: 'Profile Progress',
					key: 'progress',
					colspan: 1,
				},
			],
		];

		expect(actual).toStrictEqual(expected);
	});
});
