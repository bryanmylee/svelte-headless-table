import { derived } from 'svelte/store';
import type { BodyRow } from './bodyRows';
import type { DataColumn } from './columns';
import { TableComponent } from './tableComponent';
import type { Label } from './types/Label';
import type { AnyTablePropSet, TablePropSet } from './types/UseTablePlugin';
import type { RenderProps } from './types/RenderProps';

export interface BodyCellInit<Item, Value = unknown> {
	row: BodyRow<Item>;
	column: DataColumn<Item>;
	label?: Label<Item, Value>;
	value: Value;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-interface
export interface BodyCellAttributes<Item> {}

export class BodyCell<
	Item,
	Value = unknown,
	E extends TablePropSet = AnyTablePropSet
> extends TableComponent<Item, 'tbody.tr.td', E> {
	row: BodyRow<Item>;
	column: DataColumn<Item>;
	label?: Label<Item, Value>;
	value: Value;
	constructor({ row, column, label, value }: BodyCellInit<Item, Value>) {
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

	render(): RenderProps {
		if (this.label === undefined) {
			return {
				text: `${this.value}`,
			};
		}
		const label = this.label(this.value);
		if (typeof label === 'string') {
			return {
				text: label,
			};
		}
		return label;
	}
}
