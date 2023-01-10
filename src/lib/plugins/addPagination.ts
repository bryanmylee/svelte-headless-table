import type { BodyRow } from '../bodyRows';
import type { DeriveRowsFn, NewTablePropSet, TablePlugin } from '../types/TablePlugin';
import { derived, writable, type Readable, type Updater, type Writable } from 'svelte/store';

export interface PaginationConfig {
	initialPageIndex?: number;
	initialPageSize?: number;
	serverSide?: boolean;
}

export interface PaginationState {
	pageSize: Writable<number>;
	pageIndex: Writable<number>;
	pageCount: Readable<number>;
	serverItemsCount: Writable<number>;
	hasPreviousPage: Readable<boolean>;
	hasNextPage: Readable<boolean>;
}

const MIN_PAGE_SIZE = 1;

export const createPageStore = ({
	items,
	initialPageSize,
	initialPageIndex,
	serverSide,
}: PageStoreConfig) => {
	const pageSize = writable(initialPageSize);
	const updatePageSize = (fn: Updater<number>) => {
		pageSize.update(($pageSize) => {
			const newPageSize = fn($pageSize);
			return Math.max(newPageSize, MIN_PAGE_SIZE);
		});
	};
	const setPageSize = (newPageSize: number) => updatePageSize(() => newPageSize);

	const pageIndex = writable(initialPageIndex);

	function calcPageCount([$pageSize, $itemsCount]: [$pageSize: number, $itemsCount: number]) {
		const $pageCount = Math.ceil($itemsCount / $pageSize);
		pageIndex.update(($pageIndex) => {
			if ($pageCount > 0 && $pageIndex >= $pageCount) {
				return $pageCount - 1;
			}
			return $pageIndex;
		});
		return $pageCount;
	}

	const serverItemsCount = writable(0);
	let pageCount;
	if (serverSide) {
		pageCount = derived([pageSize, serverItemsCount], calcPageCount);
	} else {
		const itemCount = derived(items, ($items) => $items.length);
		pageCount = derived([pageSize, itemCount], calcPageCount);
	}

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
		pageIndex,
		pageCount,
		serverItemsCount,
		hasPreviousPage,
		hasNextPage,
	};
};

export interface PageStoreConfig {
	items: Readable<unknown[]>;
	initialPageSize?: number;
	initialPageIndex?: number;
	serverSide?: boolean;
}

export const addPagination =
	<Item>({
		initialPageIndex = 0,
		initialPageSize = 10,
		serverSide = false,
	}: PaginationConfig = {}): TablePlugin<
		Item,
		PaginationState,
		Record<string, never>,
		NewTablePropSet<never>
	> =>
	() => {
		const prePaginatedRows = writable<BodyRow<Item>[]>([]);
		const paginatedRows = writable<BodyRow<Item>[]>([]);
		const { pageSize, pageIndex, pageCount, serverItemsCount, hasPreviousPage, hasNextPage } =
			createPageStore({
				items: prePaginatedRows,
				initialPageIndex,
				initialPageSize,
				serverSide,
			});
		const pluginState: PaginationState = {
			pageSize,
			pageIndex,
			pageCount,
			serverItemsCount,
			hasPreviousPage,
			hasNextPage,
		};

		const derivePageRows: DeriveRowsFn<Item> = (rows) => {
			return derived([rows, pageSize, pageIndex], ([$rows, $pageSize, $pageIndex]) => {
				prePaginatedRows.set($rows);
				if (!serverSide) {
					const startIdx = $pageIndex * $pageSize;
					const _paginatedRows = $rows.slice(startIdx, startIdx + $pageSize);
					paginatedRows.set(_paginatedRows);
					return _paginatedRows;
				} else {
					paginatedRows.set($rows);
					return $rows;
				}
			});
		};

		return {
			pluginState,
			derivePageRows,
		};
	};
