export const getCloned = <T extends object>(source: T): T => {
	const clone = Object.create(source);
	Object.assign(clone, source);
	return clone;
};
