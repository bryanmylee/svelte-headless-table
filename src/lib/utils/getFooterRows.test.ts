import type { SampleRow } from '$lib/sampleRows';
import type { FooterCell } from '$lib/types/FooterCell';
import { NBSP } from '../constants';
import { createColumns, createDataColumn, createGroup } from './createColumns';
import { getFooterRows } from './getFooterRows';

describe('getFooterRows', () => {
	test('no footers', () => {
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

		const actual = getFooterRows(columns);

		const expected: FooterCell<SampleRow>[][] = [];

		expect(actual).toStrictEqual(expected);
	});

	test('no footers on level 0', () => {
		const columns = createColumns<SampleRow>([
			createGroup({
				header: 'Info',
				columns: [
					createDataColumn({
						header: 'First Name',
						footer: 'First Name',
						key: 'firstName',
					}),
					createDataColumn({
						header: 'Last Name',
						footer: 'Last Name',
						key: 'lastName',
					}),
					createDataColumn({
						header: 'Age',
						footer: 'Age',
						key: 'age',
					}),
				],
			}),
		]);

		const actual = getFooterRows(columns);

		const expected: FooterCell<SampleRow>[][] = [
			[
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
		];

		expect(actual).toStrictEqual(expected);
	});

	test('no footers on level 1', () => {
		const columns = createColumns<SampleRow>([
			createGroup({
				header: 'Info',
				footer: 'Info',
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

		const actual = getFooterRows(columns);

		const expected: FooterCell<SampleRow>[][] = [
			[
				{
					type: 'group',
					colspan: 3,
					label: 'Info',
				},
			],
		];

		expect(actual).toStrictEqual(expected);
	});

	test('3 columns', () => {
		const columns = createColumns<SampleRow>([
			createDataColumn({
				header: 'First Name',
				footer: 'First Name',
				key: 'firstName',
			}),
			createDataColumn({
				header: 'Last Name',
				footer: 'Last Name',
				key: 'lastName',
			}),
			createDataColumn({
				header: 'Age',
				footer: 'Age',
				key: 'age',
			}),
		]);

		const actual = getFooterRows(columns);

		const expected: FooterCell<SampleRow>[][] = [
			[
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
		];

		expect(actual).toStrictEqual(expected);
	});

	test('1 group column over 3 columns', () => {
		const columns = createColumns<SampleRow>([
			createGroup({
				header: 'Info',
				footer: 'Info',
				columns: [
					createDataColumn({
						header: 'First Name',
						footer: 'First Name',
						key: 'firstName',
					}),
					createDataColumn({
						header: 'Last Name',
						footer: 'Last Name',
						key: 'lastName',
					}),
					createDataColumn({
						header: 'Age',
						footer: 'Age',
						key: 'age',
					}),
				],
			}),
		]);

		const actual = getFooterRows(columns);

		const expected: FooterCell<SampleRow>[][] = [
			[
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
			[
				{
					type: 'group',
					colspan: 3,
					label: 'Info',
				},
			],
		];

		expect(actual).toStrictEqual(expected);
	});

	test('1 group column over 2 columns, 1 group column over 3 columns', () => {
		const columns = createColumns<SampleRow>([
			createGroup({
				header: 'Name',
				footer: 'Name',
				columns: [
					createDataColumn({
						header: 'First Name',
						footer: 'First Name',
						key: 'firstName',
					}),
					createDataColumn({
						header: 'Last Name',
						footer: 'Last Name',
						key: 'lastName',
					}),
				],
			}),
			createGroup({
				header: 'Info',
				footer: 'Info',
				columns: [
					createDataColumn({
						header: 'Age',
						footer: 'Age',
						key: 'age',
					}),
					createDataColumn({
						header: 'Status',
						footer: 'Status',
						key: 'status',
					}),
					createDataColumn({
						header: 'Profile Progress',
						footer: 'Profile Progress',
						key: 'progress',
					}),
				],
			}),
		]);

		const actual = getFooterRows(columns);

		const expected: FooterCell<SampleRow>[][] = [
			[
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
			[
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
		];

		expect(actual).toStrictEqual(expected);
	});

	test('uneven columns, 1 group column over 2 columns, 3 columns', () => {
		const columns = createColumns<SampleRow>([
			createGroup({
				header: 'Name',
				footer: 'Name',
				columns: [
					createDataColumn({
						header: 'First Name',
						footer: 'First Name',
						key: 'firstName',
					}),
					createDataColumn({
						header: 'Last Name',
						footer: 'Last Name',
						key: 'lastName',
					}),
				],
			}),
			createDataColumn({
				header: 'Age',
				footer: 'Age',
				key: 'age',
			}),
			createDataColumn({
				header: 'Status',
				footer: 'Status',
				key: 'status',
			}),
			createDataColumn({
				header: 'Profile Progress',
				footer: 'Profile Progress',
				key: 'progress',
			}),
		]);

		const actual = getFooterRows(columns);

		const expected: FooterCell<SampleRow>[][] = [
			[
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
			[
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
		];

		expect(actual).toStrictEqual(expected);
	});
});
