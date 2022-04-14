import { getDataColumns } from '$lib/utils/getDataColumns';
import { getDataRows } from '$lib/utils/getDataRows';
import { getFooterRows } from '$lib/utils/getFooterRows';
import { getHeaderRows } from '$lib/utils/getHeaderRows';
import type { Column, DataColumn } from './Column';
import type { DataRow } from './DataRow';
import type { FooterRow } from './FooterRow';
import type { HeaderRow } from './HeaderRow';

export interface TableInstanceInit<Item extends object> {
	columns: Column<Item>[];
	data: Item[];
}

export class TableInstance<Item extends object> implements TableInstanceInit<Item> {
	columns!: Column<Item>[];
	data!: Item[];
	dataColumns: DataColumn<Item>[];
	headerRows: HeaderRow<Item>[];
	footerRows: FooterRow<Item>[];
	dataRows: DataRow<Item>[];
	constructor({ columns, data }: TableInstanceInit<Item>) {
		Object.assign(this, { columns, data });
		this.dataColumns = getDataColumns(columns);
		this.headerRows = getHeaderRows(this, columns);
		this.footerRows = getFooterRows(columns);
		this.dataRows = getDataRows(data, this.dataColumns);
	}
}
