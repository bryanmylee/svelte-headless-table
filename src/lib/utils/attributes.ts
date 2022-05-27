import { stringifyCss } from './css';

export const mergeAttributes = <
	T extends Record<string, unknown>,
	U extends Record<string, unknown>
>(
	a: T,
	b: U
): T & U => {
	if (a.style === undefined && b.style === undefined) {
		return { ...a, ...b };
	}
	return {
		...a,
		...b,
		style: {
			...(typeof a.style === 'object' ? a.style : {}),
			...(typeof b.style === 'object' ? b.style : {}),
		},
	};
};

export const finalizeAttributes = <T extends Record<string, unknown>>(
	attrs: T
): Record<string, unknown> => {
	if (attrs.style === undefined || typeof attrs.style !== 'object') {
		return attrs;
	}
	return {
		...attrs,
		style: stringifyCss(attrs.style as Record<string, unknown>),
	};
};
