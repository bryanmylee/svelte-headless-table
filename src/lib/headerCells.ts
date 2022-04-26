import { NBSP } from './constants';
import type { ActionReturnType } from './types/Action';
import type { AggregateLabel } from './types/AggregateLabel';
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
export class HeaderCell<Item> {
	id: string;
	label: AggregateLabel<Item>;
	colspan: number;
	constructor({ id, label, colspan }: HeaderCellInit<Item>) {
		this.id = id;
		this.label = label;
		this.colspan = colspan;
	}
	attrs(): HeaderCellAttributes<Item> {
		return {
			colspan: this.colspan,
		};
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
	action(node: HTMLTableCellElement): ActionReturnType {
		const onClick = () => {
			console.log('action onClicked');
		};
		node.addEventListener('click', onClick);
		return {
			destroy() {
				console.log('destroying action');
				node.removeEventListener('click', onClick);
			},
		};
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
	allIds: Array<string>;
	ids: Array<string>;
}

export class GroupHeaderCell<Item> extends HeaderCell<Item> {
	allIds: Array<string>;
	ids: Array<string>;
	constructor({ label, colspan, allIds, ids }: GroupHeaderCellInit<Item>) {
		super({ id: ids.join(','), label, colspan });
		this.allIds = allIds;
		this.ids = ids;
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
