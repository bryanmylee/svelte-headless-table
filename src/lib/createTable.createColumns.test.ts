import { writable } from 'svelte/store';
import { createTable } from './createTable';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

const data = writable<User[]>([]);

const table = createTable(data);

it('passes if no duplicate columns', () => {
	expect(() => {
		table.createColumns([
			table.column({
				header: 'First Name',
				accessor: 'firstName',
			}),
			table.column({
				header: 'Age',
				accessor: 'age',
			}),
		]);
	}).not.toThrow();
});

it('throws if two columns have the same id', () => {
	expect(() => {
		table.createColumns([
			table.column({
				header: 'First Name',
				accessor: 'firstName',
			}),
			table.column({
				header: 'Age',
				accessor: 'firstName',
			}),
		]);
	}).toThrowError('Duplicate column ids not allowed: "firstName"');
});
