import { NBSP } from '$lib/constants';
import type { ColumnLabel } from '$lib/types/ColumnLabel';
import type { RenderProps } from '$lib/types/RenderProps';
import { isFunction } from '$lib/utils/isFunction';
import type { TableInstance } from './TableInstance';

export interface HeaderCellAttributes {
	colspan: number;
}

export interface HeaderCellInit<Item extends object> {
	table: TableInstance<Item>;
	colspan: number;
	label: ColumnLabel<Item>;
	key: keyof Item | (keyof Item)[];
}

export class HeaderCell<Item extends object> implements HeaderCellInit<Item> {
	table!: TableInstance<Item>;
	colspan!: number;
	label!: ColumnLabel<Item>;
	key!: keyof Item | (keyof Item)[];
	constructor({ table, colspan, label, key }: HeaderCellInit<Item>) {
		console.log('init HeaderCell');
		Object.assign(this, { table, colspan, label, key });
	}
	attrs(): HeaderCellAttributes {
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
	constructor({
		table,
		key,
		label,
	}: Omit<HeaderCellInit<Item>, 'colspan'> & HeaderDataCellInit<Item>) {
		super({ table, colspan: 1, label, key });
	}
}

export class HeaderBlankCell<Item extends object> extends HeaderCell<Item> {
	constructor({ table }: Omit<HeaderCellInit<Item>, 'colspan' | 'label' | 'key'>) {
		super({ table, colspan: 1, label: NBSP, key: [] });
	}
}
