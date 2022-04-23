export type KeyPath<T, D extends number = 3> = KeyPath_<T, D, []>;

type KeyPath_<T, D extends number, S extends unknown[]> = D extends S['length']
	? never
	: T extends object
	? {
			[K in keyof T]-?: K extends string
				? `${K}` | Join<K, KeyPath_<T[K], D, [never, ...S]>>
				: K extends number
				? `[${K}]` | Join<`[${K}]`, KeyPath_<T[K], D, [never, ...S]>>
				: never;
	  }[keyof T]
	: '';

type Join<K, P> = K extends string | number
	? P extends string | number
		? P extends `[${string}`
			? `${K}${P}`
			: `${K}${'' extends P ? '' : '.'}${P}`
		: never
	: never;
