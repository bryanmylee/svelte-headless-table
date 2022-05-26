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
	constructor({ id, label, colspan }: HeaderCellInit<Item>) {
		super({ id });
		this.label = label;
		this.colspan = colspan;
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
	constructor({ id, label }: FlatHeaderCellInit<Item, Plugins>) {
		super({ id, label, colspan: 1 });
	}

	clone(): FlatHeaderCell<Item, Plugins> {
		return new FlatHeaderCell({
			id: this.id,
			label: this.label,
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
	constructor({ id, label, accessorKey, accessorFn }: DataHeaderCellInit<Item, Plugins>) {
		super({ id, label });
		this.accessorKey = accessorKey;
		this.accessorFn = accessorFn;
	}

	clone(): DataHeaderCell<Item, Plugins> {
		return new DataHeaderCell({
			id: this.id,
			label: this.label,
			accessorFn: this.accessorFn,
			accessorKey: this.accessorKey,
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
	constructor({ id, label = NBSP }: FlatDisplayHeaderCellInit<Item, Plugins>) {
		super({ id, label });
	}

	clone(): FlatDisplayHeaderCell<Item, Plugins> {
		return new FlatDisplayHeaderCell({
			id: this.id,
			label: this.label,
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
	constructor({ label, colspan, ids, allIds }: GroupHeaderCellInit<Item, Plugins>) {
		super({ id: `[${ids.join(',')}]`, label, colspan });
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
			colspan: this.colspan,
			ids: this.ids,
			allIds: this.allIds,
		});
	}
}

export type DisplayHeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> = Omit<
	HeaderCellInit<Item, Plugins>,
	'label' | 'colspan'
> & {
	label?: HeaderLabel<Item>;
	colspan?: number;
};

export class DisplayHeaderCell<Item, Plugins extends AnyPlugins = AnyPlugins> extends HeaderCell<
	Item,
	Plugins
> {
	constructor({ id, label = NBSP, colspan = 1 }: DisplayHeaderCellInit<Item, Plugins>) {
		super({ id, label, colspan });
	}

	clone(): DisplayHeaderCell<Item, Plugins> {
		return new DisplayHeaderCell({
			id: this.id,
			label: this.label,
			colspan: this.colspan,
		});
	}
}
