import type { SampleRow } from '$lib/sampleRows';
import { getHeaderRows } from './getHeaderRows';
import { NBSP } from '../constants';
import { createColumns, createDataColumn, createGroup } from './createColumns';
import type { HeaderRow } from '$lib/types/HeaderRow';

describe('getHeaderRows', () => {
	test('3 columns', () => {
		const columns = createColumns<SampleRow>([
			createDataColumn({
				header: 'First Name',
				key: 'firstName',
			}),
			createDataColumn({
				header: 'Last Name',
				key: 'lastName',
			}),
			createDataColumn({
				header: 'Age',
				key: 'age',
			}),
		]);

		const actual = getHeaderRows(columns);

		const expected: HeaderRow<SampleRow>[] = [
			{
				cells: [
					{
						type: 'data',
						label: 'First Name',
						key: 'firstName',
						colspan: 1,
					},
					{
						type: 'data',
						label: 'Last Name',
						key: 'lastName',
						colspan: 1,
					},
					{
						type: 'data',
						label: 'Age',
						key: 'age',
						colspan: 1,
					},
				],
			},
		];

		expect(actual).toStrictEqual(expected);
	});

	test('1 group column over 3 columns', () => {
		const columns = createColumns<SampleRow>([
			createGroup({
				header: 'Info',
				columns: [
					createDataColumn({
						header: 'First Name',
						key: 'firstName',
					}),
					createDataColumn({
						header: 'Last Name',
						key: 'lastName',
					}),
					createDataColumn({
						header: 'Age',
						key: 'age',
					}),
				],
			}),
		]);

		const actual = getHeaderRows(columns);

		const expected: HeaderRow<SampleRow>[] = [
			{
				cells: [
					{
						type: 'group',
						colspan: 3,
						label: 'Info',
					},
				],
			},
			{
				cells: [
					{
						type: 'data',
						label: 'First Name',
						key: 'firstName',
						colspan: 1,
					},
					{
						type: 'data',
						label: 'Last Name',
						key: 'lastName',
						colspan: 1,
					},
					{
						type: 'data',
						label: 'Age',
						key: 'age',
						colspan: 1,
					},
				],
			},
		];

		expect(actual).toStrictEqual(expected);
	});

	test('1 group column over 2 columns, 1 group column over 3 columns', () => {
		const columns = createColumns<SampleRow>([
			createGroup({
				header: 'Name',
				columns: [
					createDataColumn({
						header: 'First Name',
						key: 'firstName',
					}),
					createDataColumn({
						header: 'Last Name',
						key: 'lastName',
					}),
				],
			}),
			createGroup({
				header: 'Info',
				columns: [
					createDataColumn({
						header: 'Age',
						key: 'age',
					}),
					createDataColumn({
						header: 'Status',
						key: 'status',
					}),
					createDataColumn({
						header: 'Profile Progress',
						key: 'progress',
					}),
				],
			}),
		]);

		const actual = getHeaderRows(columns);

		const expected: HeaderRow<SampleRow>[] = [
			{
				cells: [
					{
						type: 'group',
						colspan: 2,
						label: 'Name',
					},
					{
						type: 'group',
						colspan: 3,
						label: 'Info',
					},
				],
			},
			{
				cells: [
					{
						type: 'data',
						label: 'First Name',
						key: 'firstName',
						colspan: 1,
					},
					{
						type: 'data',
						label: 'Last Name',
						key: 'lastName',
						colspan: 1,
					},
					{
						type: 'data',
						label: 'Age',
						key: 'age',
						colspan: 1,
					},
					{
						type: 'data',
						label: 'Status',
						key: 'status',
						colspan: 1,
					},
					{
						type: 'data',
						label: 'Profile Progress',
						key: 'progress',
						colspan: 1,
					},
				],
			},
		];

		expect(actual).toStrictEqual(expected);
	});

	test('uneven columns, 1 group column over 2 columns, 3 columns', () => {
		const columns = createColumns<SampleRow>([
			createGroup({
				header: 'Name',
				columns: [
					createDataColumn({
						header: 'First Name',
						key: 'firstName',
					}),
					createDataColumn({
						header: 'Last Name',
						key: 'lastName',
					}),
				],
			}),
			createDataColumn({
				header: 'Age',
				key: 'age',
			}),
			createDataColumn({
				header: 'Status',
				key: 'status',
			}),
			createDataColumn({
				header: 'Profile Progress',
				key: 'progress',
			}),
		]);

		const actual = getHeaderRows(columns);

		const expected: HeaderRow<SampleRow>[] = [
			{
				cells: [
					{
						type: 'group',
						colspan: 2,
						label: 'Name',
					},
					{
						type: 'blank',
						colspan: 1,
						label: NBSP,
					},
					{
						type: 'blank',
						colspan: 1,
						label: NBSP,
					},
					{
						type: 'blank',
						colspan: 1,
						label: NBSP,
					},
				],
			},
			{
				cells: [
					{
						type: 'data',
						label: 'First Name',
						key: 'firstName',
						colspan: 1,
					},
					{
						type: 'data',
						label: 'Last Name',
						key: 'lastName',
						colspan: 1,
					},
					{
						type: 'data',
						label: 'Age',
						key: 'age',
						colspan: 1,
					},
					{
						type: 'data',
						label: 'Status',
						key: 'status',
						colspan: 1,
					},
					{
						type: 'data',
						label: 'Profile Progress',
						key: 'progress',
						colspan: 1,
					},
				],
			},
		];

		expect(actual).toStrictEqual(expected);
	});
});
