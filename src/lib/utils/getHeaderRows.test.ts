import type { SampleRow } from '$lib/sampleRows';
import type { Header } from '$lib/types/Header';
import { getHeaderRows } from './getHeaderRows';
import { NBSP } from '../constants';
import { createColumns, createDataColumn, createGroup } from './createColumns';

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

		const expected: Header<SampleRow>[][] = [
			[
				{
					type: 'data',
					header: 'First Name',
					key: 'firstName',
					colspan: 1,
				},
				{
					type: 'data',
					header: 'Last Name',
					key: 'lastName',
					colspan: 1,
				},
				{
					type: 'data',
					header: 'Age',
					key: 'age',
					colspan: 1,
				},
			],
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

		const expected: Header<SampleRow>[][] = [
			[
				{
					type: 'group',
					colspan: 3,
					header: 'Info',
				},
			],
			[
				{
					type: 'data',
					header: 'First Name',
					key: 'firstName',
					colspan: 1,
				},
				{
					type: 'data',
					header: 'Last Name',
					key: 'lastName',
					colspan: 1,
				},
				{
					type: 'data',
					header: 'Age',
					key: 'age',
					colspan: 1,
				},
			],
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

		const expected: Header<SampleRow>[][] = [
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
					type: 'data',
					header: 'First Name',
					key: 'firstName',
					colspan: 1,
				},
				{
					type: 'data',
					header: 'Last Name',
					key: 'lastName',
					colspan: 1,
				},
				{
					type: 'data',
					header: 'Age',
					key: 'age',
					colspan: 1,
				},
				{
					type: 'data',
					header: 'Status',
					key: 'status',
					colspan: 1,
				},
				{
					type: 'data',
					header: 'Profile Progress',
					key: 'progress',
					colspan: 1,
				},
			],
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

		const expected: Header<SampleRow>[][] = [
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
					type: 'data',
					header: 'First Name',
					key: 'firstName',
					colspan: 1,
				},
				{
					type: 'data',
					header: 'Last Name',
					key: 'lastName',
					colspan: 1,
				},
				{
					type: 'data',
					header: 'Age',
					key: 'age',
					colspan: 1,
				},
				{
					type: 'data',
					header: 'Status',
					key: 'status',
					colspan: 1,
				},
				{
					type: 'data',
					header: 'Profile Progress',
					key: 'progress',
					colspan: 1,
				},
			],
		];

		expect(actual).toStrictEqual(expected);
	});
});
