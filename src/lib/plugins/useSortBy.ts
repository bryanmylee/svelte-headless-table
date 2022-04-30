import type { BodyRow } from '$lib/bodyRows';
import { DataHeaderCell } from '$lib/headerCells';
import type { EventHandler, UseTablePlugin } from '$lib/types/plugin';
import { compare } from '$lib/utils/compare';
import { derived, writable, type Writable } from 'svelte/store';

export interface SortByConfig {
	multiSort?: boolean;
}

/**
 * `PluginState` will be exposed to the user as controls for the plugin.
 * `PluginState` should be `Writable` or contain `Writable`s.
 */
export interface SortByState {
	sortKeys: SortKeys;
}

/**
 * `PluginPropSet` describes data passed into each table component.
 */
export interface SortByPropSet {
	'thead.tr': never;
	'thead.tr.th': {
		order: 'asc' | 'desc' | undefined;
	};
	'tbody.tr': never;
	'tbody.tr.td': never;
}

export interface SortKey {
	id: string;
	order: 'asc' | 'desc';
}

export const useSortKeys = (initKeys: Array<SortKey>) => {
	const { subscribe, update, set } = writable(initKeys);
	const toggleId = (id: string, { multiSort = true }: SortByConfig = {}) => {
		update(($sortKeys) => {
			const keyIdx = $sortKeys.findIndex((key) => key.id === id);
			if (!multiSort) {
				if (keyIdx === -1) {
					return [{ id, order: 'asc' }];
				}
				const key = $sortKeys[keyIdx];
				if (key.order === 'asc') {
					return [{ id, order: 'desc' }];
				}
				return [];
			}
			if (keyIdx === -1) {
				return [...$sortKeys, { id, order: 'asc' }];
			}
			const key = $sortKeys[keyIdx];
			if (key.order === 'asc') {
				return [
					...$sortKeys.slice(0, keyIdx),
					{ id, order: 'desc' },
					...$sortKeys.slice(keyIdx + 1),
				];
			}
			return [...$sortKeys.slice(0, keyIdx), ...$sortKeys.slice(keyIdx + 1)];
		});
	};
	return {
		subscribe,
		update,
		set,
		toggleId,
	};
};

export type SortKeys = Writable<Array<SortKey>> & {
	toggleId: (id: string) => void;
};

export const useSortBy = <Item>({ multiSort = true }: SortByConfig = {}): UseTablePlugin<
	Item,
	SortByState,
	SortByPropSet
> => {
	// TODO Custom store interface and methods.
	const sortKeys = useSortKeys([]);

	const pluginState: SortByState = { sortKeys };

	const sortFn = derived(sortKeys, ($sortKeys) => {
		// Memoize the id to column index relationship.
		const colIdToIdx: Record<string, number> = {};
		return (a: BodyRow<Item>, b: BodyRow<Item>) => {
			for (const key of $sortKeys) {
				if (!(key.id in colIdToIdx)) {
					const idx = a.cells.findIndex((cell) => cell.column.id === key.id);
					colIdToIdx[key.id] = idx;
				}
				const idx = colIdToIdx[key.id];
				const cellA = a.cells[idx];
				const cellB = b.cells[idx];
				let order = 0;
				// Only need to check properties of `cellA` as both should have the same
				// properties.
				if (cellA.column.sortOnFn !== undefined) {
					const sortOnFn = cellA.column.sortOnFn;
					const sortOnA = sortOnFn(cellA.value);
					const sortOnB = sortOnFn(cellB.value);
					order = compare(sortOnA, sortOnB);
				} else if (typeof cellA.value === 'string' || typeof cellA.value === 'number') {
					// typeof `cellB.value` is logically equal to `cellA.value`.
					order = compare(cellA.value, cellB.value as string | number);
				}
				if (order !== 0) {
					return key.order === 'asc' ? order : -order;
				}
			}
			return 0;
		};
	});

	return {
		pluginState,
		sortFn,
		hooks: {
			'thead.tr.th': (cell) => {
				const props = derived(sortKeys, ($sortKeys) => {
					const key = $sortKeys.find((k) => k.id === cell.id);
					return {
						order: key?.order,
					};
				});
				const onClick: EventHandler = {
					type: 'click',
					callback() {
						const { id } = cell;
						sortKeys.toggleId(id, { multiSort });
					},
				};
				return {
					eventHandlers: cell instanceof DataHeaderCell ? [onClick] : [],
					props: props,
				};
			},
		},
	};
};
