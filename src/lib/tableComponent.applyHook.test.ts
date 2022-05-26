import { get, readable } from 'svelte/store';
import { TableComponent } from './tableComponent';
import type { AnyPlugins } from './types/TablePlugin';

class TestComponent<Item> extends TableComponent<Item, AnyPlugins, 'tbody.tr'> {
	clone(): TableComponent<Item, AnyPlugins, 'tbody.tr'> {
		return new TestComponent({
			id: this.id,
		});
	}
}

it('hooks plugin props', () => {
	const component = new TestComponent({ id: '0' });
	const $props = {
		a: 1,
		b: 2,
	};
	const props = readable($props);
	component.applyHook('test', { props });

	const actual = component.props();

	const expected = {
		test: $props,
	};

	expect(get(actual)).toStrictEqual(expected);
});

it('hooks plugin attrs', () => {
	const component = new TestComponent({ id: '0' });
	const $attrs = {
		a: 1,
		b: 2,
	};
	const attrs = readable($attrs);
	component.applyHook('test', { attrs });

	const actual = component.attrs();

	const expected = $attrs;

	expect(get(actual)).toStrictEqual(expected);
});

it('hooks and merges plugin attrs', () => {
	const component = new TestComponent({ id: '0' });
	const $attrs1 = {
		a: 1,
		b: 2,
	};
	const attrs1 = readable($attrs1);
	const $attrs2 = {
		c: 3,
		b: 4,
	};
	const attrs2 = readable($attrs2);
	component.applyHook('firstPlugin', { attrs: attrs1 });
	component.applyHook('secondPlugin', { attrs: attrs2 });

	const actual = component.attrs();

	const expected = {
		a: 1,
		c: 3,
		b: 4,
	};

	expect(get(actual)).toStrictEqual(expected);
});

it('hooks and merges plugin attrs styles', () => {
	const component = new TestComponent({ id: '0' });
	const $attrs1 = {
		a: 1,
		b: 2,
		style: {
			x: '1',
			y: '2',
		},
	};
	const attrs1 = readable($attrs1);
	const $attrs2 = {
		c: 3,
		b: 4,
		style: {
			z: '3',
			y: '4',
		},
	};
	const attrs2 = readable($attrs2);
	component.applyHook('firstPlugin', { attrs: attrs1 });
	component.applyHook('secondPlugin', { attrs: attrs2 });

	const actual = component.attrs();

	const expected = {
		a: 1,
		b: 4,
		c: 3,
		style: 'x:1;y:4;z:3',
	};

	expect(get(actual)).toStrictEqual(expected);
});
