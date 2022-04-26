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

it('does not merge different cells', () => {
	const cells = [
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
		new GroupHeaderCell<User>({ label: 'Info', colspan: 1, ids: ['age', 'status'] }),
	];

	const actual = getMergedRow(cells);

	const expected = [
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
		new GroupHeaderCell<User>({ label: 'Info', colspan: 1, ids: ['age', 'status'] }),
	];

	expect(actual).toStrictEqual(expected);
});

it('does not merge different instances of a cell', () => {
	const cells = [
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new GroupHeaderCell<User>({ label: 'Info', colspan: 1, ids: ['age', 'status'] }),
	];

	const actual = getMergedRow(cells);

	const expected = [
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new GroupHeaderCell<User>({ label: 'Info', colspan: 1, ids: ['age', 'status'] }),
	];

	expect(actual).toStrictEqual(expected);
});

it('merges the same instance of a cell in front', () => {
	const infoGroup = new GroupHeaderCell<User>({
		label: 'Info',
		colspan: 1,
		ids: ['age', 'status'],
	});
	const cells = [
		infoGroup,
		infoGroup,
		infoGroup,
		infoGroup,
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
	];

	const actual = getMergedRow(cells);

	const expected = [
		new GroupHeaderCell<User>({ label: 'Info', colspan: 4, ids: ['age', 'status'] }),
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
	];

	expect(actual).toStrictEqual(expected);
});

it('merges the same instance of a cell behind', () => {
	const infoGroup = new GroupHeaderCell<User>({
		label: 'Info',
		colspan: 1,
		ids: ['age', 'status'],
	});
	const cells = [
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
		infoGroup,
		infoGroup,
		infoGroup,
		infoGroup,
	];

	const actual = getMergedRow(cells);

	const expected = [
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
		new GroupHeaderCell<User>({ label: 'Info', colspan: 4, ids: ['age', 'status'] }),
	];

	expect(actual).toStrictEqual(expected);
});

it('does not merge non-adjacent same instances of a cell', () => {
	const infoGroup = new GroupHeaderCell<User>({
		label: 'Info',
		colspan: 1,
		ids: ['age', 'status'],
	});
	const cells = [
		infoGroup,
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
		infoGroup,
		infoGroup,
		infoGroup,
	];

	const actual = getMergedRow(cells);

	const expected = [
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 1,
			ids: ['age', 'status'],
		}),
		new DataHeaderCell<User>({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		new DataHeaderCell<User>({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 3,
			ids: ['age', 'status'],
		}),
	];

	expect(actual).toStrictEqual(expected);
});

it('merges two sets of the same instance of a cell', () => {
	const nameGroup = new GroupHeaderCell<User>({
		label: 'Name',
		colspan: 1,
		ids: ['firstName', 'lastName'],
	});
	const infoGroup = new GroupHeaderCell<User>({
		label: 'Info',
		colspan: 1,
		ids: ['age', 'status'],
	});
	const cells = [nameGroup, nameGroup, infoGroup, infoGroup, infoGroup, infoGroup];

	const actual = getMergedRow(cells);

	const expected = [
		new GroupHeaderCell<User>({
			label: 'Name',
			colspan: 2,
			ids: ['firstName', 'lastName'],
		}),
		new GroupHeaderCell<User>({
			label: 'Info',
			colspan: 4,
			ids: ['age', 'status'],
		}),
	];

	expect(actual).toStrictEqual(expected);
});
