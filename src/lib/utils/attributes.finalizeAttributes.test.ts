import { finalizeAttributes } from './attributes';

it('ignores undefined style', () => {
	const actual = finalizeAttributes({
		a: 1,
		b: 2,
	});

	const expected = { a: 1, b: 2 };

	expect(actual).toStrictEqual(expected);
});

it('ignores string style', () => {
	const actual = finalizeAttributes({
		a: 1,
		b: 2,
		style: 'display:flex',
	});

	const expected = { a: 1, b: 2, style: 'display:flex' };

	expect(actual).toStrictEqual(expected);
});

it('stringifies the style object', () => {
	const actual = finalizeAttributes({
		a: 1,
		b: 2,
		style: {
			display: 'flex',
		},
	});

	const expected = { a: 1, b: 2, style: 'display:flex' };

	expect(actual).toStrictEqual(expected);
});
