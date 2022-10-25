/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createTable } from '../createTable';
import type { Sample } from 'src/routes/_createSamples';
import { derived, get, readable } from 'svelte/store';
import { addSelectedRows } from './addSelectedRows';
import { addSubRows } from './addSubRows';

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

test('basic row selection', () => {
	const table = createTable(data, {
		sub: addSubRows({
			children: 'children',
		}),
		select: addSelectedRows(),
	});
	const columns = table.createColumns([
		table.display({
			id: 'selected',
			header: (_, { pluginStates }) => {
				const { allRowsSelected, someRowsSelected } = pluginStates.select;
				return derived([allRowsSelected, someRowsSelected], ([$all, $some]) => {
					return `all: ${$all}, some: ${$some}`;
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { isSelected, isSomeSubRowsSelected, isAllSubRowsSelected } =
					pluginStates.select.getRowState(row);
				return derived(
					[isSelected, isSomeSubRowsSelected, isAllSubRowsSelected],
					([$selected, $someSubRowsSelected, $allSubRowsSelected]) => {
						return `selected: ${$selected}, some subrows: ${$someSubRowsSelected}, all subrows: ${$allSubRowsSelected}`;
					}
				);
			},
		}),
		table.column({
			header: 'First Name',
			accessor: 'firstName',
		}),
	]);
	const vm = table.createViewModel(columns);
	const rows = get(vm.rows);
	const row0 = rows[0].isData() ? rows[0] : undefined;
	expect(row0).not.toBeUndefined();

	let row0Props = get(row0!.props());
	expect(row0Props.select.selected).toBe(false);

	const { selectedDataIds } = vm.pluginStates.select;
	selectedDataIds.add('0');

	row0Props = get(row0!.props());
	expect(row0Props.select.selected).toBe(true);
});

test('linked parent and child selection', () => {
	const table = createTable(data, {
		sub: addSubRows({
			children: 'children',
		}),
		select: addSelectedRows({
			linkDataSubRows: true,
		}),
	});
	const columns = table.createColumns([
		table.display({
			id: 'selected',
			header: (_, { pluginStates }) => {
				const { allRowsSelected, someRowsSelected } = pluginStates.select;
				return derived([allRowsSelected, someRowsSelected], ([$all, $some]) => {
					return `all: ${$all}, some: ${$some}`;
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { isSelected, isSomeSubRowsSelected, isAllSubRowsSelected } =
					pluginStates.select.getRowState(row);
				return derived(
					[isSelected, isSomeSubRowsSelected, isAllSubRowsSelected],
					([$selected, $someSubRowsSelected, $allSubRowsSelected]) => {
						return `selected: ${$selected}, some subrows: ${$someSubRowsSelected}, all subrows: ${$allSubRowsSelected}`;
					}
				);
			},
		}),
		table.column({
			header: 'First Name',
			accessor: 'firstName',
		}),
	]);
	const vm = table.createViewModel(columns);
	const rows = get(vm.rows);
	const row0 = rows[0].isData() ? rows[0] : undefined;
	expect(row0).not.toBeUndefined();

	let row0Props = get(row0!.props());
	expect(row0Props.select.selected).toBe(false);
	expect(row0Props.select.allSubRowsSelected).toBe(false);
	expect(row0Props.select.someSubRowsSelected).toBe(false);

	const { selectedDataIds } = vm.pluginStates.select;
	selectedDataIds.add('0');

	row0Props = get(row0!.props());
	expect(row0Props.select.selected).toBe(true);

	row0Props = get(row0!.props());
	expect(row0Props.select.selected).toBe(true);
	expect(row0Props.select.allSubRowsSelected).toBe(false);
	expect(row0Props.select.someSubRowsSelected).toBe(false);

	selectedDataIds.add('0>0>0');

	row0Props = get(row0!.props());
	expect(row0Props.select.selected).toBe(true);
	expect(row0Props.select.allSubRowsSelected).toBe(false);
	expect(row0Props.select.someSubRowsSelected).toBe(true);

	selectedDataIds.add('0>1');

	row0Props = get(row0!.props());
	expect(row0Props.select.selected).toBe(true);
	expect(row0Props.select.allSubRowsSelected).toBe(true);
	expect(row0Props.select.someSubRowsSelected).toBe(true);
});
