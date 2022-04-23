import type { TablePlugin } from '$lib/types/TablePlugin';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface SortByProps {
	multiSort?: boolean;
}

export interface SortByState<Item extends object> {
	sortKeys: Writable<(keyof Item)[]>;
}

export const sortBy = <Item extends object>({ multiSort = true }: SortByProps = {}): TablePlugin<
	Item,
	SortByState<Item>
> => {
	const sortKeys = writable<(keyof Item)[]>([]);
	const sortFn: Readable<(a: Item, b: Item) => number> = derived(
		sortKeys,
		($sortKeys) => (a: Item, b: Item) => {
			for (const key of $sortKeys) {
				if (a[key] < b[key]) {
					return -1;
				} else if (a[key] > b[key]) {
					return 1;
				}
			}
			return 0;
		}
	);
	return {
		sortFn,
		state: {
			sortKeys,
		},
	};
};
