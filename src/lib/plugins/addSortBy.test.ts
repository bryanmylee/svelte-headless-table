import { get, readable } from 'svelte/store';
import { createTable } from '../createTable.js';
import { addSortBy } from './addSortBy.js';

const data = readable([
	{ id: 1, createdAt: new Date(2023, 1, 1), name: { first: 'Ariana', last: 'Grande' } },
	{ id: 2, createdAt: new Date(1990, 1, 1), name: { first: 'Harry', last: 'Styles' } },
	{ id: 3, createdAt: null, name: { first: 'Doja', last: 'Cat' } },
	{ id: 4, createdAt: new Date(2010, 1, 1), name: { first: 'Sam', last: 'Smith' } },
]);

test('compare fn sort', () => {
	const table = createTable(data, {
		sort: addSortBy({ initialSortKeys: [{ id: 'name', order: 'asc' }] }),
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'name',
			header: 'Name',
			plugins: {
				sort: {
					compareFn(a, b) {
						return a.first < b.first ? -1 : 1;
					},
				},
			},
		}),
	]);
	const vm = table.createViewModel(columns);
	const rows = get(vm.rows);
	const rowIds = rows.map((it) => it.isData() && it.original.id);
	expect(rowIds).toStrictEqual([1, 3, 2, 4]);
});

test('ascending date sort', () => {
	const table = createTable(data, {
		sort: addSortBy({ initialSortKeys: [{ id: 'createdAt', order: 'asc' }] }),
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'createdAt',
			header: 'Created At',
		}),
	]);
	const vm = table.createViewModel(columns);
	const rows = get(vm.rows);
	const rowIds = rows.map((it) => it.isData() && it.original.id);
	expect(rowIds).toStrictEqual([3, 2, 4, 1]);
});

test('descending date sort', () => {
	const table = createTable(data, {
		sort: addSortBy({ initialSortKeys: [{ id: 'createdAt', order: 'desc' }] }),
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'createdAt',
			header: 'Created At',
		}),
	]);
	const vm = table.createViewModel(columns);
	const rows = get(vm.rows);
	const rowIds = rows.map((it) => it.isData() && it.original.id);
	expect(rowIds).toStrictEqual([1, 4, 2, 3]);
});
