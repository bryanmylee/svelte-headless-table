import type { NBSP } from '$lib/constants';

export type HeaderGroup = {
	type: 'group';
	header: string;
	colspan: number;
};

export type HeaderLeaf<Item extends object> = {
	type: 'data';
	header: string;
	colspan: 1;
	key: keyof Item;
};

export type HeaderBlank = {
	type: 'blank';
	header: typeof NBSP;
	colspan: 1;
};

export type Header<Item extends object> = HeaderGroup | HeaderLeaf<Item> | HeaderBlank;
