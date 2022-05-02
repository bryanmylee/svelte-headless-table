import { writable } from 'svelte/store';
import { createTable } from './createTable';
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

const data = writable<User[]>([]);

const table = createTable(data);

test('flat columns\n[][][]', () => {
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

	const expected: Array<HeaderRow<User>> = [
		new HeaderRow({
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 3,
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

	const expected: Array<HeaderRow<User>> = [
		new HeaderRow({
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 2,
					label: 'Name',
					allIds: ['firstName', 'lastName'],
					ids: ['firstName', 'lastName'],
				}),
				new GroupHeaderCell({
					colspan: 3,
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

	const expected: Array<HeaderRow<User>> = [
		new HeaderRow({
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 2,
					label: 'Name',
					allIds: ['firstName', 'lastName'],
					ids: ['firstName', 'lastName'],
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

	const expected: Array<HeaderRow<User>> = [
		new HeaderRow({
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 2,
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
					label: 'Name',
					allIds: ['firstName'],
					ids: ['firstName'],
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

	const expected: Array<HeaderRow<User>> = [
		new HeaderRow({
			id: '0',
			cells: [
				new GroupHeaderCell({
					colspan: 1,
					label: 'ID',
					allIds: ['firstName'],
					ids: ['firstName'],
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
					ids: ['firstName'],
				}),
				new GroupHeaderCell({
					colspan: 1,
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
