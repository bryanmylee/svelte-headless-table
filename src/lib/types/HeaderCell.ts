import { NBSP } from '$lib/constants';
import type { RowsLabel } from './RowsLabel';

export type HeaderGroupCell<Item extends object> = {
	type: 'group';
	label: RowsLabel<Item>;
	colspan: number;
};

export type HeaderDataCell<Item extends object> = {
	type: 'data';
	label: RowsLabel<Item>;
	colspan: 1;
	key: keyof Item;
};

export type HeaderBlankCell = {
	type: 'blank';
	label: typeof NBSP;
	colspan: 1;
};

export const HEADER_BLANK: HeaderBlankCell = {
	type: 'blank',
	label: NBSP,
	colspan: 1,
};

export type HeaderCell<Item extends object> =
	| HeaderGroupCell<Item>
	| HeaderDataCell<Item>
	| HeaderBlankCell;
