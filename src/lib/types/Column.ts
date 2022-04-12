export type ColumnGroup<Item extends object> = {
	name: string;
	columns: Column<Item>[];
};

export type ColumnLeaf<Item extends object> = {
	name: string;
	key: keyof Item;
};

export type Column<Item extends object> = ColumnGroup<Item> | ColumnLeaf<Item>;
