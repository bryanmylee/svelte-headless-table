import type { DataCell } from '$lib/types/DataCell';
import type { HeaderCell } from '$lib/types/HeaderCell';
import type { RenderProps } from '$lib/types/RenderProps';
import { isFunction } from './isFunction';

export type RenderHeaderProps<Item extends object> = {
	dataRows?: DataCell<Item>[][];
};

export const renderHeader = <Item extends object>(
	cell: HeaderCell<Item>,
	{ dataRows }: RenderHeaderProps<Item> = {}
): RenderProps => {
	if (typeof cell.label === 'string') {
		return { text: cell.label };
	}
	if (typeof cell.label === 'object') {
		return cell.label;
	}
	if (isFunction(cell.label)) {
		if (dataRows === undefined) {
			throw new Error('rows required for dynamic render');
		}
		const label = cell.label(dataRows);
		if (typeof label === 'string') {
			return { text: label };
		}
		return label;
	}
	return {};
};
