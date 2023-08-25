import { get, readable } from 'svelte/store';
import { createTable } from '../createTable';
import { addSortBy } from './addSortBy';

const data = readable([
	{ id: 1, createdAt: new Date(2023, 1, 1), name: { first: 'Ariana', last: 'Grande' }, known: undefined },
	{ id: 2, createdAt: new Date(1990, 1, 1), name: { first: 'Harry', last: 'Styles' }, known: 7  },
	{ id: 3, createdAt: new Date(2025, 1, 1), name: { first: 'Doja', last: 'Cat' }, known: 21 },
	{ id: 4, createdAt: new Date(2010, 1, 1), name: { first: 'Sam', last: 'Smith' }, known: null},
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
	expect(rowIds).toStrictEqual([2, 4, 1, 3]);
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
	expect(rowIds).toStrictEqual([3, 1, 4, 2]);
});

test('ascending nullsFirst sort', () => {
	const table = createTable(data, {
		sort: addSortBy({ initialSortKeys: [{ id: 'known', order: 'asc' }] }),
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'known',
			header: 'Known',
			plugins: { 
				sort: { 
					handleNulls: 'nullsFirst' 
				} 
			}
		}),
	]);
	const vm = table.createViewModel(columns);
	const rows = get(vm.rows);
	const rowIds = rows.map((it) => it.isData() && it.original.id);
	expect(rowIds).toStrictEqual([1, 4, 2, 3]);
});


test('descending nullsFirst sort', () => {
	const table = createTable(data, {
		sort: addSortBy({ initialSortKeys: [{ id: 'known', order: 'desc' }] }),
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'known',
			header: 'Known',
			plugins: { 
				sort: { 
					handleNulls: 'nullsFirst' 
				} 
			}
		}),
	]);
	const vm = table.createViewModel(columns);
	const rows = get(vm.rows);
	const rowIds = rows.map((it) => it.isData() && it.original.id);
	expect(rowIds).toStrictEqual([1, 4, 3, 2]);
});

test('ascending nullsLast sort', () => {
	const table = createTable(data, {
		sort: addSortBy({ initialSortKeys: [{ id: 'known', order: 'asc' }] }),
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'known',
			header: 'Known',
			plugins: { 
				sort: { 
					handleNulls: 'nullsLast' 
				} 
			}
		}),
	]);
	const vm = table.createViewModel(columns);
	const rows = get(vm.rows);
	const rowIds = rows.map((it) => it.isData() && it.original.id);
	expect(rowIds).toStrictEqual([2, 3, 1, 4]);
});


test('descending nullsLast sort', () => {
	const table = createTable(data, {
		sort: addSortBy({ initialSortKeys: [{ id: 'known', order: 'desc' }] }),
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'known',
			header: 'Known',
			plugins: { 
				sort: { 
					handleNulls: 'nullsLast' 
				} 
			}
		}),
	]);
	const vm = table.createViewModel(columns);
	const rows = get(vm.rows);
	const rowIds = rows.map((it) => it.isData() && it.original.id);
	expect(rowIds).toStrictEqual([3, 2, 1, 4]);
});