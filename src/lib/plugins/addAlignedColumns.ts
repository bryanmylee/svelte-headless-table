import type { HeaderCell } from '../headerCells.js';
import type { NewTableAttributeSet, NewTablePropSet, TablePlugin } from '../types/TablePlugin.js';
import { derived, writable, type Writable } from 'svelte/store';

export interface AddAlignedColumnsConfig {
	defaultAlignment?: ColumnAlignment;
	toggleOrder?: ColumnAlignment[];
}

export interface AlignmentKey {
	id: string;
	alignment: ColumnAlignment;
}

const DEFAULT_TOGGLE_ORDER: ColumnAlignment[] = [null, 'left', 'center', 'right'];

export type ColumnAlignment = 'left' | 'right' | 'center' | null;

export type AlignmentSpan = 'head' | 'body' | 'both';

export type AlignedColumnsState = {
	alignments: Writable<Record<string, ColumnAlignment | undefined>>;
};

export type AlignedColumnsColumnOptions = {
	alignment?: ColumnAlignment;
	alignHead?: boolean;

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

						const findNext = (currentAlignment: ColumnAlignment) => {
							let currentIndex = toggleOrder.findIndex(
								(alignment) => alignment === currentAlignment,
							);
							if (currentIndex === toggleOrder.length - 1) currentIndex = -1;
							return toggleOrder[currentIndex + 1];
						};

						columnsAlignments.update((ca) => {
							const currentAlignment = ca[cell.id];
							if (currentAlignment !== undefined) {
								ca[cell.id] = findNext(currentAlignment);
							}

							return ca;
						});
					};

					const onClear = (e: Event) => {
						e.stopPropagation();

						columnsAlignments.update((ca) => {
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

						return columnOptions[cell.id]?.alignHead && alignment
							? {
									style: {
										'text-align': alignment,
									},
								}
							: {};
					});
					return { props, attrs };
				},
				'tbody.tr.td': (cell) => {
					const attrs = derived(columnsAlignments, ($columnsAlignment) => {
						const alignment = $columnsAlignment[cell.id];

						return alignment
							? {
									style: {
										'text-align': alignment,
									},
								}
							: {};
					});
					return { attrs };
				},
			},
		};
	};
