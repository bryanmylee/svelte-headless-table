import { writable } from 'svelte/store';
import { BodyRow, getBodyRows, getColumnedBodyRows } from './bodyRows';
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

const bodyRows = getBodyRows(data, columns);

it('does not affect empty rows', () => {
	const actual = getColumnedBodyRows([], ['firstName', 'visits']);

	const expected: BodyRow<User>[] = [];

	expect(actual).toStrictEqual(expected);
});

it('re-orders columns', () => {
	const actual = getColumnedBodyRows(bodyRows, ['firstName', 'progress', 'lastName']);

	[0, 1].forEach((rowIdx) => {
		expect(actual[rowIdx].cells[0].column.id).toBe('firstName');
		expect(actual[rowIdx].cells[1].column.id).toBe('progress');
		expect(actual[rowIdx].cells[2].column.id).toBe('lastName');
	});
});

it('hides columns', () => {
	const actual = getColumnedBodyRows(bodyRows, ['firstName', 'progress']);

	[0, 1].forEach((rowIdx) => {
		expect(actual[rowIdx].cells.length).toBe(2);
		expect(actual[rowIdx].cells[0].column.id).toBe('firstName');
		expect(actual[rowIdx].cells[1].column.id).toBe('progress');
		expect(actual[rowIdx].cellForId['firstName']).not.toBeUndefined();
		expect(actual[rowIdx].cellForId['lastName']).not.toBeUndefined();
		expect(actual[rowIdx].cellForId['progress']).not.toBeUndefined();
	});
});
