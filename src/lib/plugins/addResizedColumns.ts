import type { NewTableAttributeSet, NewTablePropSet, TablePlugin } from '$lib/types/TablePlugin';
import { keyed } from 'svelte-keyed';
import { derived, writable } from 'svelte/store';

export type ResizedColumnsPropSet = NewTablePropSet<{
	'thead.tr.th': {
		(node: Element): void;
		drag: (event: Event) => void;
	};
}>;

export type ResizedColumnsAttributeSet = NewTableAttributeSet<{
	'thead.tr.th': {
		style?: {
			width: string;
			'min-width': string;
			'max-width': string;
		};
	};
}>;

const getDragXPos = (event: Event): number => {
	if (event instanceof MouseEvent) return event.clientX;
	if (event instanceof TouchEvent) return event.targetTouches[0].pageX;
	return 0;
};

type ColumnsWidthState = {
	current: Record<string, number>;
	start: Record<string, number>;
};

export const addResizedColumns =
	<Item>(): TablePlugin<
		Item,
		Record<string, never>,
		Record<string, never>,
		ResizedColumnsPropSet,
		ResizedColumnsAttributeSet
	> =>
	() => {
		const columnsWidthState = writable<ColumnsWidthState>({
			current: {},
			start: {},
		});
		const columnWidths = keyed(columnsWidthState, 'current');
		const dragStartXPosForId: Record<string, number> = {};
		return {
			pluginState: {},
			hooks: {
				'thead.tr.th': (cell) => {
					const dragStart = (event: Event) => {
						event.stopPropagation();
						event.preventDefault();
						const { target } = event;
						if (target === null) return;
						dragStartXPosForId[cell.id] = getDragXPos(event);
						columnsWidthState.update(($columnsWidthState) => {
							const current = $columnsWidthState.current[cell.id];
							return {
								...$columnsWidthState,
								start: {
									...$columnsWidthState.start,
									[cell.id]: current,
								},
							};
						});
						window.addEventListener('mousemove', dragMove);
						window.addEventListener('mouseup', dragEnd);
					};
					const dragMove = (event: Event) => {
						event.stopPropagation();
						event.preventDefault();
						const deltaWidth = getDragXPos(event) - dragStartXPosForId[cell.id];
						columnsWidthState.update(($columnsWidthState) => {
							const startWidth = $columnsWidthState.start[cell.id];
							if (startWidth === undefined) return $columnsWidthState;
							return {
								...$columnsWidthState,
								current: {
									...$columnsWidthState.current,
									[cell.id]: Math.max(0, startWidth + deltaWidth),
								},
							};
						});
					};
					const dragEnd = (event: Event) => {
						event.stopPropagation();
						event.preventDefault();
						window.removeEventListener('mousemove', dragMove);
						window.removeEventListener('mouseup', dragEnd);
					};
					const action = (node: Element) => {
						columnWidths.update(($columnWidths) => ({
							...$columnWidths,
							[cell.id]: node.clientWidth,
						}));
					};
					action.drag = dragStart;
					const props = derived([], () => {
						return action;
					});
					const attrs = derived(columnWidths, ($columnWidths) => {
						const width = $columnWidths[cell.id];
						if (width === undefined) {
							return {};
						}
						const widthPx = `${width}px`;
						return {
							style: {
								width: widthPx,
								'min-width': widthPx,
								'max-width': widthPx,
							},
						};
					});
					return { props, attrs };
				},
			},
		};
	};
