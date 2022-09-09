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

class TestHeaderCell<Item> extends HeaderCell<Item> {
	clone(): TestHeaderCell<Item> {
		return new TestHeaderCell({
			id: this.id,
			colspan: this.colspan,
			label: this.label,
			colstart: 1,
		});
	}
}

it('renders string label', () => {
	const actual = new TestHeaderCell({
		id: '0',
		label: 'Name',
		colspan: 1,
		colstart: 1,
	});

	expect(actual.render()).toBe('Name');
});

const state = {
	columns: [],
} as unknown as TableState<User>;

it('renders dynamic label with state', () => {
	const actual = new TestHeaderCell({
		id: '0',
		label: (_, { columns }) => `${columns.length} columns`,
		colspan: 1,
		colstart: 1,
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	actual.injectState(state as any);

	expect(actual.render()).toBe('0 columns');
});

it('throws if rendering dynamically without state', () => {
	const actual = new TestHeaderCell({
		id: '0',
		label: (_, { columns }) => `${columns.length} columns`,
		colspan: 1,
		colstart: 1,
	});

	expect(() => {
		actual.render();
	}).toThrowError('Missing `state` reference');
});
