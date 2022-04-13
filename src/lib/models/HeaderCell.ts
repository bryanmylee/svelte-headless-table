import { NBSP } from '$lib/constants';
import type { ColumnLabel } from '$lib/types/ColumnLabel';

export type HeaderCellProps = {
	colspan: number;
};
export interface HeaderCellMethods<Item extends object> {
	getProps: () => HeaderCellProps;
}
export interface HeaderGroupCellData<Item extends object> {
	type: 'group';
	colspan: number;
	label: ColumnLabel<Item>;
}

export class HeaderGroupCell<Item extends object>
	implements HeaderGroupCellData<Item>, HeaderCellMethods<Item>
{
	type = 'group' as const;
	colspan!: number;
	label!: ColumnLabel<Item>;
	constructor(props: Omit<HeaderGroupCellData<Item>, 'type'>) {
		Object.assign(this, props);
	}
	getProps() {
		return {
			colspan: this.colspan,
		};
	}
}

export interface HeaderDataCellData<Item extends object> {
	type: 'data';
	colspan: 1;
	label: ColumnLabel<Item>;
	key: keyof Item;
}

export class HeaderDataCell<Item extends object>
	implements HeaderDataCellData<Item>, HeaderCellMethods<Item>
{
	type = 'data' as const;
	colspan = 1 as const;
	label!: ColumnLabel<Item>;
	key!: keyof Item;
	constructor(props: Omit<HeaderDataCellData<Item>, 'type' | 'colspan'>) {
		Object.assign(this, props);
	}
	getProps() {
		return {
			colspan: this.colspan,
		};
	}
}

export type HeaderBlankCellData = {
	type: 'blank';
	colspan: 1;
	label: typeof NBSP;
};

class HeaderBlankCell implements HeaderBlankCellData, HeaderCellMethods<object> {
	type = 'blank' as const;
	colspan = 1 as const;
	label = NBSP as typeof NBSP;
	getProps() {
		return {
			colspan: this.colspan,
		};
	}
}

export const HEADER_BLANK = new HeaderBlankCell();

export type HeaderCellData<Item extends object> =
	| HeaderGroupCellData<Item>
	| HeaderDataCellData<Item>
	| HeaderBlankCellData;

export type HeaderCell<Item extends object> =
	| HeaderGroupCell<Item>
	| HeaderDataCell<Item>
	| HeaderBlankCell;
