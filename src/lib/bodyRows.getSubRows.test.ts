import { writable } from 'svelte/store';
import { DataBodyCell } from './bodyCells';
import { BodyRow, getBodyRows, getColumnedBodyRows, getSubRows } from './bodyRows';
import { createTable } from './createTable';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

const parentData: User = {
	firstName: 'Charlie',
	lastName: 'Brown',
	age: 30,
	progress: 75,
	status: 'completed',
	visits: 32,
};

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

const parentRow = getBodyRows([parentData], columns)[0];

it('transforms empty data', () => {
	const actual = getSubRows(data, parentRow);

	const expected: BodyRow<User>[] = [];

	expect(actual).toStrictEqual(expected);
});

it('derives the correct cells', () => {
	const actual = getSubRows(data, parentRow);

	const expected = getBodyRows(data, columns);

	[0, 1].forEach((rowIdx) => {
		expect(actual[rowIdx].original).toStrictEqual(expected[rowIdx].original);
		expect(actual[rowIdx].cells.length).toStrictEqual(expected[rowIdx].cells.length);
		actual[rowIdx].cells.forEach((_, colIdx) => {
			expect(actual[rowIdx].cells[colIdx].value).toStrictEqual(
				expected[rowIdx].cells[colIdx].value
			);
		});
	});
});

it('derives the correct cellForId when parent has hidden cells', () => {
	const columnedParentRow = getColumnedBodyRows([parentRow], ['firstName'])[0];
	const actual = getSubRows(data, columnedParentRow);

	const expected = getColumnedBodyRows(getBodyRows(data, columns), ['firstName']);

	[0, 1].forEach((rowIdx) => {
		expect(actual[rowIdx].original).toStrictEqual(expected[rowIdx].original);
		expect(actual[rowIdx].cells.length).toStrictEqual(expected[rowIdx].cells.length);
		actual[rowIdx].cells.forEach((_, colIdx) => {
			expect(actual[rowIdx].cells[colIdx].value).toStrictEqual(
				expected[rowIdx].cells[colIdx].value
			);
		});
		['firstName', 'lastName', 'progress'].forEach((id) => {
			expect(actual[rowIdx].cellForId[id].value).toStrictEqual(
				expected[rowIdx].cellForId[id].value
			);
		});
	});
});
