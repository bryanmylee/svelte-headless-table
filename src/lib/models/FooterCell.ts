import { NBSP } from '$lib/constants';
import type { ColumnLabel } from '$lib/types/ColumnLabel';

export type FooterGroupCellData<Item extends object> = {
	type: 'group';
	label: ColumnLabel<Item>;
	colspan: number;
};

export class FooterGroupCell<Item extends object> implements FooterGroupCellData<Item> {
	type!: 'group';
	label!: ColumnLabel<Item>;
	colspan!: number;
	constructor(props: FooterGroupCellData<Item>) {
		Object.assign(this, props);
	}
}

export type FooterDataCellData<Item extends object> = {
	type: 'data';
	label: ColumnLabel<Item>;
	colspan: 1;
	key: keyof Item;
};

export class FooterDataCell<Item extends object> implements FooterDataCellData<Item> {
	type!: 'data';
	label!: ColumnLabel<Item>;
	colspan!: 1;
	key!: keyof Item;
	constructor(props: FooterDataCellData<Item>) {
		Object.assign(this, props);
	}
}

export type FooterBlankCellData = {
	type: 'blank';
	label: typeof NBSP;
	colspan: 1;
};
class FooterBlankCell implements FooterBlankCellData {
	type!: 'blank';
	label!: typeof NBSP;
	colspan!: 1;
	constructor(props: FooterBlankCellData) {
		Object.assign(this, props);
	}
}

export const FOOTER_BLANK = new FooterBlankCell({
	type: 'blank',
	label: NBSP,
	colspan: 1,
});

export type FooterCellData<Item extends object> =
	| FooterGroupCellData<Item>
	| FooterDataCellData<Item>
	| FooterBlankCellData;

export type FooterCell<Item extends object> =
	| FooterGroupCell<Item>
	| FooterDataCell<Item>
	| FooterBlankCell;
