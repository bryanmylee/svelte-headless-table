export type Entries<Obj> = NonNullable<
	{
		[K in keyof Obj]: [K, NonNullable<Obj[K]>];
	}[keyof Obj]
>[];
