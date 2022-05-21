import { readable, writable, type Readable, type Writable } from 'svelte/store';

export type ReadOrWritable<T> = Readable<T> | Writable<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isReadable = <T>(value: any): value is Readable<T> => {
	return value?.subscribe !== undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isWritable = <T>(store: any): store is Writable<T> => {
	return store?.update !== undefined && store.set !== undefined;
};

export type WritableKeys<T> = {
	[K in keyof T]: T[K] extends undefined ? Writable<T[K] | undefined> : Writable<T[K]>;
};

export type ReadableKeys<T> = {
	[K in keyof T]: T[K] extends undefined ? Readable<T[K] | undefined> : Readable<T[K]>;
};

export type ReadOrWritableKeys<T> = {
	[K in keyof T]: T[K] extends undefined ? ReadOrWritable<T[K] | undefined> : ReadOrWritable<T[K]>;
};

export const Undefined = readable(undefined);
export const UndefinedAs = <T>() => Undefined as unknown as Readable<T>;

export interface ArraySetStoreOptions<T> {
	isEqual?: (a: T, b: T) => boolean;
}

export interface ArraySetStore<T> extends Writable<T[]> {
	toggle: (item: T) => void;
	add: (item: T) => void;
	remove: (item: T) => void;
	reset: () => void;
}

export const arraySetStore = <T>(
	initial: T[] = [],
	{ isEqual = (a, b) => a === b }: ArraySetStoreOptions<T> = {}
): ArraySetStore<T> => {
	const { subscribe, update, set } = writable(initial);
	const toggle = (item: T) => {
		update(($arraySet) => {
			const index = $arraySet.findIndex(($item) => isEqual($item, item));
			if (index === -1) {
				return [...$arraySet, item];
			}
			return [...$arraySet.slice(0, index), ...$arraySet.slice(index + 1)];
		});
	};
	const add = (item: T) => {
		update(($arraySet) => {
			const index = $arraySet.findIndex(($item) => isEqual($item, item));
			if (index === -1) {
				return [...$arraySet, item];
			}
			return $arraySet;
		});
	};
	const remove = (item: T) => {
		update(($arraySet) => {
			const index = $arraySet.findIndex(($item) => isEqual($item, item));
			if (index === -1) {
				return $arraySet;
			}
			return [...$arraySet.slice(0, index), ...$arraySet.slice(index + 1)];
		});
	};
	const reset = () => {
		set([]);
	};
	return {
		subscribe,
		update,
		set,
		toggle,
		add,
		remove,
		reset,
	};
};

export interface RecordSetStore<T extends string | number> extends Writable<Record<T, boolean>> {
	toggle: (item: T) => void;
	add: (item: T) => void;
	remove: (item: T) => void;
	reset: () => void;
}

export const recordSetStore = <T extends string | number>(
	initial: Record<T, boolean> = {} as Record<T, boolean>
): RecordSetStore<T> => {
	const { subscribe, update, set } = writable(initial);
	const toggle = (item: T) => {
		update(($recordSet) => {
			if ($recordSet[item] === true) {
				delete $recordSet[item];
				return $recordSet;
			}
			return {
				...$recordSet,
				[item]: true,
			};
		});
	};
	const add = (item: T) => {
		update(($recordSet) => ({
			...$recordSet,
			[item]: true,
		}));
	};
	const remove = (item: T) => {
		update(($recordSet) => {
			delete $recordSet[item];
			return $recordSet;
		});
	};
	const reset = () => {
		set({} as Record<T, boolean>);
	};
	return {
		subscribe,
		update,
		set,
		toggle,
		add,
		remove,
		reset,
	};
};
