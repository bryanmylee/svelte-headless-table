import type { Column } from '$lib/types/Column';
import type { FooterCell } from '$lib/types/FooterCell';
import { getHeaderRows } from './getHeaderRows';

export const getFooterRows = <Item extends object>(
	columns: Column<Item>[]
): FooterCell<Item>[][] => {
	const rows = getHeaderRows(columns);
	rows.reverse();
	return rows;
};
