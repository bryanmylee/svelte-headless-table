import type { UseTablePlugin } from '$lib/useTable';
import { writable, type Writable } from 'svelte/store';

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
}: SortByConfig): UseTablePlugin<Item, SortByState> => {
	const sortKeys = writable<Array<SortKey>>([]);
	const state = {
		sortKeys,
	};
	return {
		state,
	};
};
