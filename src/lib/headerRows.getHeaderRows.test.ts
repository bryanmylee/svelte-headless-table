import { column, createColumns, group } from './columns';
import { DataHeaderCell, DisplayHeaderCell, GroupHeaderCell } from './headerCells';
import { getHeaderRows, HeaderRow } from './headerRows';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

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
			id: '0',
			cells: [
				new DataHeaderCell({
					label: 'First Name',
					accessorKey: 'firstName',
					id: 'firstName',
				}),
				new DataHeaderCell({
					label: 'Last Name',
					accessorKey: 'lastName',
					id: 'lastName',
				}),
				new DataHeaderCell({
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
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 3,
					label: 'Info',
					allIds: ['firstName', 'lastName', 'age'],
				}),
			],
		}),
		new HeaderRow({
			id: '1',
			cells: [
				new DataHeaderCell({
					label: 'First Name',
					accessorKey: 'firstName',
					id: 'firstName',
				}),
				new DataHeaderCell({
					label: 'Last Name',
					accessorKey: 'lastName',
					id: 'lastName',
				}),
				new DataHeaderCell({
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
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 2,
					label: 'Name',
					allIds: ['firstName', 'lastName'],
				}),
				new GroupHeaderCell({
					colspan: 3,
					label: 'Info',
					allIds: ['age', 'status', 'progress'],
				}),
			],
		}),
		new HeaderRow({
			id: '1',
			cells: [
				new DataHeaderCell({
					label: 'First Name',
					accessorKey: 'firstName',
					id: 'firstName',
				}),
				new DataHeaderCell({
					label: 'Last Name',
					accessorKey: 'lastName',
					id: 'lastName',
				}),
				new DataHeaderCell({
					label: 'Age',
					accessorKey: 'age',
					id: 'age',
				}),
				new DataHeaderCell({
					label: 'Status',
					accessorKey: 'status',
					id: 'status',
				}),
				new DataHeaderCell({
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
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 2,
					label: 'Name',
					allIds: ['firstName', 'lastName'],
				}),
				new DisplayHeaderCell({ id: '2' }),
				new DisplayHeaderCell({ id: '3' }),
				new DisplayHeaderCell({ id: '4' }),
			],
		}),
		new HeaderRow({
			id: '1',
			cells: [
				new DataHeaderCell({
					label: 'First Name',
					accessorKey: 'firstName',
					id: 'firstName',
				}),
				new DataHeaderCell({
					label: 'Last Name',
					accessorKey: 'lastName',
					id: 'lastName',
				}),
				new DataHeaderCell({
					label: 'Age',
					accessorKey: 'age',
					id: 'age',
				}),
				new DataHeaderCell({
					label: 'Status',
					accessorKey: 'status',
					id: 'status',
				}),
				new DataHeaderCell({
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
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 2,
					label: 'ID',
					allIds: ['firstName', 'progress'],
				}),
			],
		}),
		new HeaderRow({
			id: '1',
			cells: [
				new GroupHeaderCell({
					colspan: 1,
					label: 'Name',
					allIds: ['firstName'],
				}),
				new DisplayHeaderCell({ id: '1' }),
			],
		}),
		new HeaderRow({
			id: '2',
			cells: [
				new DataHeaderCell({
					label: 'First Name',
					accessorKey: 'firstName',
					id: 'firstName',
				}),
				new DataHeaderCell({
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
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 1,
					label: 'ID',
					allIds: ['firstName'],
				}),
				new DisplayHeaderCell({ id: '1' }),
			],
		}),
		new HeaderRow({
			id: '1',
			cells: [
				new GroupHeaderCell({
					colspan: 1,
					label: 'Name',
					allIds: ['firstName'],
				}),
				new GroupHeaderCell({
					colspan: 1,
					label: 'Info',
					allIds: ['progress'],
				}),
			],
		}),
		new HeaderRow({
			id: '2',
			cells: [
				new DataHeaderCell({
					label: 'First Name',
					accessorKey: 'firstName',
					id: 'firstName',
				}),
				new DataHeaderCell({
					label: 'Profile Progress',
					accessorKey: 'progress',
					id: 'progress',
				}),
			],
		}),
	];

	expect(actual).toStrictEqual(expected);
});
