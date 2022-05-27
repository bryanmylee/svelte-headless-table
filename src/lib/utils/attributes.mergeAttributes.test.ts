import { mergeAttributes } from './attributes';

it('merges basic attributes without styles', () => {
	const actual = mergeAttributes(
		{
			a: 1,
			b: 2,
		},
		{
			c: 3,
			b: 4,
		}
	);

	const expected = {
		a: 1,
		b: 4,
		c: 3,
	};

	expect(actual).toStrictEqual(expected);
});

it('merges attributes with styles', () => {
	const actual = mergeAttributes(
		{
			a: 1,
			b: 2,
			style: {
				a: '1',
				b: '2',
			},
		},
		{
			c: 3,
			b: 4,
			style: {
				c: '3',
				b: '4',
			},
		}
	);

	const expected = {
		a: 1,
		b: 4,
		c: 3,
		style: {
			a: '1',
			b: '4',
			c: '3',
		},
	};

	expect(actual).toStrictEqual(expected);
});
