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

it('throws if id is undefined without string accessor or header', () => {
	expect(() => {
		new DataColumn<User>({
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			accessor: (u: any) => u.firstName,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);
	}).toThrowError('A column id, string accessor, or header is required');
});
