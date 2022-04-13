import type { SampleRow } from '$lib/sampleRows';
import { getHeaderRows } from './getHeaderRows';
import { createColumns, createDataColumn, createGroup } from './createColumns';
import { HeaderRow } from '$lib/models/HeaderRow';
import { HeaderDataCell, HeaderGroupCell, HEADER_BLANK } from '$lib/models/HeaderCell';

describe('getHeaderRows', () => {
	describe('data shape', () => {
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
				new HeaderRow({
					cells: [
						new HeaderDataCell({
							type: 'data',
							label: 'First Name',
							key: 'firstName',
							colspan: 1,
						}),
						new HeaderDataCell({
							type: 'data',
							label: 'Last Name',
							key: 'lastName',
							colspan: 1,
						}),
						new HeaderDataCell({
							type: 'data',
							label: 'Age',
							key: 'age',
							colspan: 1,
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
				new HeaderRow({
					cells: [
						new HeaderGroupCell({
							type: 'group',
							colspan: 3,
							label: 'Info',
						}),
					],
				}),
				new HeaderRow({
					cells: [
						new HeaderDataCell({
							type: 'data',
							label: 'First Name',
							key: 'firstName',
							colspan: 1,
						}),
						new HeaderDataCell({
							type: 'data',
							label: 'Last Name',
							key: 'lastName',
							colspan: 1,
						}),
						new HeaderDataCell({
							type: 'data',
							label: 'Age',
							key: 'age',
							colspan: 1,
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
				new HeaderRow({
					cells: [
						new HeaderGroupCell({
							type: 'group',
							colspan: 2,
							label: 'Name',
						}),
						new HeaderGroupCell({
							type: 'group',
							colspan: 3,
							label: 'Info',
						}),
					],
				}),
				new HeaderRow({
					cells: [
						new HeaderDataCell({
							type: 'data',
							label: 'First Name',
							key: 'firstName',
							colspan: 1,
						}),
						new HeaderDataCell({
							type: 'data',
							label: 'Last Name',
							key: 'lastName',
							colspan: 1,
						}),
						new HeaderDataCell({
							type: 'data',
							label: 'Age',
							key: 'age',
							colspan: 1,
						}),
						new HeaderDataCell({
							type: 'data',
							label: 'Status',
							key: 'status',
							colspan: 1,
						}),
						new HeaderDataCell({
							type: 'data',
							label: 'Profile Progress',
							key: 'progress',
							colspan: 1,
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
				new HeaderRow({
					cells: [
						new HeaderGroupCell({
							type: 'group',
							colspan: 2,
							label: 'Name',
						}),
						HEADER_BLANK,
						HEADER_BLANK,
						HEADER_BLANK,
					],
				}),
				new HeaderRow({
					cells: [
						new HeaderDataCell({
							type: 'data',
							label: 'First Name',
							key: 'firstName',
							colspan: 1,
						}),
						new HeaderDataCell({
							type: 'data',
							label: 'Last Name',
							key: 'lastName',
							colspan: 1,
						}),
						new HeaderDataCell({
							type: 'data',
							label: 'Age',
							key: 'age',
							colspan: 1,
						}),
						new HeaderDataCell({
							type: 'data',
							label: 'Status',
							key: 'status',
							colspan: 1,
						}),
						new HeaderDataCell({
							type: 'data',
							label: 'Profile Progress',
							key: 'progress',
							colspan: 1,
						}),
					],
				}),
			];

			expect(actual).toStrictEqual(expected);
		});
	});

	describe('data prototype', () => {
		it('creates instances of HeaderRow', () => {
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

			actual.forEach((row) => {
				expect(row).toBeInstanceOf(HeaderRow);
			});
		});

		it('creates instances of HeaderGroupCell and HeaderDataCell', () => {
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

			actual[0].cells.forEach((cell) => {
				expect(cell).toBeInstanceOf(HeaderGroupCell);
			});
			actual[1].cells.forEach((cell) => {
				expect(cell).toBeInstanceOf(HeaderDataCell);
			});
		});
	});
});
