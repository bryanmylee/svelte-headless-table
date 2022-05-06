import { DataHeaderCell, GroupHeaderCell } from './headerCells';
import { getMergedRow } from './headerRows';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

it('merges two sets of group cells', () => {
	const cells = [
		new GroupHeaderCell<User>({
			label: 'Name',
			colspan: 1,
			allIds: ['firstName', 'lastName'],
			ids: ['firstName'],
		}),
		new GroupHeaderCell<User>({
			label: 'Name',
			colspan: 1,
			allIds: ['firstName', 'lastName'],
			ids: ['lastName'],
		}),
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 1,
			allIds: ['age', 'status'],
			ids: ['age'],
		}),
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 1,
			allIds: ['age', 'status'],
			ids: ['status'],
		}),
	];

	const actual = getMergedRow(cells);

	const expected = [
		new GroupHeaderCell<User>({
			label: 'Name',
			colspan: 2,
			allIds: ['firstName', 'lastName'],
			ids: ['firstName', 'lastName'],
		}),
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 2,
			allIds: ['age', 'status'],
			ids: ['age', 'status'],
		}),
	];

	expect(actual).toStrictEqual(expected);
});

it('merges adjacent group cells in front', () => {
	const cells = [
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 1,
			allIds: ['age', 'status'],
			ids: ['age'],
		}),
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 1,
			allIds: ['age', 'status'],
			ids: ['status'],
		}),
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
	];

	const actual = getMergedRow(cells);

	const expected = [
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 2,
			allIds: ['age', 'status'],
			ids: ['age', 'status'],
		}),
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
	];

	expect(actual).toStrictEqual(expected);
});

it('merges adjacent group cells behind', () => {
	const cells = [
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 1,
			allIds: ['age', 'status'],
			ids: ['age'],
		}),
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 1,
			allIds: ['age', 'status'],
			ids: ['status'],
		}),
	];

	const actual = getMergedRow(cells);

	const expected = [
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 2,
			allIds: ['age', 'status'],
			ids: ['age', 'status'],
		}),
	];

	expect(actual).toStrictEqual(expected);
});

it('does not merge disjoint group cells', () => {
	const cells = [
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 1,
			allIds: ['age', 'status'],
			ids: ['age'],
		}),
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 1,
			allIds: ['age', 'status'],
			ids: ['status'],
		}),
	];

	const actual = getMergedRow(cells);

	const expected = [
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 1,
			allIds: ['age', 'status'],
			ids: ['age'],
		}),
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 1,
			allIds: ['age', 'status'],
			ids: ['status'],
		}),
	];

	expect(actual).toStrictEqual(expected);
});
