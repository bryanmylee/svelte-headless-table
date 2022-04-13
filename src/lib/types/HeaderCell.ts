import { NBSP } from '$lib/constants';
import type { ColumnLabel } from './ColumnLabel';

export type HeaderGroupCellData<Item extends object> = {
	type: 'group';
	label: ColumnLabel<Item>;
	colspan: number;
};

export class HeaderGroupCell<Item extends object> implements HeaderGroupCellData<Item> {
	type!: 'group';
	label!: ColumnLabel<Item>;
	colspan!: number;
	constructor(props: HeaderGroupCellData<Item>) {
		Object.assign(this, props);
	}
}

export type HeaderDataCellData<Item extends object> = {
	type: 'data';
	label: ColumnLabel<Item>;
	colspan: 1;
	key: keyof Item;
};

export class HeaderDataCell<Item extends object> implements HeaderDataCellData<Item> {
	type!: 'data';
	label!: ColumnLabel<Item>;
	colspan!: 1;
	key!: keyof Item;
	constructor(props: HeaderDataCellData<Item>) {
		Object.assign(this, props);
	}
}

export type HeaderBlankCellData = {
	type: 'blank';
	label: typeof NBSP;
	colspan: 1;
};

class HeaderBlankCell implements HeaderBlankCellData {
	type!: 'blank';
	label!: typeof NBSP;
	colspan!: 1;
	constructor(props: HeaderBlankCellData) {
		Object.assign(this, props);
	}
}

export const HEADER_BLANK = new HeaderBlankCell({
	type: 'blank',
	label: NBSP,
	colspan: 1,
});

export type HeaderCellData<Item extends object> =
	| HeaderGroupCellData<Item>
	| HeaderDataCellData<Item>
	| HeaderBlankCellData;

export type HeaderCell<Item extends object> =
	| HeaderGroupCell<Item>
	| HeaderDataCell<Item>
	| HeaderBlankCell;
