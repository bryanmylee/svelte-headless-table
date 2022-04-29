import type { BodyRow } from '$lib/bodyRows';
import type { HeaderCell } from '$lib/headerCells';
import type { EventHandler, UseTablePlugin } from '$lib/types/plugin';
import { compare } from '$lib/utils/compare';
import { derived, writable, type Writable } from 'svelte/store';

export interface SortByConfig {
	multiSort?: boolean;
}

export interface SortByState {
	sortKeys: Writable<Array<SortKey>>;
}

export interface SortKey {
	id: string;
	order: 'asc' | 'desc';
}

export const sortBy = <Item>({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	multiSort = true,
}: SortByConfig = {}): UseTablePlugin<Item, SortByState> => {
	const sortKeys = writable<Array<SortKey>>([]);

	const state: SortByState = {
		sortKeys,
	};

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

	const thEventHandler: EventHandler<HeaderCell<Item>> = {
		type: 'click',
		callback: ({ component }) => {
			const { id } = component;
			sortKeys.update(($sortKeys) => {
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
		},
	};

	return {
		state,
		sortFn,
		hooks: {
			thead: {
				tr: {
					th: {
						eventHandlers: [thEventHandler],
					},
				},
			},
		},
	};
};
