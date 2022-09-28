import { createTable } from '$lib/createTable';
import type { Sample } from 'src/routes/_createSamples';
import { get, readable } from 'svelte/store';
import { addGroupBy } from './addGroupBy';
import { addSubRows } from './addSubRows';

test('basic row grouping', () => {
	const data = readable<Sample[]>([
		{ firstName: 'Adam', lastName: 'Lee', age: 30, progress: 30, status: 'single', visits: 5 },
		{ firstName: 'Bryan', lastName: 'Lee', age: 30, progress: 30, status: 'single', visits: 5 },
		{ firstName: 'Charlie', lastName: 'Puth', age: 30, progress: 30, status: 'single', visits: 5 },
		{ firstName: 'Danny', lastName: 'Lee', age: 40, progress: 40, status: 'single', visits: 5 },
		{ firstName: 'Elliot', lastName: 'Page', age: 40, progress: 40, status: 'single', visits: 5 },
	]);
	const table = createTable(data, {
		group: addGroupBy(),
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

	const { groupByIds } = vm.pluginStates.group;
	groupByIds.toggle('lastName');
	const rows = get(vm.rows);

	expect(rows).toHaveLength(3);
	expect(rows[0].subRows).toHaveLength(3);
	expect(rows[1].subRows).toHaveLength(1);
	expect(rows[2].subRows).toHaveLength(1);

	const subRow00 = rows[0].subRows?.[0];
	const subRow00Data = (subRow00?.isData() && subRow00.original) as Sample;
	expect(subRow00Data.firstName).toBe('Adam');

	const subRow11 = rows[0].subRows?.[1];
	const subRow11Data = (subRow11?.isData() && subRow11.original) as Sample;
	expect(subRow11Data.firstName).toBe('Bryan');

	const subRow12 = rows[0].subRows?.[2];
	const subRow12Data = (subRow12?.isData() && subRow12.original) as Sample;
	expect(subRow12Data.firstName).toBe('Danny');
});

it('preserves subrows of a row after grouping', () => {
	const data = readable<Sample[]>([
		{
			firstName: 'Adam',
			lastName: 'Lee',
			age: 30,
			progress: 30,
			status: 'single',
			visits: 5,
			children: [
				{ firstName: 'Allie', lastName: 'Lee', age: 30, progress: 30, status: 'single', visits: 5 },
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
	const table = createTable(data, {
		sub: addSubRows({
			children: 'children',
		}),
		group: addGroupBy(),
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

	const { groupByIds } = vm.pluginStates.group;
	groupByIds.toggle('lastName');
	const rows = get(vm.rows);

	const subRow00 = rows[0].subRows?.[0];
	expect(subRow00?.subRows).toHaveLength(2);
});
