import { derived, type Readable } from 'svelte/store';
import { derivedKeys } from 'svelte-subscribe';
import type {
	AnyPlugins,
	ComponentKeys,
	ElementHook,
	PluginTablePropSet,
} from './types/TablePlugin';
import type { TableState } from './createViewModel';
import type { Clonable } from './utils/clone';
import { finalizeAttributes, mergeAttributes } from './utils/attributes';

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

	private attrsForName: Record<string, Readable<Record<string, unknown>>> = {};
	attrs(): Readable<Record<string, unknown>> {
		return derived(Object.values(this.attrsForName), ($attrsArray) => {
			let $mergedAttrs: Record<string, unknown> = {};
			$attrsArray.forEach(($attrs) => {
				$mergedAttrs = mergeAttributes($mergedAttrs, $attrs);
			});
			return finalizeAttributes($mergedAttrs);
		});
	}

	private propsForName: Record<string, Readable<Record<string, unknown>>> = {};
	props(): Readable<PluginTablePropSet<Plugins>[Key]> {
		return derivedKeys(this.propsForName) as Readable<PluginTablePropSet<Plugins>[Key]>;
	}

	protected state?: TableState<Item, Plugins>;
	injectState(state: TableState<Item, Plugins>) {
		this.state = state;
	}

	applyHook(
		pluginName: string,
		hook: ElementHook<Record<string, unknown>, Record<string, unknown>>
	) {
		if (hook.props !== undefined) {
			this.propsForName[pluginName] = hook.props;
		}
		if (hook.attrs !== undefined) {
			this.attrsForName[pluginName] = hook.attrs;
		}
	}

	abstract clone(): TableComponent<Item, Plugins, Key>;
}
