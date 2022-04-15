import { NBSP } from '$lib/constants';
import type { ColumnLabel } from '$lib/types/ColumnLabel';
import type { RenderProps } from '$lib/types/RenderProps';
import { isFunction } from '$lib/utils/isFunction';
import type { TableInstance } from './TableInstance';

export interface FooterCellAttributes {
	colspan: number;
}

export interface FooterCellInit<Item extends object> {
	table: TableInstance<Item>;
	colspan: number;
	label: ColumnLabel<Item>;
}

export class FooterCell<Item extends object> implements FooterCellInit<Item> {
	table!: TableInstance<Item>;
	colspan!: number;
	label!: ColumnLabel<Item>;
	constructor({ table, colspan, label }: FooterCellInit<Item>) {
		Object.assign(this, { table, colspan, label });
	}
	attrs(): FooterCellAttributes {
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
			const label = this.label(this.table);
			if (typeof label === 'string') {
				return { text: label };
			}
			return label;
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
	constructor({
		table,
		key,
		label,
	}: Omit<FooterCellInit<Item>, 'colspan'> & FooterDataCellInit<Item>) {
		super({ table, label, colspan: 1 });
		Object.assign(this, { key });
	}
}

export class FooterBlankCell<Item extends object> extends FooterCell<Item> {
	constructor({ table }: Omit<FooterCellInit<Item>, 'colspan' | 'label'>) {
		super({ table, colspan: 1, label: NBSP });
	}
}
