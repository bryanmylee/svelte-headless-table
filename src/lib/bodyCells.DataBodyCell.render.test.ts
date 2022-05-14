import { DataBodyCell } from './bodyCells';
import { BodyRow } from './bodyRows';
import { DataColumn } from './columns';

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

const column = new DataColumn({
	header: '',
	accessor: 'firstName',
});

it('renders without label', () => {
	const actual = new DataBodyCell<User>({
		column,
		row,
		value: 'Adam',
	});

	expect(actual.render()).toBe('Adam');
});

it('renders with label', () => {
	const actual = new DataBodyCell<User>({
		column,
		row,
		value: 'Adam',
		label: (value) => String(value).toLowerCase(),
	});

	expect(actual.render()).toBe('adam');
});
