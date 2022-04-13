import { NBSP } from '$lib/constants';
import type { ColumnLabel } from '$lib/types/ColumnLabel';
import type { RenderProps } from '$lib/types/RenderProps';
import { isFunction } from '$lib/utils/isFunction';

export interface FooterCellAttrs {
	colspan: number;
}

export interface FooterCellInit<Item extends object> {
	colspan: number;
	label: ColumnLabel<Item>;
}

export class FooterCell<Item extends object> implements FooterCellInit<Item> {
	colspan!: number;
	label!: ColumnLabel<Item>;
	constructor({ colspan, label }: FooterCellInit<Item>) {
		Object.assign(this, { colspan, label });
	}
	getAttrs(): FooterCellAttrs {
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

export class FooterGroupCell<Item extends object> extends FooterCell<Item> {
	constructor(init: FooterCellInit<Item>) {
		super(init);
	}
}

interface FooterDataCellInit<Item extends object> {
	key: keyof Item;
}

export class FooterDataCell<Item extends object> extends FooterCell<Item> {
	key!: keyof Item;
	constructor({ key, label }: Omit<FooterCellInit<Item>, 'colspan'> & FooterDataCellInit<Item>) {
		super({ label, colspan: 1 });
		Object.assign(this, { key });
	}
}

export class FooterBlankCell extends FooterCell<object> {
	constructor() {
		super({ colspan: 1, label: NBSP });
	}
}

export const FOOTER_BLANK = new FooterBlankCell();
