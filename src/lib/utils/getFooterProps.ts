import type { FooterCell } from '$lib/types/FooterCell';

export type FooterProps = {
	colspan: number;
};

export const getFooterProps = <Item extends object>(cell: FooterCell<Item>): FooterProps => {
	return {
		colspan: cell.colspan,
	};
};
