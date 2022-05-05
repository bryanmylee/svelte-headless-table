import type { BodyRow } from '$lib/bodyRows';
import type { UseTablePlugin, NewTablePropSet } from '$lib/types/UseTablePlugin';
import { compare } from '$lib/utils/compare';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface SortByConfig {
	multiSort?: boolean;
}

export interface SortByState<Item> {
	sortKeys: WritableSortKeys;
	preSortedRows: Readable<BodyRow<Item>[]>;
}

export type SortByPropSet = NewTablePropSet<{
	'thead.tr.th': {
		order: 'asc' | 'desc' | undefined;
		toggle: () => void;
	};
}>;

export interface SortKey {
	id: string;
	order: 'asc' | 'desc';
}

export const useSortKeys = (initKeys: SortKey[]): WritableSortKeys => {
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

export type WritableSortKeys = Writable<SortKey[]> & {
	toggleId: (id: string, config: SortByConfig) => void;
};

export const useSortBy =
	<Item>({ multiSort = true }: SortByConfig = {}): UseTablePlugin<
		Item,
		{
			PluginState: SortByState<Item>;
			ColumnOptions: never;
			TablePropSet: SortByPropSet;
		}
	> =>
	() => {
		const sortKeys = useSortKeys([]);
		const preSortedRows: Readable<BodyRow<Item>[]> = derived([], () => []);

		const pluginState: SortByState<Item> = { sortKeys, preSortedRows };

		const sortFn = derived(sortKeys, ($sortKeys) => {
			// Memoize the id to column index relationship.
			const idxForId: Record<string, number> = {};
			return (a: BodyRow<Item>, b: BodyRow<Item>) => {
				for (const key of $sortKeys) {
					if (!(key.id in idxForId)) {
						const idx = a.cells.findIndex((cell) => cell.column.id === key.id);
						idxForId[key.id] = idx;
					}
					const idx = idxForId[key.id];
					if (idx === -1) {
						continue;
					}
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
						const toggle = () => {
							if (cell.isData) {
								sortKeys.toggleId(cell.id, { multiSort });
							}
						};
						return {
							order: key?.order,
							toggle,
						};
					});
					return { props };
				},
			},
		};
	};
