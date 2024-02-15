import type { EventHandler } from 'svelte/elements';
import type { HeaderCell } from '../headerCells.js';
import type { NewTableAttributeSet, NewTablePropSet, TablePlugin } from '../types/TablePlugin.js';
import { derived, writable, type Writable, get } from 'svelte/store';

export interface AddAlignedColumnsConfig {
	defaultAlignment?: ColumnAlignment;
	toggleOrder?: ColumnAlignment[];
}

export interface AlignmentKey {
	id: string;
	alignment: ColumnAlignment;
}

const DEFAULT_TOGGLE_ORDER: ColumnAlignment[] = [null, 'left', 'center', 'right'];

export type ColumnAlignmentOption = 'left' | 'right' | 'center' | null;

export type ColumnAlignment =
	| ColumnAlignmentOption
	| {
			head?: ColumnAlignmentOption;
			body?: ColumnAlignmentOption;
	  };

export type AlignmentSpan = 'head' | 'body' | 'both';

export type AlignedColumnsState = {
	alignments: Writable<Record<string, ColumnAlignment | undefined>>;
};

export type AlignedColumnsColumnOptions = {
	alignment?: ColumnAlignment;

	disable?: boolean;
};

export type AlignedColumnsPropSet = NewTablePropSet<{
	'thead.tr.th': {
		alignment?: ColumnAlignment;
		toggle: (node: Element) => void;
		clear: (node: Element) => void;
		disabled: boolean;
	};
	'tbody.tr.td': {
		alignment?: ColumnAlignment;
	};
}>;

export type AlignedColumnsAttributeSet = NewTableAttributeSet<{
	'thead.tr.th': {
		style?: {
			'text-align': ColumnAlignment;
		};
	};
	'tbody.tr.td': {
		style?: { 'text-align': ColumnAlignment };
	};
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isCellDisabled = (cell: HeaderCell<any>, disabledIds: string[]) => {
	if (disabledIds.includes(cell.id)) return true;
	return false;
};

type ColumnsAlignmentState = Record<string, ColumnAlignment | undefined>;

export const addAlignedColumns =
	<Item>({
		defaultAlignment,
		toggleOrder = DEFAULT_TOGGLE_ORDER,
	}: AddAlignedColumnsConfig = {}): TablePlugin<
		Item,
		AlignedColumnsState,
		AlignedColumnsColumnOptions,
		AlignedColumnsPropSet,
		AlignedColumnsAttributeSet
	> =>
	({ columnOptions }) => {
		const disabledAlignIds = Object.entries(columnOptions)
			.filter(([, option]) => option.disable === true)
			.map(([columnId]) => columnId);

		const initialAlignments = Object.fromEntries(
			Object.entries(columnOptions).map(([columnId, { alignment, disable }]) => [
				columnId,
				!disable ? (alignment !== undefined ? alignment : defaultAlignment) : undefined,
			]),
		);

		const columnsAlignments = writable<ColumnsAlignmentState>(initialAlignments);

		// ! `initialAlignments` follows `columnsAlignments` updates, how do i stop that ??
		const ogAlignments = structuredClone(initialAlignments);

		const pluginState: AlignedColumnsState = { alignments: columnsAlignments };

		return {
			pluginState,
			columnOptions, // ? needed or useful ?
			hooks: {
				'thead.tr.th': (cell) => {
					const onToggle = (e: Event) => {
						e.stopPropagation();

						// TODO: deal with objects

						columnsAlignments.update((ca) => {
							let currentIndex = toggleOrder.findIndex((alignment) => alignment === ca[cell.id]);
							if (currentIndex === toggleOrder.length - 1) currentIndex = -1;
							ca[cell.id] = toggleOrder[currentIndex + 1];

							console.log('initial :', initialAlignments);
							return ca;
						});
					};

					const onClear = (e: Event) => {
						e.stopPropagation();

						// TODO: deal with objects

						columnsAlignments.update((ca) => {
							console.log('clear, cell :', cell.id, ca[cell.id], initialAlignments[cell.id]);

							ca[cell.id] = ogAlignments[cell.id];
							return ca;
						});
					};

					//   const alignment = get(columnsAlignments)[cell.id];
					const props = derived(columnsAlignments, ($columnsAlignments) => {
						const toggle = (node: Element) => {
							node.addEventListener('click', onToggle);
							return {
								destroy() {
									node.removeEventListener('click', onToggle);
								},
							};
						};
						const clear = (node: Element) => {
							node.addEventListener('click', onClear);
							return {
								destroy() {
									node.removeEventListener('click', onClear);
								},
							};
						};
						const disabled = isCellDisabled(cell, disabledAlignIds);

						return {
							alignment: $columnsAlignments[cell.id],
							toggle,
							clear,
							disabled,
						};
					});

					const attrs = derived(columnsAlignments, ($columnsAlignment) => {
						const alignment = $columnsAlignment[cell.id];

						const alignmentStr = typeof alignment === 'string' ? alignment : alignment?.head;

						return alignmentStr
							? {
									style: {
										'text-align': alignmentStr,
									},
								}
							: {};
					});
					return { props, attrs };
				},
				'tbody.tr.td': (cell) => {
					const attrs = derived(columnsAlignments, ($columnsAlignment) => {
						const alignment = $columnsAlignment[cell.id];
						const alignmentStr = typeof alignment === 'string' ? alignment : alignment?.body;

						return alignmentStr
							? {
									style: {
										'text-align': alignmentStr,
									},
								}
							: {};
					});
					return { attrs };
				},
			},
		};
	};
