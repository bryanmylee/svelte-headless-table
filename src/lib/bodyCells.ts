import type { BodyRow } from './bodyRows';
import type { DataColumn } from './columns';
import type { Label } from './types/Label';
import type { RenderProps } from './types/RenderProps';

export interface BodyCellInit<Item, Value = unknown> {
	row: BodyRow<Item>;
	column: DataColumn<Item>;
	label?: Label<Item, Value>;
	value: Value;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-interface
export interface BodyCellAttributes<Item> {}

export class BodyCell<Item, Value = unknown> {
	row: BodyRow<Item>;
	column: DataColumn<Item>;
	label?: Label<Item, Value>;
	value: Value;
	constructor({ row, column, label, value }: BodyCellInit<Item, Value>) {
		this.row = row;
		this.column = column;
		this.label = label;
		this.value = value;
	}
	attrs(): BodyCellAttributes<Item> {
		return {};
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
