import type { SampleRow } from '$lib/sampleRows';
import { getHeaderRows } from './getHeaderRows';
import { createColumns, createDataColumn, createGroup } from './createColumns';
import { HeaderRow } from '$lib/models/HeaderRow';
import { HeaderDataCell, HeaderGroupCell, HeaderBlankCell } from '$lib/models/HeaderCell';
import type { TableInstance } from '$lib/models/TableInstance';

describe('getHeaderRows', () => {
	const table = {} as TableInstance<SampleRow>;
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

			const actual = getHeaderRows(table, columns);

			const expected: HeaderRow<SampleRow>[] = [
				new HeaderRow({
					cells: [
						new HeaderDataCell({
							table,
							label: 'First Name',
							key: 'firstName',
						}),
						new HeaderDataCell({
							table,
							label: 'Last Name',
							key: 'lastName',
						}),
						new HeaderDataCell({
							table,
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

			const actual = getHeaderRows(table, columns);

			const expected: HeaderRow<SampleRow>[] = [
				new HeaderRow({
					cells: [
						new HeaderGroupCell({
							table,
							colspan: 3,
							label: 'Info',
						}),
					],
				}),
				new HeaderRow({
					cells: [
						new HeaderDataCell({
							table,
							label: 'First Name',
							key: 'firstName',
						}),
						new HeaderDataCell({
							table,
							label: 'Last Name',
							key: 'lastName',
						}),
						new HeaderDataCell({
							table,
							label: 'Age',
							key: 'age',
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

			const actual = getHeaderRows(table, columns);

			const expected: HeaderRow<SampleRow>[] = [
				new HeaderRow({
					cells: [
						new HeaderGroupCell({
							table,
							colspan: 2,
							label: 'Name',
						}),
						new HeaderGroupCell({
							table,
							colspan: 3,
							label: 'Info',
						}),
					],
				}),
				new HeaderRow({
					cells: [
						new HeaderDataCell({
							table,
							label: 'First Name',
							key: 'firstName',
						}),
						new HeaderDataCell({
							table,
							label: 'Last Name',
							key: 'lastName',
						}),
						new HeaderDataCell({
							table,
							label: 'Age',
							key: 'age',
						}),
						new HeaderDataCell({
							table,
							label: 'Status',
							key: 'status',
						}),
						new HeaderDataCell({
							table,
							label: 'Profile Progress',
							key: 'progress',
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

			const actual = getHeaderRows(table, columns);

			const expected: HeaderRow<SampleRow>[] = [
				new HeaderRow({
					cells: [
						new HeaderGroupCell({
							table,
							colspan: 2,
							label: 'Name',
						}),
						new HeaderBlankCell({ table }),
						new HeaderBlankCell({ table }),
						new HeaderBlankCell({ table }),
					],
				}),
				new HeaderRow({
					cells: [
						new HeaderDataCell({
							table,
							label: 'First Name',
							key: 'firstName',
						}),
						new HeaderDataCell({
							table,
							label: 'Last Name',
							key: 'lastName',
						}),
						new HeaderDataCell({
							table,
							label: 'Age',
							key: 'age',
						}),
						new HeaderDataCell({
							table,
							label: 'Status',
							key: 'status',
						}),
						new HeaderDataCell({
							table,
							label: 'Profile Progress',
							key: 'progress',
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

			const actual = getHeaderRows(table, columns);

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

			const actual = getHeaderRows(table, columns);

			actual[0].cells.forEach((cell) => {
				expect(cell).toBeInstanceOf(HeaderGroupCell);
			});
			actual[1].cells.forEach((cell) => {
				expect(cell).toBeInstanceOf(HeaderDataCell);
			});
		});
	});
});
