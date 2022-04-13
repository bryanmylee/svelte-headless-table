import type { FooterCell } from '$lib/types/FooterCell';
import type { RenderProps } from '$lib/types/RenderProps';
import { isFunction } from './isFunction';

export type RenderFooterProps<Item extends object> = {
	data?: Item[];
};

export const renderFooter = <Item extends object>(
	cell: FooterCell<Item>,
	{ data }: RenderFooterProps<Item> = {}
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
