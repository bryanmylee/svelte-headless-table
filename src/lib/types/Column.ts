export type ColumnGroup<Item extends object> = {
	type: 'group';
	header: string;
	columns: Column<Item>[];
};

export type ColumnData<Item extends object> = {
	type: 'data';
	header: string;
	key: keyof Item;
};

export type Column<Item extends object> = ColumnGroup<Item> | ColumnData<Item>;
