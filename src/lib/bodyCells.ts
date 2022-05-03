import { derived } from 'svelte/store';
import type { BodyRow } from './bodyRows';
import type { DataColumn } from './columns';
import { TableComponent } from './tableComponent';
import type { Label } from './types/Label';
import type { AnyPlugins } from './types/UseTablePlugin';
import type { RenderConfig } from './render';

export interface BodyCellInit<Item, Plugins extends AnyPlugins = AnyPlugins, Value = unknown> {
	row: BodyRow<Item, Plugins>;
	column: DataColumn<Item, Plugins>;
	label?: Label<Item, Value>;
	value: Value;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-interface
export interface BodyCellAttributes<Item, Plugins extends AnyPlugins = AnyPlugins> {}

export class BodyCell<
	Item,
	Plugins extends AnyPlugins = AnyPlugins,
	Value = unknown
> extends TableComponent<Item, Plugins, 'tbody.tr.td'> {
	row: BodyRow<Item, Plugins>;
	column: DataColumn<Item, Plugins>;
	label?: Label<Item, Value>;
	value: Value;
	constructor({ row, column, label, value }: BodyCellInit<Item, Plugins, Value>) {
		super({ id: column.id });
		this.row = row;
		this.column = column;
		this.label = label;
		this.value = value;
	}

	attrs() {
		return derived([], () => {
			return {};
		});
	}

	render(): RenderConfig {
		if (this.label === undefined) {
			return `${this.value}`;
		}
		return this.label(this.value);
	}
}
