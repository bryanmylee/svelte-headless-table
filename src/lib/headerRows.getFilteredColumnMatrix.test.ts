import { HeaderCell, DataHeaderCell, GroupHeaderCell } from './headerCells';
import { getFilteredColumnMatrix } from './headerRows';
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
			new GroupHeaderCell({ label: 'Name', colspan: 1, allIds: ['firstName', 'lastName'] }),
			new DataHeaderCell({ label: 'First Name', accessorKey: 'firstName', id: 'firstName' }),
		],
		[
			new GroupHeaderCell({ label: 'Name', colspan: 1, allIds: ['firstName', 'lastName'] }),
			new DataHeaderCell({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
		],
		[
			new GroupHeaderCell({ label: 'Info', colspan: 1, allIds: ['age', 'progress'] }),
			new DataHeaderCell({ label: 'Age', accessorKey: 'age', id: 'age' }),
		],
		[
			new GroupHeaderCell({ label: 'Info', colspan: 1, allIds: ['age', 'progress'] }),
			new DataHeaderCell({ label: 'Progress', accessorKey: 'progress', id: 'progress' }),
		],
	];

	const actual = getFilteredColumnMatrix(columnMatrix, ['firstName', 'progress']);

	const expected: Matrix<HeaderCell<User>> = [
		[
			new GroupHeaderCell({ label: 'Name', colspan: 1, allIds: ['firstName', 'lastName'] }),
			new DataHeaderCell({ label: 'Last Name', accessorKey: 'lastName', id: 'lastName' }),
		],
		[
			new GroupHeaderCell({ label: 'Info', colspan: 1, allIds: ['age', 'progress'] }),
			new DataHeaderCell({ label: 'Age', accessorKey: 'age', id: 'age' }),
		],
	];

	expect(actual).toStrictEqual(expected);
});
