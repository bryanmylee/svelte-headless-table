import type { NBSP } from '$lib/constants';
import type { Label } from './Label';

export type HeaderGroupCell<Item extends object> = {
	type: 'group';
	label: Label<Item>;
	colspan: number;
};

export type HeaderLeafCell<Item extends object> = {
	type: 'data';
	label: Label<Item>;
	colspan: 1;
	key: keyof Item;
};

export type HeaderBlankCell = {
	type: 'blank';
	label: typeof NBSP;
	colspan: 1;
};

export type HeaderCell<Item extends object> =
	| HeaderGroupCell<Item>
	| HeaderLeafCell<Item>
	| HeaderBlankCell;
