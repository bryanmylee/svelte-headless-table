export const getCloned = <T extends object>(source: T, props?: Partial<T>): T => {
	const clone = Object.create(source);
	Object.assign(clone, source);
	if (props !== undefined) {
		Object.assign(clone, props);
	}
	return clone;
};
