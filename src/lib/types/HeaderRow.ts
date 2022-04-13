import type { HeaderCell } from './HeaderCell';

export type HeaderRow<Item extends object> = {
	cells: HeaderCell<Item>[];
};
