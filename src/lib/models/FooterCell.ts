import { NBSP } from '$lib/constants';
import type { ColumnLabel } from '$lib/types/ColumnLabel';

export type FooterGroupCellData<Item extends object> = {
	type: 'group';
	colspan: number;
	label: ColumnLabel<Item>;
};

export class FooterGroupCell<Item extends object> implements FooterGroupCellData<Item> {
	type = 'group' as const;
	colspan!: number;
	label!: ColumnLabel<Item>;
	constructor(props: Omit<FooterGroupCellData<Item>, 'type'>) {
		Object.assign(this, props);
	}
}

export type FooterDataCellData<Item extends object> = {
	type: 'data';
	colspan: 1;
	label: ColumnLabel<Item>;
	key: keyof Item;
};

export class FooterDataCell<Item extends object> implements FooterDataCellData<Item> {
	type = 'data' as const;
	colspan = 1 as const;
	label!: ColumnLabel<Item>;
	key!: keyof Item;
	constructor(props: Omit<FooterDataCellData<Item>, 'type' | 'colspan'>) {
		Object.assign(this, props);
	}
}

export type FooterBlankCellData = {
	type: 'blank';
	colspan: 1;
	label: typeof NBSP;
};
class FooterBlankCell implements FooterBlankCellData {
	type = 'blank' as const;
	colspan = 1 as const;
	label = NBSP as typeof NBSP;
}

export const FOOTER_BLANK = new FooterBlankCell();

export type FooterCellData<Item extends object> =
	| FooterGroupCellData<Item>
	| FooterDataCellData<Item>
	| FooterBlankCellData;

export type FooterCell<Item extends object> =
	| FooterGroupCell<Item>
	| FooterDataCell<Item>
	| FooterBlankCell;
