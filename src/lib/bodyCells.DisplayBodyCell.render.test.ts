import { DisplayBodyCell } from './bodyCells.js';
import { DataBodyRow } from './bodyRows.js';
import { DisplayColumn } from './columns.js';
import type { TableState } from './createViewModel.js';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

const user: User = {
	firstName: 'Adam',
	lastName: 'Smith',
	age: 43,
	visits: 2,
	progress: 50,
	status: 'complicated',
};

const row = new DataBodyRow({
	id: '0',
	dataId: '0',
	original: user,
	cells: [],
	cellForId: {},
});

const column = new DisplayColumn<User>({
	header: '',
	cell: () => '',
	id: 'checked',
});

const state = {} as TableState<User>;

it('renders dynamic label with state', () => {
	const actual = new DisplayBodyCell<User>({
		column,
		row,
		label: ({ row }) => `row ${row.id} checked`,
	});

	actual.injectState(state);

	expect(actual.render()).toBe('row 0 checked');
});

it('throws if rendering dynamically without state', () => {
	const actual = new DisplayBodyCell<User>({
		column,
		row,
		label: ({ row }) => `row ${row.id} checked`,
	});

	expect(() => {
		actual.render();
	}).toThrowError('Missing `state` reference');
});
