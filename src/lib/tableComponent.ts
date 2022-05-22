import type { Readable } from 'svelte/store';
import { derivedKeys } from 'svelte-subscribe';
import type {
	AnyPlugins,
	AttributesForKey,
	ComponentKeys,
	ElementHook,
	PluginTablePropSet,
} from './types/TablePlugin';
import type { TableState } from './createViewModel';
import type { Clonable } from './utils/clone';

export interface TableComponentInit {
	id: string;
}

export abstract class TableComponent<Item, Plugins extends AnyPlugins, Key extends ComponentKeys>
	implements Clonable<TableComponent<Item, Plugins, Key>>
{
	id: string;
	constructor({ id }: TableComponentInit) {
		this.id = id;
	}

	attrs(): Readable<AttributesForKey<Item, Plugins>[Key]> {
		throw Error('Missing `attrs` implementation');
	}

	metadataForName: Record<string, Record<string, unknown>> = {};
	private propsForName: Record<string, Readable<Record<string, unknown>>> = {};
	props(): Readable<PluginTablePropSet<Plugins>[Key]> {
		return derivedKeys(this.propsForName) as Readable<PluginTablePropSet<Plugins>[Key]>;
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

	abstract clone(): TableComponent<Item, Plugins, Key>;
}
