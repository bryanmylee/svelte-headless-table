import type { HeaderCell } from '$lib/types/HeaderCell';
import type { RenderProps } from '$lib/types/RenderProps';
import { isFunction } from './isFunction';

export type RenderHeaderProps<Item extends object> = {
	data?: Item[];
};

export const renderHeader = <Item extends object>(
	cell: HeaderCell<Item>,
	{ data }: RenderHeaderProps<Item> = {}
): RenderProps => {
	if (typeof cell.label === 'string') {
		return { text: cell.label };
	}
	if (typeof cell.label === 'object') {
		return cell.label;
	}
	if (isFunction(cell.label)) {
		if (data === undefined) {
			throw new Error('data required for dynamic render');
		}
		const label = cell.label({ data });
		if (typeof label === 'string') {
			return { text: label };
		}
		return label;
	}
	return {};
};
