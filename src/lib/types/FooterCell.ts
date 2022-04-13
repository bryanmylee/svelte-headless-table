import { NBSP } from '$lib/constants';
import type { ColumnLabel } from './ColumnLabel';

export type FooterGroupCell<Item extends object> = {
	type: 'group';
	label: ColumnLabel<Item>;
	colspan: number;
};

export type FooterDataCell<Item extends object> = {
	type: 'data';
	label: ColumnLabel<Item>;
	colspan: 1;
	key: keyof Item;
};

export type FooterBlankCell = {
	type: 'blank';
	label: typeof NBSP;
	colspan: 1;
};

export const FOOTER_BLANK: FooterBlankCell = {
	type: 'blank',
	label: NBSP,
	colspan: 1,
};

export type FooterCell<Item extends object> =
	| FooterGroupCell<Item>
	| FooterDataCell<Item>
	| FooterBlankCell;
