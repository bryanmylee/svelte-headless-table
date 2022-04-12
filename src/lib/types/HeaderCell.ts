import type { NBSP } from '$lib/constants';

export type HeaderGroupCell = {
	type: 'group';
	header: string;
	colspan: number;
};

export type HeaderLeafCell<Item extends object> = {
	type: 'leaf';
	header: string;
	colspan: 1;
	key: keyof Item;
};

export type HeaderBlankCell = {
	type: 'blank';
	header: typeof NBSP;
	colspan: 1;
};

export type HeaderCell<Item extends object> =
	| HeaderGroupCell
	| HeaderLeafCell<Item>
	| HeaderBlankCell;
