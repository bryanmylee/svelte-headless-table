import type { HeaderCell } from '$lib/types/HeaderCell';
import type { RenderProps } from '$lib/types/RenderProps';

export const renderHeader = <Item extends object>(cell: HeaderCell<Item>): RenderProps => {
	return {
		text: cell.label,
	};
};
