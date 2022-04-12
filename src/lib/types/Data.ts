export type Data<Item extends object> = {
	key: keyof Item;
	value: Item[keyof Item];
};
