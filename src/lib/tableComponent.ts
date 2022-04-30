import { derived, type Readable } from 'svelte/store';
import type { ActionReturnType } from './types/Action';
import type {
	AnyTablePropSet,
	ComponentKeys,
	ElementHook,
	EventHandler,
	KeyToAttributes,
	TablePropSet,
} from './types/plugin';

export interface TableComponentInit {
	id: string;
}

export class TableComponent<
	Item,
	Key extends ComponentKeys,
	E extends TablePropSet = AnyTablePropSet
> {
	id: string;
	constructor({ id }: TableComponentInit) {
		this.id = id;
	}

	attrs(): Readable<KeyToAttributes<Item>[Key]> {
		throw Error('Missing `attrs` implementation');
	}

	private eventHandlers: Array<EventHandler> = [];
	events(node: HTMLElement): ActionReturnType {
		const unsubscribers = this.eventHandlers.map(({ type, callback }) => {
			node.addEventListener(type, callback);
			return () => {
				node.removeEventListener(type, callback);
			};
		});
		return {
			destroy() {
				unsubscribers.forEach((unsubscribe) => unsubscribe());
			},
		};
	}

	private nameToProps: Record<string, Readable<Record<string, unknown>>> = {};
	props(): Readable<E[Key]> {
		const propsEntries = Object.entries(this.nameToProps);
		const pluginNames = propsEntries.map(([pluginName]) => pluginName);
		return derived(
			propsEntries.map(([, props]) => props),
			($propsArray) => {
				const props: Record<string, Record<string, unknown>> = {};
				$propsArray.forEach((p, idx) => {
					props[pluginNames[idx]] = p;
				});
				return props as E[Key];
			}
		);
	}

	applyHook(pluginName: string, hook: ElementHook<Record<string, unknown>>) {
		if (hook.eventHandlers !== undefined) {
			this.eventHandlers = [...this.eventHandlers, ...hook.eventHandlers];
		}
		if (hook.props !== undefined) {
			this.nameToProps[pluginName] = hook.props;
		}
	}
}
