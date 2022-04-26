// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ColumnFilter<Item> {
	hiddenColumns?: Array<string>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ColumnOrder<Item> {
	columnOrder?: Array<string>;
}

export interface SortKey {
	id: string;
	order: 'asc' | 'desc';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface SortOn<Item> {
	sortKeys?: Array<SortKey>;
}
