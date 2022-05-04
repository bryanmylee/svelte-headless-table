import { derived, type Readable, type Writable } from 'svelte/store';

export type ReadOrWritable<T> = Readable<T> | Writable<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isReadable = <T>(value: any): value is Readable<T> => {
	return value.subscribe !== undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isWritable = <T>(store: any): store is Writable<T> => {
	return store.update !== undefined && store.set !== undefined;
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

export const derivedKeys = <S extends ReadOrWritableKeys<unknown>>(storeMap: S): DerivedKeys<S> => {
	// Freeze the order of entries.
	const entries: [string, ReadOrWritable<unknown>][] = Object.entries(storeMap);
	const keys = entries.map(([key]) => key);
	return derived(
		entries.map(([, store]) => store),
		($stores) => {
			return Object.fromEntries($stores.map((store, idx) => [keys[idx], store]));
		}
	) as DerivedKeys<S>;
};

export type DerivedKeys<S extends ReadOrWritableKeys<unknown>> = S extends ReadOrWritableKeys<
	infer T
>
	? Readable<T>
	: never;
