import { derived, type Readable } from 'svelte/store';
import type { BodyRow } from './bodyRows.js';
import type { DataColumn, DisplayColumn, FlatColumn } from './columns.js';
import { TableComponent } from './tableComponent.js';
import type { DataLabel, DisplayLabel } from './types/Label.js';
import type { AnyPlugins } from './types/TablePlugin.js';
import type { RenderConfig } from 'svelte-render';

export type BodyCellInit<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	id: string;
	row: BodyRow<Item, Plugins>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type BodyCellAttributes<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	role: 'cell';
};

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

	attrs(): Readable<BodyCellAttributes<Item, Plugins>> {
		return derived(super.attrs(), ($baseAttrs) => {
			return {
				...$baseAttrs,
				role: 'cell' as const
			};
		});
	}

	abstract clone(): BodyCell<Item, Plugins>;

	rowColId(): string {
		return `${this.row.id}:${this.column.id}`;
	}

	dataRowColId(): string | undefined {
		if (!this.row.isData()) {
			return undefined;
		}
		return `${this.row.dataId}:${this.column.id}`;
	}

	// TODO Workaround for https://github.com/vitejs/vite/issues/9528
	isData(): this is DataBodyCell<Item, Plugins> {
		return '__data' in this;
	}

	// TODO Workaround for https://github.com/vitejs/vite/issues/9528
	isDisplay(): this is DisplayBodyCell<Item, Plugins> {
		return '__display' in this;
	}
}

export type DataBodyCellInit<Item, Plugins extends AnyPlugins = AnyPlugins, Value = unknown> = Omit<
	BodyCellInit<Item, Plugins>,
	'id'
> & {
	column: DataColumn<Item, Plugins>;
	label?: DataLabel<Item, Plugins, Value>;
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
	// TODO Workaround for https://github.com/vitejs/vite/issues/9528
	__data = true;

	column: DataColumn<Item, Plugins>;
	label?: DataLabel<Item, Plugins, Value>;
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
		if (this.state === undefined) {
			throw new Error('Missing `state` reference');
		}
		return this.label(this as DataBodyCell<Item, AnyPlugins, Value>, this.state);
	}

	clone(): DataBodyCell<Item, Plugins> {
		const clonedCell = new DataBodyCell({
			row: this.row,
			column: this.column,
			label: this.label,
			value: this.value
		});
		return clonedCell;
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
	// TODO Workaround for https://github.com/vitejs/vite/issues/9528
	__display = true;

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
		return this.label(this, this.state);
	}

	clone(): DisplayBodyCell<Item, Plugins> {
		const clonedCell = new DisplayBodyCell({
			row: this.row,
			column: this.column,
			label: this.label
		});
		return clonedCell;
	}
}
