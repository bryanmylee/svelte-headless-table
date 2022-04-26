import { getBodyRows, getSortedBodyRows } from './bodyRows';
import { column, DataColumn } from './columns';

interface User {
	name: {
		firstName: string;
		lastName: string;
	};
	age: number;
	visits: number;
	progress: number;
	status: string;
}

const data: Array<User> = [
	{
		name: {
			firstName: 'Charlie',
			lastName: 'Brown',
		},
		age: 50,
		progress: 75,
		status: 'completed',
		visits: 20,
	},
	{
		name: {
			firstName: 'Becky',
			lastName: 'White',
		},
		age: 13,
		progress: 740,
		status: 'progress',
		visits: 10,
	},
	{
		name: {
			firstName: 'Adam',
			lastName: 'West',
		},
		age: 93,
		progress: 43,
		status: 'incomplete',
		visits: 20,
	},
];

const columns: Array<DataColumn<User>> = [
	column<User, { firstName: string; lastName: string }>({
		accessor: 'name',
		header: 'Name',
		cell: (v) => v.firstName,
		sortKey: (v) => `${v.firstName} ${v.lastName}`,
	}),
	column<User>({
		accessor: 'progress',
		header: 'Profile Progress',
	}),
	column<User>({
		accessor: 'status',
		header: 'Status',
	}),
	column<User>({
		accessor: 'visits',
		header: 'Visits',
	}),
];

const bodyRows = getBodyRows(data, columns);

describe('getSortedBodyRows', () => {
	it('ignores unexpected sort keys', () => {
		const actual = getSortedBodyRows(bodyRows, [
			{
				id: 'age',
				order: 'asc',
			},
		]);

		const sortedIds = actual.map((row) => row.id);
		const expected = ['0', '1', '2'];

		expect(sortedIds).toStrictEqual(expected);
	});

	it('sorts on string value', () => {
		const actual = getSortedBodyRows(bodyRows, [
			{
				id: 'status',
				order: 'asc',
			},
		]);

		const sortedIds = actual.map((row) => row.id);
		const expected = ['0', '2', '1'];

		expect(sortedIds).toStrictEqual(expected);
	});

	it('desc sorts on string value', () => {
		const actual = getSortedBodyRows(bodyRows, [
			{
				id: 'status',
				order: 'desc',
			},
		]);

		const sortedIds = actual.map((row) => row.id);
		const expected = ['1', '2', '0'];

		expect(sortedIds).toStrictEqual(expected);
	});

	it('sorts on number value', () => {
		const actual = getSortedBodyRows(bodyRows, [
			{
				id: 'progress',
				order: 'asc',
			},
		]);

		const sortedIds = actual.map((row) => row.id);
		const expected = ['2', '0', '1'];

		expect(sortedIds).toStrictEqual(expected);
	});

	it('sorts on object with sortKey', () => {
		const actual = getSortedBodyRows(bodyRows, [
			{
				id: 'name',
				order: 'asc',
			},
		]);

		const sortedIds = actual.map((row) => row.id);
		const expected = ['2', '1', '0'];

		expect(sortedIds).toStrictEqual(expected);
	});

	it('sorts on multiple values', () => {
		const actual = getSortedBodyRows(bodyRows, [
			{
				id: 'visits',
				order: 'desc',
			},
			{
				id: 'name',
				order: 'desc',
			},
		]);

		const sortedIds = actual.map((row) => row.id);
		const expected = ['0', '2', '1'];

		expect(sortedIds).toStrictEqual(expected);
	});
});
