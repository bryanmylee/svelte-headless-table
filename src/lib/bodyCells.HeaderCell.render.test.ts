import type { TableState } from './createViewModel';
import { HeaderCell } from './headerCells';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

class TestHeaderCell<Item> extends HeaderCell<Item> {}

it('renders string label', () => {
	const actual = new TestHeaderCell({
		id: '0',
		label: 'Name',
		colspan: 1,
		isData: true,
		isFlat: true,
	});

	expect(actual.render()).toBe('Name');
});

const state = {
	columns: [],
} as unknown as TableState<User>;

it('renders dynamic label with state', () => {
	const actual = new TestHeaderCell({
		id: '0',
		label: ({ columns }) => `${columns.length} columns`,
		colspan: 1,
		isData: true,
		isFlat: true,
	});

	actual.injectState(state);

	expect(actual.render()).toBe('0 columns');
});

it('throws if rendering dynamically without state', () => {
	const actual = new TestHeaderCell({
		id: '0',
		label: ({ columns }) => `${columns.length} columns`,
		colspan: 1,
		isData: true,
		isFlat: true,
	});

	expect(() => {
		actual.render();
	}).toThrowError('Missing `state` reference');
});
