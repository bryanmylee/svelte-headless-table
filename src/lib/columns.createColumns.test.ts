import { column, createColumns } from './columns';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

it('passes if no duplicate columns', () => {
	expect(() => {
		createColumns<User>([
			column({
				header: 'First Name',
				accessor: 'firstName',
			}),
			column({
				header: 'Age',
				accessor: 'age',
			}),
		]);
	}).not.toThrow();
});

it('throws if two columns have the same id', () => {
	expect(() => {
		createColumns<User>([
			column({
				header: 'First Name',
				accessor: 'firstName',
			}),
			column({
				header: 'Age',
				accessor: 'firstName',
			}),
		]);
	}).toThrowError('Duplicate column ids not allowed: "firstName"');
});
