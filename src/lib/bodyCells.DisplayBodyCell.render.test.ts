import { DisplayBodyCell } from './bodyCells';
import { BodyRow } from './bodyRows';
import { DisplayColumn } from './columns';
import type { TableState } from './createViewModel';

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

const row = new BodyRow({
	id: '0',
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
