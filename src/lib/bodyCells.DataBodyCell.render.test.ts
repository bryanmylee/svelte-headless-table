import { DataBodyCell } from './bodyCells';
import { BodyRow } from './bodyRows';
import { DataColumn } from './columns';
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

const column = new DataColumn<User>({
	header: '',
	accessor: 'firstName',
});

it('renders static label', () => {
	const actual = new DataBodyCell<User>({
		column,
		row,
		value: 'Adam',
	});

	expect(actual.render()).toBe('Adam');
});

const state = {
	columns: [],
} as unknown as TableState<User>;

it('renders dynamic label with state', () => {
	const actual = new DataBodyCell<User>({
		column,
		row,
		value: 'Adam',
		label: ({ value }, { columns }) =>
			`${String(value).toLowerCase()} with ${columns.length} columns`,
	});

	actual.injectState(state);

	expect(actual.render()).toBe('adam with 0 columns');
});

it('throws if rendering dynamically without state', () => {
	const actual = new DataBodyCell<User>({
		column,
		row,
		value: 'Adam',
		label: ({ value }, { columns }) =>
			`${String(value).toLowerCase()} with ${columns.length} columns`,
	});

	expect(() => {
		actual.render();
	}).toThrowError('Missing `state` reference');
});
