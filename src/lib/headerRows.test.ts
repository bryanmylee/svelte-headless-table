import { column, createColumns, group } from './columns';
import { HeaderCell, HeaderDataCell, HeaderDisplayCell, HeaderGroupCell } from './headerCells';
import { getHeaderRows, getMergedCells, getOrderedCellMatrix, HeaderRow } from './headerRows';
import type { Matrix } from './types/Matrix';

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
						id: 'firstName',
					}),
					new HeaderDataCell({
						label: 'Last Name',
						accessorKey: 'lastName',
						id: 'lastName',
					}),
					new HeaderDataCell({
						label: 'Age',
						accessorKey: 'age',
						id: 'age',
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
						ids: ['firstName', 'lastName', 'age'],
					}),
				],
			}),
			new HeaderRow({
				cells: [
					new HeaderDataCell({
						label: 'First Name',
						accessorKey: 'firstName',
						id: 'firstName',
					}),
					new HeaderDataCell({
						label: 'Last Name',
						accessorKey: 'lastName',
						id: 'lastName',
					}),
					new HeaderDataCell({
						label: 'Age',
						accessorKey: 'age',
						id: 'age',
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
						ids: ['firstName', 'lastName'],
					}),
					new HeaderGroupCell({
						colspan: 3,
						label: 'Info',
						ids: ['age', 'status', 'progress'],
					}),
				],
			}),
			new HeaderRow({
				cells: [
					new HeaderDataCell({
						label: 'First Name',
						accessorKey: 'firstName',
						id: 'firstName',
					}),
					new HeaderDataCell({
						label: 'Last Name',
						accessorKey: 'lastName',
						id: 'lastName',
					}),
					new HeaderDataCell({
						label: 'Age',
						accessorKey: 'age',
						id: 'age',
					}),
					new HeaderDataCell({
						label: 'Status',
						accessorKey: 'status',
						id: 'status',
					}),
					new HeaderDataCell({
						label: 'Profile Progress',
						accessorKey: 'progress',
						id: 'progress',
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
						ids: ['firstName', 'lastName'],
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
						id: 'firstName',
					}),
					new HeaderDataCell({
						label: 'Last Name',
						accessorKey: 'lastName',
						id: 'lastName',
					}),
					new HeaderDataCell({
						label: 'Age',
						accessorKey: 'age',
						id: 'age',
					}),
					new HeaderDataCell({
						label: 'Status',
						accessorKey: 'status',
						id: 'status',
					}),
					new HeaderDataCell({
						label: 'Profile Progress',
						accessorKey: 'progress',
						id: 'progress',
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
						ids: ['firstName', 'progress'],
					}),
				],
			}),
			new HeaderRow({
				cells: [
					new HeaderGroupCell({
						colspan: 1,
						label: 'Name',
						ids: ['firstName'],
					}),
					new HeaderDisplayCell(),
				],
			}),
			new HeaderRow({
				cells: [
					new HeaderDataCell({
						label: 'First Name',
						accessorKey: 'firstName',
						id: 'firstName',
					}),
					new HeaderDataCell({
						label: 'Profile Progress',
						accessorKey: 'progress',
						id: 'progress',
					}),
				],
			}),
		];

		expect(actual).toStrictEqual(expected);
	});

	test('group on lowest row\n[]\n[][]\n[][]', () => {
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
				],
			}),
			group({
				header: 'Info',
				columns: [
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
						colspan: 1,
						label: 'ID',
						ids: ['firstName'],
					}),
					new HeaderDisplayCell(),
				],
			}),
			new HeaderRow({
				cells: [
					new HeaderGroupCell({
						colspan: 1,
						label: 'Name',
						ids: ['firstName'],
					}),
					new HeaderGroupCell({
						colspan: 1,
						label: 'Info',
						ids: ['progress'],
					}),
				],
			}),
			new HeaderRow({
				cells: [
					new HeaderDataCell({
						label: 'First Name',
						accessorKey: 'firstName',
						id: 'firstName',
					}),
					new HeaderDataCell({
						label: 'Profile Progress',
						accessorKey: 'progress',
						id: 'progress',
					}),
				],
			}),
		];

		expect(actual).toStrictEqual(expected);
	});
});

describe('getOrderedCellMatrix', () => {
	it('orders the matrix columns', () => {
		const matrix: Matrix<HeaderCell<User>> = [
			[
				new HeaderGroupCell({ label: 'Name', colspan: 1, ids: ['firstName', 'lastName'] }),
				new HeaderGroupCell({ label: 'Name', colspan: 1, ids: ['firstName', 'lastName'] }),
				new HeaderGroupCell({ label: 'Info', colspan: 1, ids: ['age', 'progress'] }),
				new HeaderGroupCell({ label: 'Info', colspan: 1, ids: ['age', 'progress'] }),
			],
			[
				new HeaderDataCell({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
				new HeaderDataCell({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
				new HeaderDataCell({ label: 'Age', accessorKey: 'age', id: 'age' }),
				new HeaderDataCell({ label: 'Progress', accessorKey: 'progress', id: 'progress' }),
			],
		];

		const actual = getOrderedCellMatrix(matrix, ['firstName', 'age', 'lastName', 'progress']);

		const expected: Matrix<HeaderCell<User>> = [
			[
				new HeaderGroupCell({ label: 'Name', colspan: 1, ids: ['firstName', 'lastName'] }),
				new HeaderGroupCell({ label: 'Info', colspan: 1, ids: ['age', 'progress'] }),
				new HeaderGroupCell({ label: 'Name', colspan: 1, ids: ['firstName', 'lastName'] }),
				new HeaderGroupCell({ label: 'Info', colspan: 1, ids: ['age', 'progress'] }),
			],
			[
				new HeaderDataCell({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
				new HeaderDataCell({ label: 'Age', accessorKey: 'age', id: 'age' }),
				new HeaderDataCell({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
				new HeaderDataCell({ label: 'Progress', accessorKey: 'progress', id: 'progress' }),
			],
		];

		expect(actual).toStrictEqual(expected);
	});
});

describe('getMergedCells', () => {
	it('does not merge different cells', () => {
		const cells = [
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
			new HeaderDataCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
			new HeaderGroupCell<User>({ label: 'Info', colspan: 1, ids: ['age', 'status'] }),
		];

		const actual = getMergedCells(cells);

		const expected = [
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
			new HeaderDataCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
			new HeaderGroupCell<User>({ label: 'Info', colspan: 1, ids: ['age', 'status'] }),
		];

		expect(actual).toStrictEqual(expected);
	});

	it('does not merge different instances of a cell', () => {
		const cells = [
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
			new HeaderGroupCell<User>({ label: 'Info', colspan: 1, ids: ['age', 'status'] }),
		];

		const actual = getMergedCells(cells);

		const expected = [
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
			new HeaderGroupCell<User>({ label: 'Info', colspan: 1, ids: ['age', 'status'] }),
		];

		expect(actual).toStrictEqual(expected);
	});

	it('merges the same instance of a cell in front', () => {
		const infoGroup = new HeaderGroupCell<User>({
			label: 'Info',
			colspan: 1,
			ids: ['age', 'status'],
		});
		const cells = [
			infoGroup,
			infoGroup,
			infoGroup,
			infoGroup,
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
			new HeaderDataCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
		];

		const actual = getMergedCells(cells);

		const expected = [
			new HeaderGroupCell<User>({ label: 'Info', colspan: 4, ids: ['age', 'status'] }),
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
			new HeaderDataCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
		];

		expect(actual).toStrictEqual(expected);
	});

	it('merges the same instance of a cell behind', () => {
		const infoGroup = new HeaderGroupCell<User>({
			label: 'Info',
			colspan: 1,
			ids: ['age', 'status'],
		});
		const cells = [
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
			new HeaderDataCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
			infoGroup,
			infoGroup,
			infoGroup,
			infoGroup,
		];

		const actual = getMergedCells(cells);

		const expected = [
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
			new HeaderDataCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
			new HeaderGroupCell<User>({ label: 'Info', colspan: 4, ids: ['age', 'status'] }),
		];

		expect(actual).toStrictEqual(expected);
	});

	it('does not merge non-adjacent same instances of a cell', () => {
		const infoGroup = new HeaderGroupCell<User>({
			label: 'Info',
			colspan: 1,
			ids: ['age', 'status'],
		});
		const cells = [
			infoGroup,
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
			new HeaderDataCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
			infoGroup,
			infoGroup,
			infoGroup,
		];

		const actual = getMergedCells(cells);

		const expected = [
			new HeaderGroupCell<User>({
				label: 'Info',
				colspan: 1,
				ids: ['age', 'status'],
			}),
			new HeaderDataCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
			new HeaderDataCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
			new HeaderGroupCell<User>({
				label: 'Info',
				colspan: 3,
				ids: ['age', 'status'],
			}),
		];

		expect(actual).toStrictEqual(expected);
	});

	it('merges two sets of the same instance of a cell', () => {
		const nameGroup = new HeaderGroupCell<User>({
			label: 'Name',
			colspan: 1,
			ids: ['firstName', 'lastName'],
		});
		const infoGroup = new HeaderGroupCell<User>({
			label: 'Info',
			colspan: 1,
			ids: ['age', 'status'],
		});
		const cells = [nameGroup, nameGroup, infoGroup, infoGroup, infoGroup, infoGroup];

		const actual = getMergedCells(cells);

		const expected = [
			new HeaderGroupCell<User>({
				label: 'Name',
				colspan: 2,
				ids: ['firstName', 'lastName'],
			}),
			new HeaderGroupCell<User>({
				label: 'Info',
				colspan: 4,
				ids: ['age', 'status'],
			}),
		];

		expect(actual).toStrictEqual(expected);
	});
});
