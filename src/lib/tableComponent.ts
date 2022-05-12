import { derived, type Readable } from 'svelte/store';
import type {
	AnyPlugins,
	AttributesForKey,
	ComponentKeys,
	ElementHook,
	PluginTablePropSet,
} from './types/TablePlugin';
import type { TableState } from './useTable';

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

	protected state?: TableState<Item, Plugins>;
	injectState(state: TableState<Item, Plugins>) {
		this.state = state;
	}

	applyHook(pluginName: string, hook: ElementHook<Record<string, unknown>>) {
		if (hook.props !== undefined) {
			this.propsForName[pluginName] = hook.props;
		}
	}
}
