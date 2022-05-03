import { writable } from 'svelte/store';
import { BodyCell } from './bodyCells';
import { BodyRow, getBodyRows } from './bodyRows';
import { createTable } from './createTable';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

const data: User[] = [
	{
		firstName: 'Adam',
		lastName: 'West',
		age: 50,
		progress: 75,
		status: 'completed',
		visits: 32,
	},
	{
		firstName: 'Becky',
		lastName: 'White',
		age: 93,
		progress: 43,
		status: 'completed',
		visits: 10,
	},
];

const table = createTable(writable(data));

const columns = [
	table.column({
		accessor: 'firstName',
		header: 'First Name',
	}),
	table.column({
		accessor: 'lastName',
		header: 'Last Name',
	}),
	table.column({
		accessor: 'progress',
		header: 'Profile Progress',
	}),
];

it('transforms empty data', () => {
	const actual = getBodyRows([], columns);

	const expected: Array<BodyRow<User>> = [];

	expect(actual).toStrictEqual(expected);
});

it('transforms data', () => {
	const actual = getBodyRows(data, columns);

	const row0 = new BodyRow<User>({ id: '0', item: data[0], cells: [], cellForId: {} });
	const cells0 = [
		new BodyCell<User>({
			row: row0,
			column: columns[0],
			value: 'Adam',
		}),
		new BodyCell<User>({
			row: row0,
			column: columns[1],
			value: 'West',
		}),
		new BodyCell<User>({
			row: row0,
			column: columns[2],
			value: 75,
		}),
	];
	row0.cells = cells0;
	const cellForId0 = {
		firstName: cells0[0],
		lastName: cells0[1],
		progress: cells0[2],
	};
	row0.cellForId = cellForId0;

	const row1 = new BodyRow<User>({ id: '1', item: data[1], cells: [], cellForId: {} });
	const cells1 = [
		new BodyCell<User>({
			row: row1,
			column: columns[0],
			value: 'Becky',
		}),
		new BodyCell<User>({
			row: row1,
			column: columns[1],
			value: 'White',
		}),
		new BodyCell<User>({
			row: row1,
			column: columns[2],
			value: 43,
		}),
	];
	row1.cells = cells1;
	const cellForId1 = {
		firstName: cells1[0],
		lastName: cells1[1],
		progress: cells1[2],
	};
	row1.cellForId = cellForId1;

	const expected: Array<BodyRow<User>> = [row0, row1];

	[0, 1].forEach((rowIdx) => {
		expect(actual[rowIdx].item).toStrictEqual(expected[rowIdx].item);
		expect(actual[rowIdx].cells.length).toStrictEqual(expected[rowIdx].cells.length);
		actual[rowIdx].cells.forEach((_, colIdx) => {
			expect(actual[rowIdx].cells[colIdx].value).toStrictEqual(
				expected[rowIdx].cells[colIdx].value
			);
		});
	});
});