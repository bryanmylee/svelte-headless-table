import type { RowData } from '$lib/sampleRows';
import type { Column } from '$lib/types/Column';
import type { Th } from '$lib/types/Th';
import { getHeaderRows } from './getHeaderRows';
import { NBSP } from '../constants';

describe('getHeaderRows', () => {
	test('3 columns', () => {
		const columns: Column<RowData>[] = [
			{
				name: 'First Name',
				key: 'firstName',
			},
			{
				name: 'Last Name',
				key: 'lastName',
			},
			{
				name: 'Age',
				key: 'age',
			},
		];

		const actual = getHeaderRows(columns);

		const expected: Th<RowData>[][] = [
			[
				{
					type: 'leaf',
					name: 'First Name',
					key: 'firstName',
					colspan: 1,
				},
				{
					type: 'leaf',
					name: 'Last Name',
					key: 'lastName',
					colspan: 1,
				},
				{
					type: 'leaf',
					name: 'Age',
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
				name: 'Info',
				columns: [
					{
						name: 'First Name',
						key: 'firstName',
					},
					{
						name: 'Last Name',
						key: 'lastName',
					},
					{
						name: 'Age',
						key: 'age',
					},
				],
			},
		];

		const actual = getHeaderRows(columns);

		const expected: Th<RowData>[][] = [
			[
				{
					type: 'group',
					colspan: 3,
					name: 'Info',
				},
			],
			[
				{
					type: 'leaf',
					name: 'First Name',
					key: 'firstName',
					colspan: 1,
				},
				{
					type: 'leaf',
					name: 'Last Name',
					key: 'lastName',
					colspan: 1,
				},
				{
					type: 'leaf',
					name: 'Age',
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
				name: 'Name',
				columns: [
					{
						name: 'First Name',
						key: 'firstName',
					},
					{
						name: 'Last Name',
						key: 'lastName',
					},
				],
			},
			{
				name: 'Info',
				columns: [
					{
						name: 'Age',
						key: 'age',
					},
					{
						name: 'Status',
						key: 'status',
					},
					{
						name: 'Profile Progress',
						key: 'progress',
					},
				],
			},
		];

		const actual = getHeaderRows(columns);

		const expected: Th<RowData>[][] = [
			[
				{
					type: 'group',
					colspan: 2,
					name: 'Name',
				},
				{
					type: 'group',
					colspan: 3,
					name: 'Info',
				},
			],
			[
				{
					type: 'leaf',
					name: 'First Name',
					key: 'firstName',
					colspan: 1,
				},
				{
					type: 'leaf',
					name: 'Last Name',
					key: 'lastName',
					colspan: 1,
				},
				{
					type: 'leaf',
					name: 'Age',
					key: 'age',
					colspan: 1,
				},
				{
					type: 'leaf',
					name: 'Status',
					key: 'status',
					colspan: 1,
				},
				{
					type: 'leaf',
					name: 'Profile Progress',
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
				name: 'Name',
				columns: [
					{
						name: 'First Name',
						key: 'firstName',
					},
					{
						name: 'Last Name',
						key: 'lastName',
					},
				],
			},
			{
				name: 'Age',
				key: 'age',
			},
			{
				name: 'Status',
				key: 'status',
			},
			{
				name: 'Profile Progress',
				key: 'progress',
			},
		];

		const actual = getHeaderRows(columns);

		const expected: Th<RowData>[][] = [
			[
				{
					type: 'group',
					colspan: 2,
					name: 'Name',
				},
				{
					type: 'blank',
					colspan: 1,
					name: NBSP,
				},
				{
					type: 'blank',
					colspan: 1,
					name: NBSP,
				},
				{
					type: 'blank',
					colspan: 1,
					name: NBSP,
				},
			],
			[
				{
					type: 'leaf',
					name: 'First Name',
					key: 'firstName',
					colspan: 1,
				},
				{
					type: 'leaf',
					name: 'Last Name',
					key: 'lastName',
					colspan: 1,
				},
				{
					type: 'leaf',
					name: 'Age',
					key: 'age',
					colspan: 1,
				},
				{
					type: 'leaf',
					name: 'Status',
					key: 'status',
					colspan: 1,
				},
				{
					type: 'leaf',
					name: 'Profile Progress',
					key: 'progress',
					colspan: 1,
				},
			],
		];

		expect(actual).toStrictEqual(expected);
	});
});
