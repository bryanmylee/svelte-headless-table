import { derived } from 'svelte/store';
import { NBSP } from './constants';
import { TableComponent } from './tableComponent';
import type { HeaderLabel } from './types/Label';
import type { AnyPlugins } from './types/TablePlugin';
import type { RenderConfig } from './render';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type HeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	id: string;
	isFlat?: boolean;
	isData?: boolean;
	label: HeaderLabel<Item>;
	colspan: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type HeaderCellAttributes<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	colspan: number;
};
export class HeaderCell<Item, Plugins extends AnyPlugins = AnyPlugins> extends TableComponent<
	Item,
	Plugins,
	'thead.tr.th'
> {
	isFlat: boolean;
	isData: boolean;
	label: HeaderLabel<Item>;
	colspan: number;
	constructor({ id, label, colspan, isFlat = false, isData = false }: HeaderCellInit<Item>) {
		super({ id });
		this.isFlat = isFlat;
		this.isData = isData;
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
		return derived([], () => {
			return {
				colspan: this.colspan,
			};
		});
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type FlatHeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> = Omit<
	HeaderCellInit<Item, Plugins>,
	'isFlat' | 'colspan'
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
	constructor({ id, label, isData }: FlatHeaderCellInit<Item, Plugins>) {
		super({ id, label, isData, colspan: 1, isFlat: true });
	}
}

export type DataHeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> = Omit<
	FlatHeaderCellInit<Item, Plugins>,
	'isData'
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
		super({ id, label, isData: true });
		this.accessorKey = accessorKey;
		this.accessorFn = accessorFn;
	}
}

export type DisplayHeaderCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> = Omit<
	FlatHeaderCellInit<Item, Plugins>,
	'isData' | 'label'
> & {
	label?: HeaderLabel<Item>;
};

export class DisplayHeaderCell<
	Item,
	Plugins extends AnyPlugins = AnyPlugins
> extends FlatHeaderCell<Item, Plugins> {
	constructor({ id, label = NBSP }: DisplayHeaderCellInit<Item, Plugins>) {
		super({ id, label });
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
}
