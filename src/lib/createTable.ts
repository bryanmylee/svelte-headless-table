import type { Writable } from 'svelte/store';
import {
	DataColumn,
	getFlatColumnIds,
	GroupColumn,
	type Column,
	type DataColumnInit,
	type DataColumnInitBase,
	type DataColumnInitFnAndId,
	type DataColumnInitIdAndKey,
	type DataColumnInitKey,
	type GroupColumnInit,
} from './columns';
import type { UseTablePlugin } from './types/UseTablePlugin';
import { getDuplicates } from './utils/array';

export interface CreateTableProps<Item> {
	data: Writable<Item[]>;
}

export type TablePlugins<Item> = Record<string, UseTablePlugin<Item, unknown>>;

export class Table<Item, Plugins extends TablePlugins<Item>> {
	createColumns(columns: Column<Item>[]): Column<Item>[] {
		const ids = getFlatColumnIds(columns);
		const duplicateIds = getDuplicates(ids);
		if (duplicateIds.length !== 0) {
			throw new Error(`Duplicate column ids not allowed: "${duplicateIds.join('", "')}"`);
		}
		return columns;
	}
	// `accessorKey` only
	column<Id extends Exclude<keyof Item, symbol>>(
		def: DataColumnInitBase<Item, Item[Id]> & DataColumnInitKey<Item, Id>
	): DataColumn<Item, `${Id}`, Item[Id]>;
	// `accessorKey` and `id`
	column<Id extends string, Key extends keyof Item>(
		def: DataColumnInitBase<Item, Item[Key]> & DataColumnInitIdAndKey<Item, Id, Key>
	): DataColumn<Item, Id, Item[Key]>;
	// `accessorFn` and `id`
	column<Id extends string, Value>(
		def: DataColumnInitBase<Item, Value> & DataColumnInitFnAndId<Item, Id, Value>
	): DataColumn<Item, Id, Value>;
	column<Id extends string, Value>(def: DataColumnInit<Item, Id, Value>) {
		return new DataColumn(def);
	}
	group(def: GroupColumnInit<Item>): GroupColumn<Item> {
		return new GroupColumn(def);
	}
}

export const createTable = <Item, Plugins extends Record<string, UseTablePlugin<Item, unknown>>>(
	{ data }: CreateTableProps<Item>,
	plugins: Plugins = {} as any
): Table<Item, Plugins> => {
	return new Table<Item, Plugins>();
};
