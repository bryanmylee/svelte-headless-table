export type ColumnGroupDef<Item extends object> = {
	header: string;
	columns: ColumnDef<Item>[];
};

export type ColumnLeafDef<Item extends object> = {
	header: string;
	key: keyof Item;
};

export type ColumnDef<Item extends object> = ColumnGroupDef<Item> | ColumnLeafDef<Item>;
