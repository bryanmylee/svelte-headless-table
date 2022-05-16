import type { BodyRow } from '$lib/bodyRows';
import type { DeriveRowsFn, NewTablePropSet, TablePlugin } from '$lib/types/TablePlugin';
import { derived, writable, type Readable, type Updater, type Writable } from 'svelte/store';

export interface PaginationConfig {
	initialPageIndex?: number;
	initialPageSize?: number;
}

export interface PaginationState {
	pageSize: Writable<number>;
	pageIndex: Writable<number>;
	pageCount: Readable<number>;
	hasPreviousPage: Readable<boolean>;
	hasNextPage: Readable<boolean>;
}

const MIN_PAGE_SIZE = 1;

export const createPageStore = ({ items, initialPageSize, initialPageIndex }: PageStoreConfig) => {
	const pageSize = writable(initialPageSize);
	const updatePageSize = (fn: Updater<number>) => {
		pageSize.update(($pageSize) => {
			const newPageSize = fn($pageSize);
			return Math.max(newPageSize, MIN_PAGE_SIZE);
		});
	};
	const setPageSize = (newPageSize: number) => updatePageSize(() => newPageSize);

	const pageCount = derived([pageSize, items], ([$pageSize, $items]) => {
		const $pageCount = Math.ceil($items.length / $pageSize);
		pageIndex.update(($pageIndex) => {
			if ($pageCount > 0 && $pageIndex >= $pageCount) {
				return $pageCount - 1;
			}
			return $pageIndex;
		});
		return $pageCount;
	});

	const pageIndex = writable(initialPageIndex);

	const hasPreviousPage = derived(pageIndex, ($pageIndex) => {
		return $pageIndex > 0;
	});
	const hasNextPage = derived([pageIndex, pageCount], ([$pageIndex, $pageCount]) => {
		return $pageIndex < $pageCount - 1;
	});

	return {
		pageSize: {
			subscribe: pageSize.subscribe,
			update: updatePageSize,
			set: setPageSize,
		},
		pageCount,
		pageIndex,
		hasPreviousPage,
		hasNextPage,
	};
};

export interface PageStoreConfig {
	items: Readable<unknown[]>;
	initialPageSize?: number;
	initialPageIndex?: number;
}

export const addPagination =
	<Item>({ initialPageIndex = 0, initialPageSize = 10 }: PaginationConfig = {}): TablePlugin<
		Item,
		PaginationState,
		Record<string, never>,
		NewTablePropSet<never>
	> =>
	() => {
		const prePaginatedRows = writable<BodyRow<Item>[]>([]);
		const paginatedRows = writable<BodyRow<Item>[]>([]);
		const { pageSize, pageCount, pageIndex, hasPreviousPage, hasNextPage } = createPageStore({
			items: prePaginatedRows,
			initialPageIndex,
			initialPageSize,
		});
		const pluginState: PaginationState = {
			pageSize,
			pageIndex,
			pageCount,
			hasPreviousPage,
			hasNextPage,
		};

		const derivePageRows: DeriveRowsFn<Item> = (rows) => {
			return derived([rows, pageSize, pageIndex], ([$rows, $pageSize, $pageIndex]) => {
				prePaginatedRows.set($rows);
				const startIdx = $pageIndex * $pageSize;
				const _paginatedRows = $rows.slice(startIdx, startIdx + $pageSize);
				paginatedRows.set(_paginatedRows);
				return _paginatedRows;
			});
		};

		return {
			pluginState,
			derivePageRows,
		};
	};
