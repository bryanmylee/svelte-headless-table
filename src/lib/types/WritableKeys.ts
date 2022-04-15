import type { Writable } from 'svelte/store';

export type WritableKeys<T extends object> = {
	[K in keyof T]: Writable<T[K]>;
};
