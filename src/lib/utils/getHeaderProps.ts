import type { HeaderCell } from '$lib/types/HeaderCell';

export type HeaderProps = {
	colspan: number;
};

export const getHeaderProps = <Item extends object>(cell: HeaderCell<Item>): HeaderProps => {
	return {
		colspan: cell.colspan,
	};
};
