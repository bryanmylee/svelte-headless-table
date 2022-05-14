import { derived, type Readable } from 'svelte/store';
import type { BodyRow } from './bodyRows';
import type { DataColumn, DisplayColumn, FlatColumn } from './columns';
import { TableComponent } from './tableComponent';
import type { DataLabel, DisplayLabel } from './types/Label';
import type { AnyPlugins } from './types/TablePlugin';
import type { RenderConfig } from './render';

export type BodyCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	id: string;
	row: BodyRow<Item, Plugins>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type BodyCellAttributes<Item, Plugins extends AnyPlugins = AnyPlugins> = Record<
	string,
	never
>;

export abstract class BodyCell<
	Item,
	Plugins extends AnyPlugins = AnyPlugins
> extends TableComponent<Item, Plugins, 'tbody.tr.td'> {
	abstract column: FlatColumn<Item, Plugins>;
	row: BodyRow<Item, Plugins>;
	constructor({ id, row }: BodyCellInit<Item, Plugins>) {
		super({ id });
		this.row = row;
	}

	abstract render(): RenderConfig;

	abstract attrs(): Readable<BodyCellAttributes<Item, Plugins>>;
}

export type DataBodyCellInit<Item, Plugins extends AnyPlugins = AnyPlugins, Value = unknown> = Omit<
	BodyCellInit<Item, Plugins>,
	'id'
> & {
	column: DataColumn<Item, Plugins>;
	label?: DataLabel<Item, Value>;
	value: Value;
};

export type DataBodyCellAttributes<
	Item,
	Plugins extends AnyPlugins = AnyPlugins
> = BodyCellAttributes<Item, Plugins>;

export class DataBodyCell<
	Item,
	Plugins extends AnyPlugins = AnyPlugins,
	Value = unknown
> extends BodyCell<Item, Plugins> {
	column: DataColumn<Item, Plugins>;
	label?: DataLabel<Item, Value>;
	value: Value;
	constructor({ row, column, label, value }: DataBodyCellInit<Item, Plugins, Value>) {
		super({ id: column.id, row });
		this.column = column;
		this.label = label;
		this.value = value;
	}

	render(): RenderConfig {
		if (this.label === undefined) {
			return `${this.value}`;
		}
		return this.label(this.value);
	}

	attrs(): Readable<DataBodyCellAttributes<Item, Plugins>> {
		return derived([], () => {
			return {};
		});
	}
}

export type DisplayBodyCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> = Omit<
	BodyCellInit<Item, Plugins>,
	'id'
> & {
	column: DisplayColumn<Item, Plugins>;
	label: DisplayLabel<Item, Plugins>;
};

export class DisplayBodyCell<Item, Plugins extends AnyPlugins = AnyPlugins> extends BodyCell<
	Item,
	Plugins
> {
	column: DisplayColumn<Item, Plugins>;
	label: DisplayLabel<Item, Plugins>;
	constructor({ row, column, label }: DisplayBodyCellInit<Item, Plugins>) {
		super({ id: column.id, row });
		this.column = column;
		this.label = label;
	}

	render(): RenderConfig {
		if (this.state === undefined) {
			throw new Error('Missing `state` reference');
		}
		return this.label(this.row.id, this.state);
	}

	attrs() {
		return derived([], () => {
			return {};
		});
	}
}
