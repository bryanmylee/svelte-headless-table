import type { Readable } from 'svelte/store';

export type ReadableKeys<T> = {
	[K in keyof T]: T[K] extends undefined ? Readable<T[K] | undefined> : Readable<T[K]>;
};
