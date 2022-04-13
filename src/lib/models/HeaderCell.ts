import { NBSP } from '$lib/constants';
import type { ColumnLabel } from '$lib/types/ColumnLabel';
import type { RenderProps } from '$lib/types/RenderProps';
import { isFunction } from '$lib/utils/isFunction';

export interface HeaderCellAttrs {
	colspan: number;
}

export interface HeaderCellInit<Item extends object> {
	colspan: number;
	label: ColumnLabel<Item>;
}

export class HeaderCell<Item extends object> implements HeaderCellInit<Item> {
	colspan!: number;
	label!: ColumnLabel<Item>;
	constructor({ colspan, label }: HeaderCellInit<Item>) {
		Object.assign(this, { colspan, label });
	}
	getAttrs(): HeaderCellAttrs {
		return {
			colspan: this.colspan,
		};
	}
	render(): RenderProps {
		if (typeof this.label === 'string') {
			return { text: this.label };
		}
		if (typeof this.label === 'object') {
			return this.label;
		}
		if (isFunction(this.label)) {
			// const label = this.label({ data });
			// if (typeof label === 'string') {
			// 	return { text: label };
			// }
			// return label;
		}
		return {};
	}
}

export class HeaderGroupCell<Item extends object> extends HeaderCell<Item> {
	constructor(init: HeaderCellInit<Item>) {
		super(init);
	}
}

interface HeaderDataCellInit<Item extends object> {
	key: keyof Item;
}

export class HeaderDataCell<Item extends object> extends HeaderCell<Item> {
	key!: keyof Item;
	constructor({ key, label }: Omit<HeaderCellInit<Item>, 'colspan'> & HeaderDataCellInit<Item>) {
		super({ label, colspan: 1 });
		Object.assign(this, { key });
	}
}

export class HeaderBlankCell extends HeaderCell<object> {
	constructor() {
		super({ colspan: 1, label: NBSP });
	}
}

export const HEADER_BLANK = new HeaderBlankCell();
