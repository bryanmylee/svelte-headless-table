import type { NBSP } from '$lib/constants';

export type ThGroup = {
	type: 'group';
	name: string;
	colspan: number;
};

export type ThLeaf<Item extends object> = {
	type: 'leaf';
	name: string;
	colspan: 1;
	key: keyof Item;
};

export type ThBlank = {
	type: 'blank';
	name: typeof NBSP;
	colspan: 1;
};

export type Th<Item extends object> = ThGroup | ThLeaf<Item> | ThBlank;
