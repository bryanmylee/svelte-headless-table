export type ColumnGroup<Item extends object> = {
	header: string;
	columns: Column<Item>[];
};

export type ColumnLeaf<Item extends object> = {
	header: string;
	key: keyof Item;
};

export type Column<Item extends object> = ColumnGroup<Item> | ColumnLeaf<Item>;
