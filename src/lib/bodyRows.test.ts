import { BodyCell } from './bodyCells';
import { BodyRow, getBodyRows } from './bodyRows';
import { column } from './columns';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

describe('getBodyRows', () => {
	const columns = [
		column<User>({
			accessor: 'firstName',
			header: 'First Name',
		}),
		column<User>({
			accessor: 'lastName',
			header: 'Last Name',
		}),
		column<User>({
			accessor: 'progress',
			header: 'Profile Progress',
		}),
	];

	it('transforms empty data', () => {
		const actual = getBodyRows([], columns);

		const expected: Array<BodyRow<User>> = [];

		expect(actual).toStrictEqual(expected);
	});

	it('transforms data', () => {
		const data: Array<User> = [
			{
				firstName: 'Adam',
				lastName: 'West',
				age: 50,
				progress: 75,
				status: 'completed',
				visits: 32,
			},
			{
				firstName: 'Becky',
				lastName: 'White',
				age: 93,
				progress: 43,
				status: 'completed',
				visits: 10,
			},
		];

		const actual = getBodyRows(data, columns);

		const expected: Array<BodyRow<User>> = [
			new BodyRow({
				cells: [
					new BodyCell<User>({
						columnId: 'firstName',
						value: 'Adam',
					}),
					new BodyCell<User>({
						columnId: 'lastName',
						value: 'West',
					}),
					new BodyCell<User>({
						columnId: 'progress',
						value: 75,
					}),
				],
			}),
			new BodyRow({
				cells: [
					new BodyCell<User>({
						columnId: 'firstName',
						value: 'Becky',
					}),
					new BodyCell<User>({
						columnId: 'lastName',
						value: 'White',
					}),
					new BodyCell<User>({
						columnId: 'progress',
						value: 43,
					}),
				],
			}),
		];

		expect(actual).toStrictEqual(expected);
	});
});
