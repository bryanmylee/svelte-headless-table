import { column, createColumns, group } from './columns';
import { HeaderDataCell, HeaderDisplayCell, HeaderGroupCell } from './headerCells';
import { getHeaderRows, getMergedCells, HeaderRow } from './headerRows';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

describe('getHeaderRows', () => {
	test('flat columns\n[][][]', () => {
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

	test('one group\n[    ]\n[][][]', () => {
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

		const expected: Array<HeaderRow<User>> = [
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

	test('two groups\n[  ][    ]\n[][][][][]', () => {
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

		const expected: Array<HeaderRow<User>> = [
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

	test('one group and extra\n[  ]      \n[][][][][]', () => {
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

		const expected: Array<HeaderRow<User>> = [
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

	test('data cell on last row\n[  ]\n[]  \n[][]', () => {
		const columns = createColumns<User>([
			group({
				header: 'ID',
				columns: [
					group({
						header: 'Name',
						columns: [
							column({
								header: 'First Name',
								accessor: 'firstName',
							}),
						],
					}),
					column({
						header: 'Profile Progress',
						accessor: 'progress',
					}),
				],
			}),
		]);

		const actual = getHeaderRows(columns);

		const expected: Array<HeaderRow<User>> = [
			new HeaderRow({
				cells: [
					new HeaderGroupCell({
						colspan: 2,
						label: 'ID',
					}),
				],
			}),
			new HeaderRow({
				cells: [
					new HeaderGroupCell({
						colspan: 1,
						label: 'Name',
					}),
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
						label: 'Profile Progress',
						accessorKey: 'progress',
					}),
				],
			}),
		];

		expect(actual).toStrictEqual(expected);
	});
});

describe('getMergedCells', () => {
	it('does not merge different cells', () => {
		const cells = [
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName' }),
			new HeaderDataCell<User>({ label: 'Last Name', accessorKey: 'lastName' }),
			new HeaderGroupCell<User>({ label: 'Info', colspan: 4 }),
		];

		const actual = getMergedCells(cells);

		const expected = [
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName' }),
			new HeaderDataCell<User>({ label: 'Last Name', accessorKey: 'lastName' }),
			new HeaderGroupCell<User>({ label: 'Info', colspan: 4 }),
		];

		expect(actual).toStrictEqual(expected);
	});

	it('does not merge different instances of the same cell', () => {
		const cells = [
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName' }),
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName' }),
			new HeaderGroupCell<User>({ label: 'Info', colspan: 4 }),
		];

		const actual = getMergedCells(cells);

		const expected = [
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName' }),
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName' }),
			new HeaderGroupCell<User>({ label: 'Info', colspan: 4 }),
		];

		expect(actual).toStrictEqual(expected);
	});

	it('merges the same instance of a cell in front', () => {
		const infoGroup = new HeaderGroupCell<User>({ label: 'Info', colspan: 4 });
		const cells = [
			infoGroup,
			infoGroup,
			infoGroup,
			infoGroup,
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName' }),
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName' }),
		];

		const actual = getMergedCells(cells);

		const expected = [
			infoGroup,
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName' }),
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName' }),
		];

		expect(actual).toStrictEqual(expected);
	});

	it('merges the same instance of a cell behind', () => {
		const infoGroup = new HeaderGroupCell<User>({ label: 'Info', colspan: 4 });
		const cells = [
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName' }),
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName' }),
			infoGroup,
			infoGroup,
			infoGroup,
			infoGroup,
		];

		const actual = getMergedCells(cells);

		const expected = [
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName' }),
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName' }),
			infoGroup,
		];

		expect(actual).toStrictEqual(expected);
	});

	it('merges two sets of the same instance of a cell', () => {
		const nameGroup = new HeaderGroupCell<User>({ label: 'Name', colspan: 2 });
		const infoGroup = new HeaderGroupCell<User>({ label: 'Info', colspan: 4 });
		const cells = [nameGroup, nameGroup, infoGroup, infoGroup, infoGroup, infoGroup];

		const actual = getMergedCells(cells);

		const expected = [nameGroup, infoGroup];

		expect(actual).toStrictEqual(expected);
	});
});
