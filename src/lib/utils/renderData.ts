import type { DataCell } from '$lib/types/DataCell';
import type { RenderProps } from '$lib/types/RenderProps';
import { isFunction } from './isFunction';

export const renderData = <Item extends object>(cell: DataCell<Item>): RenderProps => {
	if (cell.label === undefined) {
		return { text: `${cell.value}` };
	}
	if (isFunction(cell.label)) {
		const label = cell.label({ value: cell.value });
		if (typeof label === 'string') {
			return { text: label };
		}
		return label;
	}
	return {};
};
