import { DataColumn } from './columns';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

it('prioritizes a provided id', () => {
	const actual = new DataColumn<User>({
		header: 'First Name',
		accessor: 'firstName',
		id: 'name',
	});

	expect(actual.id).toBe('name');
});

it('falls back on the string accessor as id', () => {
	const actual = new DataColumn<User>({
		header: 'First Name',
		accessor: 'firstName',
	});

	expect(actual.id).toBe('firstName');
});

it('throws if id is undefined without string accessor', () => {
	expect(() => {
		new DataColumn<User>({
			header: 'First Name',
			accessor: (u) => u.firstName,
		});
	}).toThrowError('A column id or string accessor is required');
});
