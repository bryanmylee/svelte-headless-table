import { derived, type Readable } from 'svelte/store';
import { NBSP } from './constants';
import type { ActionReturnType } from './types/Action';
import type { AggregateLabel } from './types/AggregateLabel';
import type { AnyExtraPropSet, ElementHook, EventHandler, ExtraPropSet } from './types/plugin';
import type { RenderProps } from './types/RenderProps';

export interface HeaderCellInit<Item> {
	id: string;
	label: AggregateLabel<Item>;
	colspan: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface HeaderCellAttributes<Item> {
	colspan: number;
}
export class HeaderCell<Item, E extends ExtraPropSet = AnyExtraPropSet> {
	id: string;
	label: AggregateLabel<Item>;
	colspan: number;
	constructor({ id, label, colspan }: HeaderCellInit<Item>) {
		this.id = id;
		this.label = label;
		this.colspan = colspan;
	}
	attrs(): HeaderCellAttributes<Item> {
		return {
			colspan: this.colspan,
		};
	}
	render(): RenderProps {
		if (this.label instanceof Function) {
			return {
				text: 'Work in progress',
			};
		}
		if (typeof this.label === 'string') {
			return {
				text: this.label,
			};
		}
		return this.label;
	}
	private eventHandlers: Array<EventHandler> = [];
	private extraPropsMap: Record<string, Readable<Record<string, unknown>>> = {};
	applyHook(pluginName: string, hook: ElementHook<Record<string, unknown>>) {
		if (hook.eventHandlers !== undefined) {
			this.eventHandlers = [...this.eventHandlers, ...hook.eventHandlers];
		}
		if (hook.extraProps !== undefined) {
			this.extraPropsMap[pluginName] = hook.extraProps;
		}
	}
	events(node: HTMLTableCellElement): ActionReturnType {
		const unsubscribers = this.eventHandlers.map(({ type, callback }) => {
			node.addEventListener(type, callback);
			return () => {
				node.removeEventListener(type, callback);
			};
		});
		return {
			destroy() {
				console.log('destroying action');
				unsubscribers.forEach((unsubscribe) => unsubscribe());
			},
		};
	}
	extraProps(): Readable<E['thead.tr.th']> {
		const entries = Object.entries(this.extraPropsMap);
		const pluginNames = entries.map(([pluginName]) => pluginName);
		return derived(
			entries.map(([, extraProps]) => extraProps),
			($extraPropsArray) => {
				const props: Record<string, Record<string, unknown>> = {};
				$extraPropsArray.forEach((extraProps, idx) => {
					props[pluginNames[idx]] = extraProps;
				});
				// No easy way to extend this.
				return props as E['thead.tr.th'];
			}
		);
	}
}

/**
 * `DataHeaderCellInit` should match non-inherited `DataColumn` class properties.
 */
export interface DataHeaderCellInit<Item> extends Omit<HeaderCellInit<Item>, 'colspan'> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
}

export class DataHeaderCell<Item> extends HeaderCell<Item> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
	constructor({ id, label, accessorKey, accessorFn }: DataHeaderCellInit<Item>) {
		super({ id, label, colspan: 1 });
		this.accessorKey = accessorKey;
		this.accessorFn = accessorFn;
	}
}

/**
 * `GroupHeaderCellInit` should match non-inherited `GroupColumn` class properties
 * except columns.
 */
export interface GroupHeaderCellInit<Item> extends Omit<HeaderCellInit<Item>, 'id'> {
	ids: Array<string>;
	allIds: Array<string>;
}

export class GroupHeaderCell<Item> extends HeaderCell<Item> {
	ids: Array<string>;
	allId: string;
	allIds: Array<string>;
	constructor({ label, colspan, ids, allIds }: GroupHeaderCellInit<Item>) {
		super({ id: ids.join(','), label, colspan });
		this.ids = ids;
		this.allId = allIds.join(',');
		this.allIds = allIds;
	}
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DisplayHeaderCellInit<Item>
	extends Pick<HeaderCellInit<Item>, 'id'>,
		Partial<Omit<HeaderCellInit<Item>, 'id'>> {}

export class DisplayHeaderCell<Item> extends HeaderCell<Item> {
	constructor({ id, label = NBSP, colspan = 1 }: DisplayHeaderCellInit<Item>) {
		super({ id, label, colspan });
	}
}
