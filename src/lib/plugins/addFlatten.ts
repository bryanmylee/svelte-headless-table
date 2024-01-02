import type { BodyRow } from '../bodyRows.js';
import type { DeriveRowsFn, NewTablePropSet, TablePlugin } from '../types/TablePlugin.js';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface FlattenConfig {
	initialDepth?: number;
}

export interface FlattenState {
	depth: Writable<number>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-interface
export interface FlattenColumnOptions<Item> {}

export type FlattenPropSet = NewTablePropSet<{
	'tbody.tr.td': {
		flatten: (depth: number) => void;
		unflatten: () => void;
	};
}>;

export const getFlattenedRows = <Item, Row extends BodyRow<Item>>(
	rows: Row[],
	depth: number
): Row[] => {
	if (depth === 0) return rows;
	const flattenedRows: Row[] = [];
	for (const row of rows) {
		if (row.subRows === undefined) continue;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		flattenedRows.push(...(getFlattenedRows(row.subRows as any, depth - 1) as Row[]));
	}
	return flattenedRows;
};

export const addFlatten =
	<Item>({ initialDepth = 0 }: FlattenConfig = {}): TablePlugin<
		Item,
		FlattenState,
		FlattenColumnOptions<Item>,
		FlattenPropSet
	> =>
	() => {
		const depth = writable(initialDepth);
		const pluginState: FlattenState = { depth };
		const deriveRows: DeriveRowsFn<Item> = (rows) => {
			return derived([rows, depth], ([$rows, $depth]) => {
				return getFlattenedRows<Item, (typeof $rows)[number]>($rows, $depth);
			});
		};

		return {
			pluginState,
			deriveRows,
			hooks: {
				'tbody.tr.td': () => {
					const props: Readable<FlattenPropSet['tbody.tr.td']> = derived([], () => {
						const flatten = ($depth: number) => {
							depth.set($depth);
						};
						const unflatten = () => flatten(0);
						return { flatten, unflatten };
					});
					return { props };
				},
			},
		};
	};
