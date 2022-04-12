export type HeaderGroup = {
	type: 'group';
	name: string;
	colspan: number;
};

export type HeaderLeaf<Item extends object> = {
	type: 'leaf';
	name: string;
	colspan: 1;
	key: keyof Item;
};

export type HeaderBlank = {
	type: 'blank';
	colspan: 1;
};

export type HeaderCell<Item extends object> = HeaderGroup | HeaderLeaf<Item> | HeaderBlank;
