export const stringifyCss = (style: Record<string, unknown>): string => {
	return Object.entries(style)
		.map(([name, value]) => `${name}:${value}`)
		.join(';');
};
