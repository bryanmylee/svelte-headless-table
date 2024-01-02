import type { BodyRow } from '../bodyRows.js';
import type { DeriveRowsFn, NewTablePropSet, TablePlugin } from '../types/TablePlugin.js';
import { derived, writable, type Readable, type Updater, type Writable } from 'svelte/store';

export type PaginationConfig = {
	initialPageIndex?: number;
	initialPageSize?: number;
} & (
	| {
			serverSide?: false | undefined;
			serverItemCount?: undefined;
	  }
	| {
			serverSide: true;
			serverItemCount: Readable<number>;
	  }
);

export interface PaginationState {
	pageSize: Writable<number>;
	pageIndex: Writable<number>;
	pageCount: Readable<number>;
	hasPreviousPage: Readable<boolean>;
	hasNextPage: Readable<boolean>;
}

const MIN_PAGE_SIZE = 1;

export const createPageStore = ({
	items,
	initialPageSize,
	initialPageIndex,
	serverSide,
	serverItemCount,
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

	function calcPageCountAndLimitIndex([$pageSize, $itemCount]: [
		$pageSize: number,
		$itemCount: number
	]) {
		const $pageCount = Math.ceil($itemCount / $pageSize);
		pageIndex.update(($pageIndex) => {
			if ($pageCount > 0 && $pageIndex >= $pageCount) {
				return $pageCount - 1;
			}
			return $pageIndex;
		});
		return $pageCount;
	}

	let pageCount;
	if (serverSide && serverItemCount != null) {
		pageCount = derived([pageSize, serverItemCount], calcPageCountAndLimitIndex);
	} else {
		const itemCount = derived(items, ($items) => $items.length);
		pageCount = derived([pageSize, itemCount], calcPageCountAndLimitIndex);
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
		serverItemCount,
		hasPreviousPage,
		hasNextPage,
	};
};

export interface PageStoreConfig {
	items: Readable<unknown[]>;
	initialPageSize?: number;
	initialPageIndex?: number;
	serverSide?: boolean;
	serverItemCount?: Readable<number>;
}

export const addPagination =
	<Item>({
		initialPageIndex = 0,
		initialPageSize = 10,
		serverSide = false,
		serverItemCount,
	}: PaginationConfig = {}): TablePlugin<
		Item,
		PaginationState,
		Record<string, never>,
		NewTablePropSet<never>
	> =>
	() => {
		const prePaginatedRows = writable<BodyRow<Item>[]>([]);
		const paginatedRows = writable<BodyRow<Item>[]>([]);
		const { pageSize, pageIndex, pageCount, hasPreviousPage, hasNextPage } = createPageStore({
			items: prePaginatedRows,
			initialPageIndex,
			initialPageSize,
			serverSide,
			serverItemCount,
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
				if (serverSide) {
					paginatedRows.set($rows);
					return $rows;
				}
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
