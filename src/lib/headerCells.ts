import { derived } from 'svelte/store';
import { NBSP } from './constants';
import { TableComponent } from './tableComponent';
import type { HeaderLabel } from './types/Label';
import type { AnyPlugins } from './types/TablePlugin';
import type { RenderConfig } from './render';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type HeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	id: string;
	label: HeaderLabel<Item>;
	colspan: number;
	colstart: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type HeaderCellAttributes<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	role: 'columnheader';
	colspan: number;
};

export abstract class HeaderCell<
	Item,
	Plugins extends AnyPlugins = AnyPlugins
> extends TableComponent<Item, Plugins, 'thead.tr.th'> {
	label: HeaderLabel<Item>;
	colspan: number;
	colstart: number;
	constructor({ id, label, colspan, colstart }: HeaderCellInit<Item>) {
		super({ id });
		this.label = label;
		this.colspan = colspan;
		this.colstart = colstart;
	}

	render(): RenderConfig {
		if (this.label instanceof Function) {
			if (this.state === undefined) {
				throw new Error('Missing `state` reference');
			}
			return this.label(this.state);
		}
		return this.label;
	}

	attrs() {
		return derived(super.attrs(), ($baseAttrs) => {
			return {
				...$baseAttrs,
				role: 'columnheader' as const,
				colspan: this.colspan,
			};
		});
	}

	abstract clone(): HeaderCell<Item, Plugins>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type FlatHeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> = Omit<
	HeaderCellInit<Item, Plugins>,
	'colspan'
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type FlatHeaderCellAttributes<
	Item,
	Plugins extends AnyPlugins = AnyPlugins
> = HeaderCellAttributes<Item, Plugins>;

export class FlatHeaderCell<Item, Plugins extends AnyPlugins = AnyPlugins> extends HeaderCell<
	Item,
	Plugins
> {
	constructor({ id, label, colstart }: FlatHeaderCellInit<Item, Plugins>) {
		super({ id, label, colspan: 1, colstart });
	}

	clone(): FlatHeaderCell<Item, Plugins> {
		return new FlatHeaderCell({
			id: this.id,
			label: this.label,
			colstart: this.colstart,
		});
	}
}

export type DataHeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> = FlatHeaderCellInit<
	Item,
	Plugins
> & {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
};

export class DataHeaderCell<Item, Plugins extends AnyPlugins = AnyPlugins> extends FlatHeaderCell<
	Item,
	Plugins
> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
	constructor({ id, label, accessorKey, accessorFn, colstart }: DataHeaderCellInit<Item, Plugins>) {
		super({ id, label, colstart });
		this.accessorKey = accessorKey;
		this.accessorFn = accessorFn;
	}

	clone(): DataHeaderCell<Item, Plugins> {
		return new DataHeaderCell({
			id: this.id,
			label: this.label,
			accessorFn: this.accessorFn,
			accessorKey: this.accessorKey,
			colstart: this.colstart,
		});
	}
}

export type FlatDisplayHeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> = Omit<
	FlatHeaderCellInit<Item, Plugins>,
	'label'
> & {
	label?: HeaderLabel<Item>;
};

export class FlatDisplayHeaderCell<
	Item,
	Plugins extends AnyPlugins = AnyPlugins
> extends FlatHeaderCell<Item, Plugins> {
	constructor({ id, label = NBSP, colstart }: FlatDisplayHeaderCellInit<Item, Plugins>) {
		super({ id, label, colstart });
	}

	clone(): FlatDisplayHeaderCell<Item, Plugins> {
		return new FlatDisplayHeaderCell({
			id: this.id,
			label: this.label,
			colstart: this.colstart,
		});
	}
}

export type GroupHeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> = Omit<
	HeaderCellInit<Item, Plugins>,
	'id'
> & {
	ids: string[];
	allIds: string[];
};

export class GroupHeaderCell<Item, Plugins extends AnyPlugins = AnyPlugins> extends HeaderCell<
	Item,
	Plugins
> {
	ids: string[];
	allId: string;
	allIds: string[];
	constructor({ label, ids, allIds, colspan, colstart }: GroupHeaderCellInit<Item, Plugins>) {
		super({ id: `[${ids.join(',')}]`, label, colspan, colstart });
		this.ids = ids;
		this.allId = `[${allIds.join(',')}]`;
		this.allIds = allIds;
	}

	setIds(ids: string[]) {
		this.ids = ids;
		this.id = `[${this.ids.join(',')}]`;
	}

	pushId(id: string) {
		this.ids = [...this.ids, id];
		this.id = `[${this.ids.join(',')}]`;
	}

	clone(): GroupHeaderCell<Item, Plugins> {
		return new GroupHeaderCell({
			label: this.label,
			ids: this.ids,
			allIds: this.allIds,
			colspan: this.colspan,
			colstart: this.colstart,
		});
	}
}

export type GroupDisplayHeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> = Omit<
	GroupHeaderCellInit<Item, Plugins>,
	'label' | 'colspan'
> & {
	label?: HeaderLabel<Item>;
	colspan?: number;
};

export class GroupDisplayHeaderCell<
	Item,
	Plugins extends AnyPlugins = AnyPlugins
> extends GroupHeaderCell<Item, Plugins> {
	constructor({
		label = NBSP,
		ids,
		allIds,
		colspan = 1,
		colstart,
	}: GroupDisplayHeaderCellInit<Item, Plugins>) {
		super({ label, ids, allIds, colspan, colstart });
	}

	clone(): GroupDisplayHeaderCell<Item, Plugins> {
		return new GroupDisplayHeaderCell({
			label: this.label,
			ids: this.ids,
			allIds: this.allIds,
			colspan: this.colspan,
			colstart: this.colstart,
		});
	}
}
