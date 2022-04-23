import { column, createColumns, group } from './columns';
import { HeaderDataCell, HeaderDisplayCell, HeaderGroupCell } from './headerCells';
import { getHeaderRows, HeaderRow } from './headerRows';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

describe('getHeaderRows', () => {
	describe('data shape', () => {
		test('3 columns', () => {
			const columns = createColumns<User>([
				column({
					header: 'First Name',
					accessor: 'firstName',
				}),
				column({
					header: 'Last Name',
					accessor: 'lastName',
				}),
				column({
					header: 'Age',
					accessor: 'age',
				}),
			]);

			const actual = getHeaderRows(columns);

			const expected: Array<HeaderRow<User>> = [
				new HeaderRow({
					cells: [
						new HeaderDataCell({
							label: 'First Name',
							accessorKey: 'firstName',
						}),
						new HeaderDataCell({
							label: 'Last Name',
							accessorKey: 'lastName',
						}),
						new HeaderDataCell({
							label: 'Age',
							accessorKey: 'age',
						}),
					],
				}),
			];

			expect(actual).toStrictEqual(expected);
		});

		test('1 group column over 3 columns', () => {
			const columns = createColumns<User>([
				group({
					header: 'Info',
					columns: [
						column({
							header: 'First Name',
							accessor: 'firstName',
						}),
						column({
							header: 'Last Name',
							accessor: 'lastName',
						}),
						column({
							header: 'Age',
							accessor: 'age',
						}),
					],
				}),
			]);

			const actual = getHeaderRows(columns);

			const expected: HeaderRow<User>[] = [
				new HeaderRow({
					cells: [
						new HeaderGroupCell({
							colspan: 3,
							label: 'Info',
						}),
					],
				}),
				new HeaderRow({
					cells: [
						new HeaderDataCell({
							label: 'First Name',
							accessorKey: 'firstName',
						}),
						new HeaderDataCell({
							label: 'Last Name',
							accessorKey: 'lastName',
						}),
						new HeaderDataCell({
							label: 'Age',
							accessorKey: 'age',
						}),
					],
				}),
			];

			expect(actual).toStrictEqual(expected);
		});

		test('1 group column over 2 columns, 1 group column over 3 columns', () => {
			const columns = createColumns<User>([
				group({
					header: 'Name',
					columns: [
						column({
							header: 'First Name',
							accessor: 'firstName',
						}),
						column({
							header: 'Last Name',
							accessor: 'lastName',
						}),
					],
				}),
				group({
					header: 'Info',
					columns: [
						column({
							header: 'Age',
							accessor: 'age',
						}),
						column({
							header: 'Status',
							accessor: 'status',
						}),
						column({
							header: 'Profile Progress',
							accessor: 'progress',
						}),
					],
				}),
			]);

			const actual = getHeaderRows(columns);

			const expected: HeaderRow<User>[] = [
				new HeaderRow({
					cells: [
						new HeaderGroupCell({
							colspan: 2,
							label: 'Name',
						}),
						new HeaderGroupCell({
							colspan: 3,
							label: 'Info',
						}),
					],
				}),
				new HeaderRow({
					cells: [
						new HeaderDataCell({
							label: 'First Name',
							accessorKey: 'firstName',
						}),
						new HeaderDataCell({
							label: 'Last Name',
							accessorKey: 'lastName',
						}),
						new HeaderDataCell({
							label: 'Age',
							accessorKey: 'age',
						}),
						new HeaderDataCell({
							label: 'Status',
							accessorKey: 'status',
						}),
						new HeaderDataCell({
							label: 'Profile Progress',
							accessorKey: 'progress',
						}),
					],
				}),
			];

			expect(actual).toStrictEqual(expected);
		});

		test('uneven columns, 1 group column over 2 columns, 3 columns', () => {
			const columns = createColumns<User>([
				group({
					header: 'Name',
					columns: [
						column({
							header: 'First Name',
							accessor: 'firstName',
						}),
						column({
							header: 'Last Name',
							accessor: 'lastName',
						}),
					],
				}),
				column({
					header: 'Age',
					accessor: 'age',
				}),
				column({
					header: 'Status',
					accessor: 'status',
				}),
				column({
					header: 'Profile Progress',
					accessor: 'progress',
				}),
			]);

			const actual = getHeaderRows(columns);

			const expected: HeaderRow<User>[] = [
				new HeaderRow({
					cells: [
						new HeaderGroupCell({
							colspan: 2,
							label: 'Name',
						}),
						new HeaderDisplayCell(),
						new HeaderDisplayCell(),
						new HeaderDisplayCell(),
					],
				}),
				new HeaderRow({
					cells: [
						new HeaderDataCell({
							label: 'First Name',
							accessorKey: 'firstName',
						}),
						new HeaderDataCell({
							label: 'Last Name',
							accessorKey: 'lastName',
						}),
						new HeaderDataCell({
							label: 'Age',
							accessorKey: 'age',
						}),
						new HeaderDataCell({
							label: 'Status',
							accessorKey: 'status',
						}),
						new HeaderDataCell({
							label: 'Profile Progress',
							accessorKey: 'progress',
						}),
					],
				}),
			];

			expect(actual).toStrictEqual(expected);
		});
	});
});
