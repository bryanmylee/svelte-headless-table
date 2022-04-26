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
			cells: [
				new GroupHeaderCell({
					colspan: 3,
					label: 'Info',
					ids: ['firstName', 'lastName', 'age'],
				}),
			],
		}),
		new HeaderRow({
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
			cells: [
				new GroupHeaderCell({
					colspan: 2,
					label: 'Name',
					ids: ['firstName', 'lastName'],
				}),
				new GroupHeaderCell({
					colspan: 3,
					label: 'Info',
					ids: ['age', 'status', 'progress'],
				}),
			],
		}),
		new HeaderRow({
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
			cells: [
				new GroupHeaderCell({
					colspan: 2,
					label: 'Name',
					ids: ['firstName', 'lastName'],
				}),
				new DisplayHeaderCell(),
				new DisplayHeaderCell(),
				new DisplayHeaderCell(),
			],
		}),
		new HeaderRow({
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
			cells: [
				new GroupHeaderCell({
					colspan: 2,
					label: 'ID',
					ids: ['firstName', 'progress'],
				}),
			],
		}),
		new HeaderRow({
			cells: [
				new GroupHeaderCell({
					colspan: 1,
					label: 'Name',
					ids: ['firstName'],
				}),
				new DisplayHeaderCell(),
			],
		}),
		new HeaderRow({
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
			cells: [
				new GroupHeaderCell({
					colspan: 1,
					label: 'ID',
					ids: ['firstName'],
				}),
				new DisplayHeaderCell(),
			],
		}),
		new HeaderRow({
			cells: [
				new GroupHeaderCell({
					colspan: 1,
					label: 'Name',
					ids: ['firstName'],
				}),
				new GroupHeaderCell({
					colspan: 1,
					label: 'Info',
					ids: ['progress'],
				}),
			],
		}),
		new HeaderRow({
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
