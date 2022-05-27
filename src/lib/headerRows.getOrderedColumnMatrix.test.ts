import { HeaderCell, DataHeaderCell, GroupHeaderCell } from './headerCells';
import { getOrderedColumnMatrix } from './headerRows';
import type { Matrix } from './types/Matrix';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

it('orders the matrix columns', () => {
	const columnMatrix: Matrix<HeaderCell<User>> = [
		[
			new GroupHeaderCell({
				label: 'Name',
				colspan: 1,
				colstart: 0,
				allIds: ['firstName', 'lastName'],
				ids: [],
			}),
			new DataHeaderCell({
				label: 'First Name',
				colstart: 0,
				accessorKey: 'firstName',
				id: 'firstName',
			}),
		],
		[
			new GroupHeaderCell({
				label: 'Name',
				colspan: 1,
				colstart: 1,
				allIds: ['firstName', 'lastName'],
				ids: [],
			}),
			new DataHeaderCell({
				label: 'Last Name',
				colstart: 1,
				accessorKey: 'lastName',
				id: 'lastName',
			}),
		],
		[
			new GroupHeaderCell({
				label: 'Info',
				colspan: 1,
				colstart: 2,
				allIds: ['age', 'progress'],
				ids: [],
			}),
			new DataHeaderCell({ label: 'Age', colstart: 2, accessorKey: 'age', id: 'age' }),
		],
		[
			new GroupHeaderCell({
				label: 'Info',
				colspan: 1,
				colstart: 3,
				allIds: ['age', 'progress'],
				ids: [],
			}),
			new DataHeaderCell({
				label: 'Progress',
				colstart: 3,
				accessorKey: 'progress',
				id: 'progress',
			}),
		],
	];

	const actual = getOrderedColumnMatrix(columnMatrix, ['firstName', 'age', 'lastName', 'progress']);

	const expected: Matrix<HeaderCell<User>> = [
		[
			new GroupHeaderCell({
				label: 'Name',
				colspan: 1,
				colstart: 0,
				allIds: ['firstName', 'lastName'],
				ids: [],
			}),
			new DataHeaderCell({
				label: 'First Name',
				colstart: 0,
				accessorKey: 'firstName',
				id: 'firstName',
			}),
		],
		[
			new GroupHeaderCell({
				label: 'Info',
				colspan: 1,
				colstart: 1,
				allIds: ['age', 'progress'],
				ids: [],
			}),
			new DataHeaderCell({ label: 'Age', colstart: 1, accessorKey: 'age', id: 'age' }),
		],
		[
			new GroupHeaderCell({
				label: 'Name',
				colspan: 1,
				colstart: 2,
				allIds: ['firstName', 'lastName'],
				ids: [],
			}),
			new DataHeaderCell({
				label: 'Last Name',
				colstart: 2,
				accessorKey: 'lastName',
				id: 'lastName',
			}),
		],
		[
			new GroupHeaderCell({
				label: 'Info',
				colspan: 1,
				colstart: 3,
				allIds: ['age', 'progress'],
				ids: [],
			}),
			new DataHeaderCell({
				label: 'Progress',
				colstart: 3,
				accessorKey: 'progress',
				id: 'progress',
			}),
		],
	];

	expect(actual).toStrictEqual(expected);
});

it('ignores empty ordering', () => {
	const columnMatrix: Matrix<HeaderCell<User>> = [
		[
			new GroupHeaderCell({
				label: 'Name',
				colspan: 1,
				colstart: 0,
				allIds: ['firstName', 'lastName'],
				ids: [],
			}),
			new DataHeaderCell({
				label: 'First Name',
				colstart: 0,
				accessorKey: 'firstName',
				id: 'firstName',
			}),
		],
		[
			new GroupHeaderCell({
				label: 'Name',
				colspan: 1,
				colstart: 1,
				allIds: ['firstName', 'lastName'],
				ids: [],
			}),
			new DataHeaderCell({
				label: 'Last Name',
				colstart: 1,
				accessorKey: 'lastName',
				id: 'lastName',
			}),
		],
		[
			new GroupHeaderCell({
				label: 'Info',
				colspan: 1,
				colstart: 2,
				allIds: ['age', 'progress'],
				ids: [],
			}),
			new DataHeaderCell({ label: 'Age', colstart: 2, accessorKey: 'age', id: 'age' }),
		],
		[
			new GroupHeaderCell({
				label: 'Info',
				colspan: 1,
				colstart: 3,
				allIds: ['age', 'progress'],
				ids: [],
			}),
			new DataHeaderCell({
				label: 'Progress',
				colstart: 3,
				accessorKey: 'progress',
				id: 'progress',
			}),
		],
	];

	const actual = getOrderedColumnMatrix(columnMatrix, []);

	const expected: Matrix<HeaderCell<User>> = [
		[
			new GroupHeaderCell({
				label: 'Name',
				colspan: 1,
				colstart: 0,
				allIds: ['firstName', 'lastName'],
				ids: [],
			}),
			new DataHeaderCell({
				label: 'First Name',
				colstart: 0,
				accessorKey: 'firstName',
				id: 'firstName',
			}),
		],
		[
			new GroupHeaderCell({
				label: 'Name',
				colspan: 1,
				colstart: 1,
				allIds: ['firstName', 'lastName'],
				ids: [],
			}),
			new DataHeaderCell({
				label: 'Last Name',
				colstart: 1,
				accessorKey: 'lastName',
				id: 'lastName',
			}),
		],
		[
			new GroupHeaderCell({
				label: 'Info',
				colspan: 1,
				colstart: 2,
				allIds: ['age', 'progress'],
				ids: [],
			}),
			new DataHeaderCell({ label: 'Age', colstart: 2, accessorKey: 'age', id: 'age' }),
		],
		[
			new GroupHeaderCell({
				label: 'Info',
				colspan: 1,
				colstart: 3,
				allIds: ['age', 'progress'],
				ids: [],
			}),
			new DataHeaderCell({
				label: 'Progress',
				colstart: 3,
				accessorKey: 'progress',
				id: 'progress',
			}),
		],
	];

	expect(actual).toStrictEqual(expected);
});
