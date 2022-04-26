import { NBSP } from './constants';
import type { AggregateLabel } from './types/AggregateLabel';
import type { RenderProps } from './types/RenderProps';

export interface HeaderCellInit<Item> {
	label: AggregateLabel<Item>;
	colspan: number;
}

export interface HeaderCellAttributes<Item> {
	colspan: number;
}
export class HeaderCell<Item> {
	label: AggregateLabel<Item>;
	colspan: number;
	constructor({ label, colspan }: HeaderCellInit<Item>) {
		this.label = label;
		this.colspan = colspan;
	}
	attrs(): HeaderCellAttributes<Item> {
		return {
			colspan: this.colspan,
		};
	}
	render(): RenderProps {
		if (typeof this.label === 'string') {
			return {
				text: this.label,
			};
		}
		return {
			text: 'Work in progress',
		};
	}
}

/**
 * `DataHeaderCellInit` should match non-inherited `DataColumn` class properties.
 */
export interface DataHeaderCellInit<Item> extends Omit<HeaderCellInit<Item>, 'colspan'> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
	id: string;
}

export class DataHeaderCell<Item> extends HeaderCell<Item> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
	id: string;
	constructor({ label, accessorKey, accessorFn, id }: DataHeaderCellInit<Item>) {
		super({ label, colspan: 1 });
		this.accessorKey = accessorKey;
		this.accessorFn = accessorFn;
		this.id = id;
	}
}

/**
 * `GroupHeaderCellInit` should match non-inherited `GroupColumn` class properties
 * except columns.
 */
export interface GroupHeaderCellInit<Item> extends HeaderCellInit<Item> {
	ids: Array<string>;
}

export class GroupHeaderCell<Item> extends HeaderCell<Item> {
	ids: Array<string>;
	constructor({ label, colspan, ids }: GroupHeaderCellInit<Item>) {
		super({ label, colspan });
		this.ids = ids;
	}
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DisplayHeaderCellInit<Item> extends Partial<HeaderCellInit<Item>> {}

export class DisplayHeaderCell<Item> extends HeaderCell<Item> {
	constructor({ label = NBSP, colspan = 1 }: DisplayHeaderCellInit<Item> = {}) {
		super({ label, colspan });
	}
}
