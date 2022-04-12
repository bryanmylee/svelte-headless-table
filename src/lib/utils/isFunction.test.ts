import { isFunction } from './isFunction';

describe('isFunction', () => {
	describe('should be functions', () => {
		test('functions are functions', () => {
			expect(
				isFunction(function sample() {
					console.log('function ');
				})
			).toBe(true);
			expect(
				isFunction(function sample() {
					return 'function';
				})
			).toBe(true);
		});

		test('async functions are functions', () => {
			expect(
				isFunction(async function sample() {
					console.log('function ');
				})
			).toBe(true);
			expect(
				isFunction(async function sample() {
					return 'function';
				})
			).toBe(true);
		});

		test('arrow functions are functions', () => {
			expect(
				isFunction(() => {
					console.log('function');
				})
			).toBe(true);
			expect(isFunction(() => 'function')).toBe(true);
		});

		test('async arrow functions are functions', () => {
			expect(
				isFunction(async () => {
					console.log('function');
				})
			).toBe(true);
			expect(isFunction(async () => 'function')).toBe(true);
		});
	});

	describe('should not be functions', () => {
		test('primitives are not functions', () => {
			expect(isFunction(0)).toBe(false);
			expect(isFunction('string')).toBe(false);
			expect(isFunction(true)).toBe(false);
			expect(isFunction(Symbol('function'))).toBe(false);
		});

		test('objects are not functions', () => {
			expect(isFunction({})).toBe(false);
			expect(isFunction({ key: 'value' })).toBe(false);
		});
	});
});
