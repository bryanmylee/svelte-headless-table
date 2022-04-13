import { NBSP } from '$lib/constants';
import type { ColumnLabel } from './ColumnLabel';

export type HeaderGroupCell<Item extends object> = {
	type: 'group';
	label: ColumnLabel<Item>;
	colspan: number;
};

export type HeaderDataCell<Item extends object> = {
	type: 'data';
	label: ColumnLabel<Item>;
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
