import { createTable } from '../createTable.js';
import type { Sample } from '../../routes/_createSamples.js';
import { get, readable } from 'svelte/store';
import { addFlatten } from './addFlatten.js';
import { addSubRows } from './addSubRows.js';

const data = readable<Sample[]>([
	{
		firstName: 'Adam',
		lastName: 'Lee',
		age: 30,
		progress: 30,
		status: 'single',
		visits: 5,
		children: [
			{
				firstName: 'Allie',
				lastName: 'Lee',
				age: 30,
				progress: 30,
				status: 'single',
				visits: 5,
				children: [
					{
						firstName: 'Aria',
						lastName: 'Lee',
						age: 30,
						progress: 30,
						status: 'single',
						visits: 5,
					},
				],
			},
			{ firstName: 'Amy', lastName: 'Lee', age: 30, progress: 30, status: 'single', visits: 5 },
		],
	},
	{
		firstName: 'Bryan',
		lastName: 'Lee',
		age: 30,
		progress: 30,
		status: 'single',
		visits: 5,
		children: [
			{ firstName: 'Ben', lastName: 'Lee', age: 30, progress: 30, status: 'single', visits: 5 },
			{ firstName: 'Beth', lastName: 'Lee', age: 30, progress: 30, status: 'single', visits: 5 },
		],
	},
	{
		firstName: 'Charlie',
		lastName: 'Puth',
		age: 30,
		progress: 30,
		status: 'single',
		visits: 5,
		children: [
			{ firstName: 'Cory', lastName: 'Puth', age: 30, progress: 30, status: 'single', visits: 5 },
			{
				firstName: 'Carmen',
				lastName: 'Puth',
				age: 30,
				progress: 30,
				status: 'single',
				visits: 5,
			},
		],
	},
	{ firstName: 'Danny', lastName: 'Lee', age: 40, progress: 40, status: 'single', visits: 5 },
	{ firstName: 'Elliot', lastName: 'Page', age: 40, progress: 40, status: 'single', visits: 5 },
]);

test('basic row flattening', () => {
	const table = createTable(data, {
		sub: addSubRows({ children: 'children' }),
		flatten: addFlatten({ initialDepth: 1 }),
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'firstName',
			header: 'First Name',
		}),
		table.column({
			accessor: 'lastName',
			header: 'Last Name',
		}),
	]);
	const vm = table.createViewModel(columns);
	const rows = get(vm.rows);
	expect(rows).toHaveLength(6);
	const row0 = rows[0].isData() ? rows[0] : undefined;
	expect(row0).not.toBeUndefined();
	expect(row0?.original.firstName).toBe('Allie');
	expect(row0?.subRows).toHaveLength(1);
});

test('multi-level row flattening', () => {
	const table = createTable(data, {
		sub: addSubRows({ children: 'children' }),
		flatten: addFlatten({ initialDepth: 2 }),
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'firstName',
			header: 'First Name',
		}),
		table.column({
			accessor: 'lastName',
			header: 'Last Name',
		}),
	]);
	const vm = table.createViewModel(columns);
	const rows = get(vm.rows);
	expect(rows).toHaveLength(1);
	const row0 = rows[0].isData() ? rows[0] : undefined;
	expect(row0).not.toBeUndefined();
	expect(row0?.original.firstName).toBe('Aria');
});
