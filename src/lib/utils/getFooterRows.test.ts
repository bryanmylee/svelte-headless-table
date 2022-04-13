import type { SampleRow } from '$lib/sampleRows';
import { FooterDataCell, FooterGroupCell, FOOTER_BLANK } from '$lib/models/FooterCell';
import { FooterRow } from '$lib/models/FooterRow';
import { createColumns, createDataColumn, createGroup } from './createColumns';
import { getFooterRows } from './getFooterRows';

describe('getFooterRows', () => {
	describe('data shape', () => {
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

			const expected: FooterRow<SampleRow>[] = [];

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

			const expected: FooterRow<SampleRow>[] = [
				new FooterRow({
					cells: [
						new FooterDataCell({
							label: 'First Name',
							key: 'firstName',
						}),
						new FooterDataCell({
							label: 'Last Name',
							key: 'lastName',
						}),
						new FooterDataCell({
							label: 'Age',
							key: 'age',
						}),
					],
				}),
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

			const expected: FooterRow<SampleRow>[] = [
				new FooterRow({
					cells: [
						new FooterGroupCell({
							colspan: 3,
							label: 'Info',
						}),
					],
				}),
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

			const expected: FooterRow<SampleRow>[] = [
				new FooterRow({
					cells: [
						new FooterDataCell({
							label: 'First Name',
							key: 'firstName',
						}),
						new FooterDataCell({
							label: 'Last Name',
							key: 'lastName',
						}),
						new FooterDataCell({
							label: 'Age',
							key: 'age',
						}),
					],
				}),
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

			const expected: FooterRow<SampleRow>[] = [
				new FooterRow({
					cells: [
						new FooterDataCell({
							label: 'First Name',
							key: 'firstName',
						}),
						new FooterDataCell({
							label: 'Last Name',
							key: 'lastName',
						}),
						new FooterDataCell({
							label: 'Age',
							key: 'age',
						}),
					],
				}),
				new FooterRow({
					cells: [
						new FooterGroupCell({
							colspan: 3,
							label: 'Info',
						}),
					],
				}),
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

			const expected: FooterRow<SampleRow>[] = [
				new FooterRow({
					cells: [
						new FooterDataCell({
							label: 'First Name',
							key: 'firstName',
						}),
						new FooterDataCell({
							label: 'Last Name',
							key: 'lastName',
						}),
						new FooterDataCell({
							label: 'Age',
							key: 'age',
						}),
						new FooterDataCell({
							label: 'Status',
							key: 'status',
						}),
						new FooterDataCell({
							label: 'Profile Progress',
							key: 'progress',
						}),
					],
				}),
				new FooterRow({
					cells: [
						new FooterGroupCell({
							colspan: 2,
							label: 'Name',
						}),
						new FooterGroupCell({
							colspan: 3,
							label: 'Info',
						}),
					],
				}),
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

			const expected: FooterRow<SampleRow>[] = [
				new FooterRow({
					cells: [
						new FooterDataCell({
							label: 'First Name',
							key: 'firstName',
						}),
						new FooterDataCell({
							label: 'Last Name',
							key: 'lastName',
						}),
						new FooterDataCell({
							label: 'Age',
							key: 'age',
						}),
						new FooterDataCell({
							label: 'Status',
							key: 'status',
						}),
						new FooterDataCell({
							label: 'Profile Progress',
							key: 'progress',
						}),
					],
				}),
				new FooterRow({
					cells: [
						new FooterGroupCell({
							colspan: 2,
							label: 'Name',
						}),
						FOOTER_BLANK,
						FOOTER_BLANK,
						FOOTER_BLANK,
					],
				}),
			];

			expect(actual).toStrictEqual(expected);
		});
	});

	describe('data prototype', () => {
		it('creates instances of FooterRow', () => {
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

			actual.forEach((row) => {
				expect(row).toBeInstanceOf(FooterRow);
			});
		});

		it('creates instances of FooterGroupCell and FooterDataCell', () => {
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

			actual[0].cells.forEach((cell) => {
				expect(cell).toBeInstanceOf(FooterDataCell);
			});
			actual[1].cells.forEach((cell) => {
				expect(cell).toBeInstanceOf(FooterGroupCell);
			});
		});
	});
});
