import type { BodyRow } from '$lib/bodyRows';
import type { UseTablePlugin, NewTablePropSet } from '$lib/types/UseTablePlugin';
import { compare } from '$lib/utils/compare';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface SortByConfig {
	initialSortKeys?: SortKey[];
	disableMultiSort?: boolean;
	isMultiSortEvent?: (event: Event) => boolean;
}

export interface SortByState<Item> {
	sortKeys: WritableSortKeys;
	preSortedRows: Readable<BodyRow<Item>[]>;
}

export interface SortByColumnOptions {
	disable?: boolean;
	// TODO pass <Item> generic into column options
	getSortValue?: (item: unknown) => string | number | (string | number)[];
}

export type SortByPropSet = NewTablePropSet<{
	'thead.tr.th': {
		order: 'asc' | 'desc' | undefined;
		toggle: (event: Event) => void;
		disabled: boolean;
	};
}>;

export interface SortKey {
	id: string;
	order: 'asc' | 'desc';
}

export const useSortKeys = (initKeys: SortKey[]): WritableSortKeys => {
	const { subscribe, update, set } = writable(initKeys);
	const toggleId = (id: string, { multiSort = true }: ToggleOptions = {}) => {
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

interface ToggleOptions {
	multiSort?: boolean;
}

export type WritableSortKeys = Writable<SortKey[]> & {
	toggleId: (id: string, options: ToggleOptions) => void;
};

const shiftClickIsMultiSortEvent = (event: Event) => {
	if (!(event instanceof MouseEvent)) return false;
	return event.shiftKey;
};

export const useSortBy =
	<Item>({
		initialSortKeys = [],
		disableMultiSort = false,
		isMultiSortEvent = shiftClickIsMultiSortEvent,
	}: SortByConfig = {}): UseTablePlugin<
		Item,
		{
			PluginState: SortByState<Item>;
			ColumnOptions: SortByColumnOptions;
			TablePropSet: SortByPropSet;
		}
	> =>
	({ columnOptions }: { columnOptions: Record<string, SortByColumnOptions> }) => {
		const disabledSortIds = Object.entries(columnOptions)
			.filter(([, option]) => option.disable === true)
			.map(([columnId]) => columnId);

		const sortKeys = useSortKeys(initialSortKeys);
		const preSortedRows = writable<BodyRow<Item>[]>([]);
		const sortedRows = writable<BodyRow<Item>[]>([]);

		const transformRowsFn = derived(sortKeys, ($sortKeys) => {
			return (rows: BodyRow<Item>[]) => {
				preSortedRows.set(rows);
				const _sortedRows = [...rows];
				_sortedRows.sort((a, b) => {
					for (const key of $sortKeys) {
						const cellA = a.cellForId[key.id];
						const cellB = b.cellForId[key.id];
						let order = 0;
						// Only need to check properties of `cellA` as both should have the same
						// properties.
						const getSortValue = columnOptions[cellA.id]?.getSortValue;
						if (getSortValue !== undefined) {
							const sortValueA = getSortValue(cellA.value);
							const sortValueB = getSortValue(cellB.value);
							order = compare(sortValueA, sortValueB);
						} else if (typeof cellA.value === 'string' || typeof cellA.value === 'number') {
							// typeof `cellB.value` is logically equal to `cellA.value`.
							order = compare(cellA.value, cellB.value as string | number);
						}
						if (order !== 0) {
							return key.order === 'asc' ? order : -order;
						}
					}
					return 0;
				});
				sortedRows.set(_sortedRows);
				return _sortedRows;
			};
		});

		const pluginState: SortByState<Item> = { sortKeys, preSortedRows };

		return {
			pluginState,
			transformRowsFn,
			hooks: {
				'thead.tr.th': (cell) => {
					const disabled = disabledSortIds.includes(cell.id);
					const props = derived(sortKeys, ($sortKeys) => {
						const key = $sortKeys.find((k) => k.id === cell.id);
						const toggle = (event: Event) => {
							if (!cell.isData) return;
							if (disabledSortIds.includes(cell.id)) return;
							sortKeys.toggleId(cell.id, {
								multiSort: disableMultiSort ? false : isMultiSortEvent(event),
							});
						};
						return {
							order: key?.order,
							toggle,
							disabled,
						};
					});
					return { props };
				},
			},
		};
	};
