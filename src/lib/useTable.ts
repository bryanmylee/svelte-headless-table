import { derived, readable, type Readable } from 'svelte/store';
import { getBodyRows } from './bodyRows';
import { getFlatColumns, type Column } from './columns';
import { getHeaderRows } from './headerRows';
import type { Entries } from './types/Entries';
import type { AggregateTableHooks, TableHooks, UseTablePlugin } from './types/plugin';
import { nonNullish } from './utils/filter';

export type UseTableProps<Item> = {
	data: Readable<Array<Item>>;
	columns: Array<Column<Item>>;
};

export const useTable = <Item, Plugins extends Record<string, UseTablePlugin<Item, unknown>>>(
	{ data, columns }: UseTableProps<Item>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	plugins: Plugins = {} as any
) => {
	type PluginStates = { [K in keyof Plugins]: Plugins[K]['state'] };
	const pluginStates = Object.fromEntries(
		Object.entries(plugins).map(([key, plugin]) => [key, plugin.state])
	) as PluginStates;

	const sortFns = Object.values(plugins)
		.map((plugin) => plugin.sortFn)
		.filter(nonNullish);

	const aggregateHooks = getAggregateHooks<Item, Plugins>(plugins);

	const flatColumns = readable(getFlatColumns(columns));
	const headerRows = derived([], () => {
		const $headerRows = getHeaderRows(columns);
		// Apply hooks.
		$headerRows.forEach((row) => {
			row.cells.forEach((cell) => {
				cell.applyHook(aggregateHooks['thead.tr.th']);
			});
		});
		return $headerRows;
	});

	const originalBodyRows = derived([data, flatColumns], ([$data, $flatColumns]) => {
		return getBodyRows($data, $flatColumns);
	});
	const bodyRows = derived([originalBodyRows, ...sortFns], ([$originalBodyRows, ...$sortFns]) => {
		const sortedRows = [...$originalBodyRows];
		$sortFns.forEach((sortFn) => {
			sortedRows.sort(sortFn);
		});
		return sortedRows;
	});

	return {
		flatColumns,
		headerRows,
		bodyRows,
		plugins: pluginStates,
	};
};

const getAggregateHooks = <Item, Plugins extends Record<string, UseTablePlugin<Item, unknown>>>(
	plugins: Plugins
) => {
	const aggregateHooks: AggregateTableHooks<Item> = {
		'thead.tr': {
			eventHandlers: [],
		},
		'thead.tr.th': {
			eventHandlers: [],
		},
	};
	Object.values(plugins).forEach(({ hooks }) => {
		if (hooks === undefined) return;
		const hookEntries = Object.entries(hooks) as Entries<TableHooks<Item>>;
		hookEntries.forEach(([key, hook]) => {
			if (hook.eventHandlers !== undefined) {
				// We know logically that key and hook types are bound.
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				aggregateHooks[key].eventHandlers = [
					...aggregateHooks[key].eventHandlers,
					...hook.eventHandlers,
				];
			}
		});
	});
	return aggregateHooks;
};
