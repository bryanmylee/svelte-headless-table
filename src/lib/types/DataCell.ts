export type DataCell<Item extends object> = {
	key: keyof Item;
	value: Item[keyof Item];
};
