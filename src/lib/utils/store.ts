import { type Writable, type Readable, readable } from 'svelte/store';

export type ReadOrWritable<T> = Readable<T> | Writable<T>;

export const isWritable = <T>(store: ReadOrWritable<T>): store is Writable<T> => {
	return (store as Writable<T>).update !== undefined && (store as Writable<T>).set !== undefined;
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

export const isNotUndefined = <T>(
	store: ReadOrWritable<T | undefined>
): store is ReadOrWritable<T> => {
	return store !== Undefined;
};
