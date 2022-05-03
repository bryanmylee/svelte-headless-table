import { derived } from 'svelte/store';
import { NBSP } from './constants';
import { TableComponent } from './tableComponent';
import type { AggregateLabel } from './types/AggregateLabel';
import type { AnyPlugins } from './types/UseTablePlugin';
import type { RenderProps } from './types/RenderProps';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface HeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> {
	id: string;
	label: AggregateLabel<Item>;
	colspan: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface HeaderCellAttributes<Item, Plugins extends AnyPlugins = AnyPlugins> {
	colspan: number;
}
export class HeaderCell<Item, Plugins extends AnyPlugins = AnyPlugins> extends TableComponent<
	Item,
	Plugins,
	'thead.tr.th'
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
export interface DataHeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins>
	extends Omit<HeaderCellInit<Item, Plugins>, 'colspan'> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
}

export class DataHeaderCell<Item, Plugins extends AnyPlugins = AnyPlugins> extends HeaderCell<
	Item,
	Plugins
> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
	constructor({ id, label, accessorKey, accessorFn }: DataHeaderCellInit<Item, Plugins>) {
		super({ id, label, colspan: 1 });
		this.accessorKey = accessorKey;
		this.accessorFn = accessorFn;
	}
}

/**
 * `GroupHeaderCellInit` should match non-inherited `GroupColumn` class properties
 * except columns.
 */
export interface GroupHeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins>
	extends Omit<HeaderCellInit<Item, Plugins>, 'id'> {
	ids: string[];
	allIds: string[];
}

export class GroupHeaderCell<Item, Plugins extends AnyPlugins = AnyPlugins> extends HeaderCell<
	Item,
	Plugins
> {
	ids: string[];
	allId: string;
	allIds: string[];
	constructor({ label, colspan, ids, allIds }: GroupHeaderCellInit<Item, Plugins>) {
		super({ id: ids.join(','), label, colspan });
		this.ids = ids;
		this.allId = allIds.join(',');
		this.allIds = allIds;
	}
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DisplayHeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins>
	extends Pick<HeaderCellInit<Item, Plugins>, 'id'>,
		Partial<Omit<HeaderCellInit<Item, Plugins>, 'id'>> {}

export class DisplayHeaderCell<Item, Plugins extends AnyPlugins = AnyPlugins> extends HeaderCell<
	Item,
	Plugins
> {
	constructor({ id, label = NBSP, colspan = 1 }: DisplayHeaderCellInit<Item, Plugins>) {
		super({ id, label, colspan });
	}
}
