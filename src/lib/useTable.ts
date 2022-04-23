import { writable, type Writable } from 'svelte/store';
import type { Column } from './models/Column';
import { TableInstance } from './models/TableInstance';
import type { TablePlugin } from './types/TablePlugin';
import { nonNull } from './utils/nonNull';

export interface UseTableProps<Item extends object> {
	columns: Column<Item>[];
	data: Item[];
}

export const useTable = <Item extends object, Plugins extends TablePlugin<Item>[]>(
	{ data, columns }: UseTableProps<Item>,
	...plugins: Plugins
): [Writable<TableInstance<Item>>, ...{ [Index in keyof Plugins]: Plugins[number]['state'] }] => {
	const rawInstance = new TableInstance({ data, columns });
	const instance = writable(rawInstance);
	const states = plugins.map((plugin) => plugin.state) as {
		[Index in keyof Plugins]: Plugins[number]['state'];
	};
	const sortFns = plugins.map((plugin) => plugin.sortFn).filter(nonNull);
	return [instance, ...states];
};
