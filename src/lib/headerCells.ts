import { derived } from 'svelte/store';
import { NBSP } from './constants';
import { TableComponent } from './tableComponent';
import type { AggregateLabel } from './types/AggregateLabel';
import type { AnyTablePropSet, TablePropSet } from './types/plugin';
import type { RenderProps } from './types/RenderProps';

export interface HeaderCellInit<Item> {
	id: string;
	label: AggregateLabel<Item>;
	colspan: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface HeaderCellAttributes<Item> {
	colspan: number;
}
export class HeaderCell<Item, E extends TablePropSet = AnyTablePropSet> extends TableComponent<
	Item,
	'thead.tr.th',
	E
> {
	label: AggregateLabel<Item>;
	colspan: number;
	constructor({ id, label, colspan }: HeaderCellInit<Item>) {
		super({ id });
		this.label = label;
		this.colspan = colspan;
	}

	attrs() {
		return derived([], () => {
			return {
				colspan: this.colspan,
			};
		});
	}

	render(): RenderProps {
		if (this.label instanceof Function) {
			return {
				text: 'Work in progress',
			};
		}
		if (typeof this.label === 'string') {
			return {
				text: this.label,
			};
		}
		return this.label;
	}
}

/**
 * `DataHeaderCellInit` should match non-inherited `DataColumn` class properties.
 */
export interface DataHeaderCellInit<Item> extends Omit<HeaderCellInit<Item>, 'colspan'> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
}

export class DataHeaderCell<Item> extends HeaderCell<Item> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
	constructor({ id, label, accessorKey, accessorFn }: DataHeaderCellInit<Item>) {
		super({ id, label, colspan: 1 });
		this.accessorKey = accessorKey;
		this.accessorFn = accessorFn;
	}
}

/**
 * `GroupHeaderCellInit` should match non-inherited `GroupColumn` class properties
 * except columns.
 */
export interface GroupHeaderCellInit<Item> extends Omit<HeaderCellInit<Item>, 'id'> {
	ids: Array<string>;
	allIds: Array<string>;
}

export class GroupHeaderCell<Item> extends HeaderCell<Item> {
	ids: Array<string>;
	allId: string;
	allIds: Array<string>;
	constructor({ label, colspan, ids, allIds }: GroupHeaderCellInit<Item>) {
		super({ id: ids.join(','), label, colspan });
		this.ids = ids;
		this.allId = allIds.join(',');
		this.allIds = allIds;
	}
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DisplayHeaderCellInit<Item>
	extends Pick<HeaderCellInit<Item>, 'id'>,
		Partial<Omit<HeaderCellInit<Item>, 'id'>> {}

export class DisplayHeaderCell<Item> extends HeaderCell<Item> {
	constructor({ id, label = NBSP, colspan = 1 }: DisplayHeaderCellInit<Item>) {
		super({ id, label, colspan });
	}
}
