import { derived, type Readable } from 'svelte/store';
import type { ActionReturnType } from './types/Action';
import type {
	AnyPlugins,
	AttributesForKey,
	ComponentKeys,
	ElementHook,
	EventHandler,
	PluginTablePropSet,
} from './types/UseTablePlugin';

export interface TableComponentInit {
	id: string;
}

export class TableComponent<Item, Plugins extends AnyPlugins, Key extends ComponentKeys> {
	id: string;
	constructor({ id }: TableComponentInit) {
		this.id = id;
	}

	attrs(): Readable<AttributesForKey<Item, Plugins>[Key]> {
		throw Error('Missing `attrs` implementation');
	}

	private eventHandlers: EventHandler[] = [];
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

	private propsForName: Record<string, Readable<Record<string, unknown>>> = {};
	props(): Readable<PluginTablePropSet<Plugins>[Key]> {
		const propsEntries = Object.entries(this.propsForName);
		const pluginNames = propsEntries.map(([pluginName]) => pluginName);
		return derived(
			propsEntries.map(([, props]) => props),
			($propsArray) => {
				const props: Record<string, Record<string, unknown>> = {};
				$propsArray.forEach((p, idx) => {
					props[pluginNames[idx]] = p;
				});
				return props as PluginTablePropSet<Plugins>[Key];
			}
		);
	}

	applyHook(pluginName: string, hook: ElementHook<Record<string, unknown>>) {
		if (hook.eventHandlers !== undefined) {
			this.eventHandlers = [...this.eventHandlers, ...hook.eventHandlers];
		}
		if (hook.props !== undefined) {
			this.propsForName[pluginName] = hook.props;
		}
	}
}
