import type { NBSP } from '$lib/constants';

export type HeaderGroupCell = {
	type: 'group';
	label: string;
	colspan: number;
};

export type HeaderLeafCell<Item extends object> = {
	type: 'data';
	label: string;
	colspan: 1;
	key: keyof Item;
};

export type HeaderBlankCell = {
	type: 'blank';
	label: typeof NBSP;
	colspan: 1;
};

export type HeaderCell<Item extends object> =
	| HeaderGroupCell
	| HeaderLeafCell<Item>
	| HeaderBlankCell;
