import { column, createColumns, DataColumn, getFlatColumns, group } from './columns';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

it('flattens data columns', () => {
	const columns = createColumns<User>([
		group({
			header: 'ID',
			columns: [
				group({
					header: 'Name',
					columns: [
						column({
							header: 'First Name',
							accessor: 'firstName',
						}),
					],
				}),
				column({
					header: 'Last Name',
					accessor: 'lastName',
				}),
			],
		}),
		group({
			header: 'Info',
			columns: [
				column({
					header: 'Age',
					accessor: 'age',
				}),
				column({
					header: 'Status',
					accessor: 'status',
				}),
				column({
					header: 'Visits',
					accessor: 'visits',
				}),
				column({
					header: 'Profile Progress',
					accessor: 'progress',
				}),
			],
		}),
	]);

	const actual = getFlatColumns(columns);

	const expected: Array<DataColumn<User>> = [
		column({ header: 'First Name', accessor: 'firstName' }),
		column({ header: 'Last Name', accessor: 'lastName' }),
		column({ header: 'Age', accessor: 'age' }),
		column({ header: 'Status', accessor: 'status' }),
		column({ header: 'Visits', accessor: 'visits' }),
		column({ header: 'Profile Progress', accessor: 'progress' }),
	];

	expect(actual).toStrictEqual(expected);
});
