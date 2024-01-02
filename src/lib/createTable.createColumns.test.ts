import { writable } from 'svelte/store';
import { createTable } from './createTable.js';

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

it('using headers as id, passes if no duplicate headers', () => {
	expect(() => {
		table.createColumns([
			table.column({
				header: 'First Name',
				accessor: (item) => item.firstName,
			}),
			table.column({
				header: 'Last Name',
				accessor: (item) => item.lastName,
			}),
			table.display({
				header: 'Actions',
				cell: () => '',
			}),
		]);
	}).not.toThrow();
});

it('using headers as id, throws if two columns have the same headers', () => {
	expect(() => {
		table.createColumns([
			table.column({
				header: 'First Name',
				accessor: (item) => item.firstName,
			}),
			table.column({
				header: 'Last Name',
				accessor: (item) => item.lastName,
			}),
			table.display({
				header: 'First Name',
				cell: () => '',
			}),
		]);
	}).toThrowError('Duplicate column ids not allowed: "First Name"');
});
