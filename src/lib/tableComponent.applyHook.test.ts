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

it('throws if attrs is accessed without implementation', () => {
	const component = new TestComponent({ id: '0' });

	expect(() => {
		component.attrs();
	}).toThrowError('Missing `attrs` implementation');
});
