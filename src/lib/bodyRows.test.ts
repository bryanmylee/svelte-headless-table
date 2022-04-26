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

		const row0 = new BodyRow<User>({ id: '0', cells: [] });
		const cells0 = [
			new BodyCell<User>({
				row: row0,
				column: columns[0],
				value: 'Adam',
			}),
			new BodyCell<User>({
				row: row0,
				column: columns[1],
				value: 'West',
			}),
			new BodyCell<User>({
				row: row0,
				column: columns[2],
				value: 75,
			}),
		];
		row0.cells = cells0;
		const row1 = new BodyRow<User>({ id: '1', cells: [] });
		const cells1 = [
			new BodyCell<User>({
				row: row1,
				column: columns[0],
				value: 'Becky',
			}),
			new BodyCell<User>({
				row: row1,
				column: columns[1],
				value: 'White',
			}),
			new BodyCell<User>({
				row: row1,
				column: columns[2],
				value: 43,
			}),
		];
		row1.cells = cells1;
		const expected: Array<BodyRow<User>> = [row0, row1];

		expect(actual).toStrictEqual(expected);
	});
});
