import { derived, readable, type Readable } from 'svelte/store';
import { getBodyRows } from './bodyRows';
import { getFlatColumns, type Column } from './columns';
import { getHeaderRows } from './headerRows';
import type { AggregateTableHooks, UseTablePlugin } from './types/plugin';
import { nonNullish } from './utils/filter';

export type UseTableProps<Item> = {
	data: Readable<Array<Item>>;
	columns: Array<Column<Item>>;
};

export const useTable = <Item, P extends Record<string, UseTablePlugin<Item, unknown>>>(
	{ data, columns: rawColumns }: UseTableProps<Item>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	plugins: P = {} as any
) => {
	type PluginStates = { [K in keyof P]: P[K]['state'] };
	const pluginStates = Object.fromEntries(
		Object.entries(plugins).map(([key, plugin]) => [key, plugin.state])
	) as PluginStates;

	const sortFns = Object.values(plugins)
		.map((plugin) => plugin.sortFn)
		.filter(nonNullish);

	const aggregateHooks: AggregateTableHooks<Item> = {
		thead: {
			tr: {
				eventHandlers: [],
				th: {
					eventHandlers: [],
				},
			},
		},
	};
	Object.values(plugins).forEach(({ hooks }) => {
		if (hooks === undefined) return;
		const { thead } = hooks;
		if (thead !== undefined) {
			const { tr } = thead;
			if (tr !== undefined) {
				if (tr.eventHandler !== undefined) {
					aggregateHooks.thead.tr.eventHandlers.push(tr.eventHandler);
				}
				const { th } = tr;
				if (th !== undefined) {
					if (th.eventHandler !== undefined) {
						aggregateHooks.thead.tr.th.eventHandlers.push(th.eventHandler);
					}
				}
			}
		}
	});

	const flatColumns = readable(getFlatColumns(rawColumns));
	const headerRows = readable(getHeaderRows(rawColumns));

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
