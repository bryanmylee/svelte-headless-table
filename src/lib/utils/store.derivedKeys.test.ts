import { get, readable, writable } from 'svelte/store';
import { derivedKeys } from './store';

it('derives an empty object from an empty object', () => {
	const actual = derivedKeys({});
	const expected = readable({});
	expect(get(actual)).toEqual(get(expected));
});

it('derives a readable key', () => {
	const stores = {
		a: readable(3),
	};
	const actual = derivedKeys(stores);
	const expected = readable({
		a: 3,
	});
	expect(get(actual)).toEqual(get(expected));
});

it('derives multiple keys', () => {
	const stores = {
		a: readable(3),
		b: writable('john'),
	};
	const actual = derivedKeys(stores);
	const expected = readable({
		a: 3,
		b: 'john',
	});
	expect(get(actual)).toEqual(get(expected));
});

it('updates when writable keys update', () => {
	const stores = {
		a: readable(3),
		b: writable('john'),
	};

	const actual = derivedKeys(stores);

	stores.b.set('jane');

	const expected = readable({
		a: 3,
		b: 'jane',
	});
	expect(get(actual)).toEqual(get(expected));
});
