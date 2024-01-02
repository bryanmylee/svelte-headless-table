import { writable } from 'svelte/store';
import { DataColumn, getFlatColumns } from './columns.js';
import { createTable } from './createTable.js';

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

it('flattens data columns', () => {
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
					header: 'Visits',
					accessor: 'visits',
				}),
				table.column({
					header: 'Profile Progress',
					accessor: 'progress',
				}),
			],
		}),
	]);

	const actual = getFlatColumns(columns);

	const expected: DataColumn<User>[] = [
		table.column({ header: 'First Name', accessor: 'firstName' }),
		table.column({ header: 'Last Name', accessor: 'lastName' }),
		table.column({ header: 'Age', accessor: 'age' }),
		table.column({ header: 'Status', accessor: 'status' }),
		table.column({ header: 'Visits', accessor: 'visits' }),
		table.column({ header: 'Profile Progress', accessor: 'progress' }),
	];

	expect(actual).toStrictEqual(expected);
});
