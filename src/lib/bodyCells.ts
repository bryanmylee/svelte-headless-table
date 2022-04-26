import type { Label } from './types/Label';
import type { RenderProps } from './types/RenderProps';

export interface BodyCellInit<Item, Value> {
	label: Label<Item, Value>;
	value: Value;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-interface
export interface BodyCellAttributes<Item> {}

export class BodyCell<Item, Value> {
	label: Label<Item, Value>;
	value: Value;
	constructor({ label, value }: BodyCellInit<Item, Value>) {
		this.label = label;
		this.value = value;
	}
	attrs(): BodyCellAttributes<Item> {
		return {};
	}
	render(): RenderProps {
		const label = this.label(this.value);
		if (typeof label === 'string') {
			return {
				text: label,
			};
		}
		return label;
	}
}
