import { writable } from 'svelte/store';
import { createTable } from './createTable';
import { DataHeaderCell, GroupDisplayHeaderCell, GroupHeaderCell } from './headerCells';
import { getHeaderRows, HeaderRow } from './headerRows';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

const data = writable<User[]>([]);

const table = createTable(data);

it('arranges flat columns\n[][][]', () => {
	const columns = table.createColumns([
		table.column({
			header: 'First Name',
			accessor: 'firstName',
		}),
		table.column({
			header: 'Last Name',
			accessor: 'lastName',
		}),
		table.column({
			header: 'Age',
			accessor: 'age',
		}),
	]);

	const actual = getHeaderRows(columns);

	const expected: HeaderRow<User>[] = [
		new HeaderRow({
			id: '0',
			cells: [
				new DataHeaderCell({
					label: 'First Name',
					accessorKey: 'firstName',
					id: 'firstName',
					colstart: 0,
				}),
				new DataHeaderCell({
					label: 'Last Name',
					accessorKey: 'lastName',
					id: 'lastName',
					colstart: 1,
				}),
				new DataHeaderCell({
					label: 'Age',
					accessorKey: 'age',
					id: 'age',
					colstart: 2,
				}),
			],
		}),
	];

	expect(actual).toStrictEqual(expected);
});

it('creates a group over flat columns\n[    ]\n[][][]', () => {
	const columns = table.createColumns([
		table.group({
			header: 'Info',
			columns: [
				table.column({
					header: 'First Name',
					accessor: 'firstName',
				}),
				table.column({
					header: 'Last Name',
					accessor: 'lastName',
				}),
				table.column({
					header: 'Age',
					accessor: 'age',
				}),
			],
		}),
	]);

	const actual = getHeaderRows(columns);

	const expected: HeaderRow<User>[] = [
		new HeaderRow({
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 3,
					colstart: 0,
					label: 'Info',
					allIds: ['firstName', 'lastName', 'age'],
					ids: ['firstName', 'lastName', 'age'],
				}),
			],
		}),
		new HeaderRow({
			id: '1',
			cells: [
				new DataHeaderCell({
					colstart: 0,
					label: 'First Name',
					accessorKey: 'firstName',
					id: 'firstName',
				}),
				new DataHeaderCell({
					colstart: 1,
					label: 'Last Name',
					accessorKey: 'lastName',
					id: 'lastName',
				}),
				new DataHeaderCell({
					colstart: 2,
					label: 'Age',
					accessorKey: 'age',
					id: 'age',
				}),
			],
		}),
	];

	expect(actual).toStrictEqual(expected);
});

it('creates two groups over different columns\n[  ][    ]\n[][][][][]', () => {
	const columns = table.createColumns([
		table.group({
			header: 'Name',
			columns: [
				table.column({
					header: 'First Name',
					accessor: 'firstName',
				}),
				table.column({
					header: 'Last Name',
					accessor: 'lastName',
				}),
			],
		}),
		table.group({
			header: 'Info',
			columns: [
				table.column({
					header: 'Age',
					accessor: 'age',
				}),
				table.column({
					header: 'Status',
					accessor: 'status',
				}),
				table.column({
					header: 'Profile Progress',
					accessor: 'progress',
				}),
			],
		}),
	]);

	const actual = getHeaderRows(columns);

	const expected: HeaderRow<User>[] = [
		new HeaderRow({
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 2,
					colstart: 0,
					label: 'Name',
					allIds: ['firstName', 'lastName'],
					ids: ['firstName', 'lastName'],
				}),
				new GroupHeaderCell({
					colspan: 3,
					colstart: 2,
					label: 'Info',
					allIds: ['age', 'status', 'progress'],
					ids: ['age', 'status', 'progress'],
				}),
			],
		}),
		new HeaderRow({
			id: '1',
			cells: [
				new DataHeaderCell({
					colstart: 0,
					label: 'First Name',
					accessorKey: 'firstName',
					id: 'firstName',
				}),
				new DataHeaderCell({
					colstart: 1,
					label: 'Last Name',
					accessorKey: 'lastName',
					id: 'lastName',
				}),
				new DataHeaderCell({
					colstart: 2,
					label: 'Age',
					accessorKey: 'age',
					id: 'age',
				}),
				new DataHeaderCell({
					colstart: 3,
					label: 'Status',
					accessorKey: 'status',
					id: 'status',
				}),
				new DataHeaderCell({
					colstart: 4,
					label: 'Profile Progress',
					accessorKey: 'progress',
					id: 'progress',
				}),
			],
		}),
	];

	expect(actual).toStrictEqual(expected);
});

it('groups a subset of columns and ungrouped columns have flat header cells on the last row\n[  ]      \n[][][][][]', () => {
	const columns = table.createColumns([
		table.group({
			header: 'Name',
			columns: [
				table.column({
					header: 'First Name',
					accessor: 'firstName',
				}),
				table.column({
					header: 'Last Name',
					accessor: 'lastName',
				}),
			],
		}),
		table.column({
			header: 'Age',
			accessor: 'age',
		}),
		table.column({
			header: 'Status',
			accessor: 'status',
		}),
		table.column({
			header: 'Profile Progress',
			accessor: 'progress',
		}),
	]);

	const actual = getHeaderRows(columns);

	const expected: HeaderRow<User>[] = [
		new HeaderRow({
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 2,
					colstart: 0,
					label: 'Name',
					allIds: ['firstName', 'lastName'],
					ids: ['firstName', 'lastName'],
				}),
				new GroupDisplayHeaderCell({ colstart: 2, allIds: ['age'], ids: ['age'] }),
				new GroupDisplayHeaderCell({ colstart: 3, allIds: ['status'], ids: ['status'] }),
				new GroupDisplayHeaderCell({ colstart: 4, allIds: ['progress'], ids: ['progress'] }),
			],
		}),
		new HeaderRow({
			id: '1',
			cells: [
				new DataHeaderCell({
					colstart: 0,
					label: 'First Name',
					accessorKey: 'firstName',
					id: 'firstName',
				}),
				new DataHeaderCell({
					colstart: 1,
					label: 'Last Name',
					accessorKey: 'lastName',
					id: 'lastName',
				}),
				new DataHeaderCell({
					colstart: 2,
					label: 'Age',
					accessorKey: 'age',
					id: 'age',
				}),
				new DataHeaderCell({
					colstart: 3,
					label: 'Status',
					accessorKey: 'status',
					id: 'status',
				}),
				new DataHeaderCell({
					colstart: 4,
					label: 'Profile Progress',
					accessorKey: 'progress',
					id: 'progress',
				}),
			],
		}),
	];

	expect(actual).toStrictEqual(expected);
});

it('puts flat header cells on the last row if there is a gap between the group and flat header cell\n[  ]\n[]  \n[][]', () => {
	const columns = table.createColumns([
		table.group({
			header: 'ID',
			columns: [
				table.group({
					header: 'Name',
					columns: [
						table.column({
							header: 'First Name',
							accessor: 'firstName',
						}),
					],
				}),
				table.column({
					header: 'Profile Progress',
					accessor: 'progress',
				}),
			],
		}),
	]);

	const actual = getHeaderRows(columns);

	const expected: HeaderRow<User>[] = [
		new HeaderRow({
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 2,
					colstart: 0,
					label: 'ID',
					allIds: ['firstName', 'progress'],
					ids: ['firstName', 'progress'],
				}),
			],
		}),
		new HeaderRow({
			id: '1',
			cells: [
				new GroupHeaderCell({
					colspan: 1,
					colstart: 0,
					label: 'Name',
					allIds: ['firstName'],
					ids: ['firstName'],
				}),
				new GroupDisplayHeaderCell({ colstart: 1, ids: ['progress'], allIds: ['progress'] }),
			],
		}),
		new HeaderRow({
			id: '2',
			cells: [
				new DataHeaderCell({
					colstart: 0,
					label: 'First Name',
					accessorKey: 'firstName',
					id: 'firstName',
				}),
				new DataHeaderCell({
					colstart: 1,
					label: 'Profile Progress',
					accessorKey: 'progress',
					id: 'progress',
				}),
			],
		}),
	];

	expect(actual).toStrictEqual(expected);
});

it('puts group cells on the lowest row possible\n[]\n[][]\n[][]', () => {
	const columns = table.createColumns([
		table.group({
			header: 'ID',
			columns: [
				table.group({
					header: 'Name',
					columns: [
						table.column({
							header: 'First Name',
							accessor: 'firstName',
						}),
					],
				}),
			],
		}),
		table.group({
			header: 'Info',
			columns: [
				table.column({
					header: 'Profile Progress',
					accessor: 'progress',
				}),
			],
		}),
	]);

	const actual = getHeaderRows(columns);

	const expected: HeaderRow<User>[] = [
		new HeaderRow({
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 1,
					colstart: 0,
					label: 'ID',
					allIds: ['firstName'],
					ids: ['firstName'],
				}),
				new GroupDisplayHeaderCell({ colstart: 1, allIds: ['progress'], ids: ['progress'] }),
			],
		}),
		new HeaderRow({
			id: '1',
			cells: [
				new GroupHeaderCell({
					colspan: 1,
					colstart: 0,
					label: 'Name',
					allIds: ['firstName'],
					ids: ['firstName'],
				}),
				new GroupHeaderCell({
					colspan: 1,
					colstart: 1,
					label: 'Info',
					allIds: ['progress'],
					ids: ['progress'],
				}),
			],
		}),
		new HeaderRow({
			id: '2',
			cells: [
				new DataHeaderCell({
					colstart: 0,
					label: 'First Name',
					accessorKey: 'firstName',
					id: 'firstName',
				}),
				new DataHeaderCell({
					colstart: 1,
					label: 'Profile Progress',
					accessorKey: 'progress',
					id: 'progress',
				}),
			],
		}),
	];

	expect(actual).toStrictEqual(expected);
});
