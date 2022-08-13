import { writable } from 'svelte/store';
import { DataBodyCell, DisplayBodyCell } from './bodyCells';
import { BodyRow, DataBodyRow, getBodyRows } from './bodyRows';
import { createTable } from './createTable';

interface User {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: string;
}

const data: User[] = [
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

const table = createTable(writable(data));

const dataColumns = [
	table.column({
		accessor: 'firstName',
		header: 'First Name',
	}),
	table.column({
		accessor: 'lastName',
		header: 'Last Name',
	}),
	table.column({
		accessor: 'progress',
		header: 'Profile Progress',
	}),
];

it('transforms empty data', () => {
	const actual = getBodyRows([], dataColumns);

	const expected: BodyRow<User>[] = [];

	expect(actual).toStrictEqual(expected);
});

it('transforms data for data columns', () => {
	const actual = getBodyRows(data, dataColumns);

	const row0 = new DataBodyRow<User>({
		id: '0',
		dataId: '0',
		original: data[0],
		cells: [],
		cellForId: {},
	});
	const cells0 = [
		new DataBodyCell<User>({
			row: row0,
			column: dataColumns[0],
			value: 'Adam',
		}),
		new DataBodyCell<User>({
			row: row0,
			column: dataColumns[1],
			value: 'West',
		}),
		new DataBodyCell<User>({
			row: row0,
			column: dataColumns[2],
			value: 75,
		}),
	];
	row0.cells = cells0;
	const cellForId0 = {
		firstName: cells0[0],
		lastName: cells0[1],
		progress: cells0[2],
	};
	row0.cellForId = cellForId0;

	const row1 = new DataBodyRow<User>({
		id: '1',
		dataId: '1',
		original: data[1],
		cells: [],
		cellForId: {},
	});
	const cells1 = [
		new DataBodyCell<User>({
			row: row1,
			column: dataColumns[0],
			value: 'Becky',
		}),
		new DataBodyCell<User>({
			row: row1,
			column: dataColumns[1],
			value: 'White',
		}),
		new DataBodyCell<User>({
			row: row1,
			column: dataColumns[2],
			value: 43,
		}),
	];
	row1.cells = cells1;
	const cellForId1 = {
		firstName: cells1[0],
		lastName: cells1[1],
		progress: cells1[2],
	};
	row1.cellForId = cellForId1;

	const expected: DataBodyRow<User>[] = [row0, row1];

	[0, 1].forEach((rowIdx) => {
		const row = actual[rowIdx];
		expect(row).toBeInstanceOf(DataBodyRow);
		if (!row.isData()) {
			throw new Error('Incorrect BodyRow subtype');
		}
		expect(row.original).toStrictEqual(expected[rowIdx].original);
		expect(row.cells.length).toStrictEqual(expected[rowIdx].cells.length);
		actual[rowIdx].cells.forEach((_, colIdx) => {
			const cell = actual[rowIdx].cells[colIdx];
			expect(cell).toBeInstanceOf(DataBodyCell);
			const expectedCell = expected[rowIdx].cells[colIdx];
			if (!(cell instanceof DataBodyCell && expectedCell instanceof DataBodyCell)) {
				throw new Error('Incorrect instance type');
			}
			expect(cell.value).toStrictEqual(expectedCell.value);
		});
		['firstName', 'lastName', 'progress'].forEach((id) => {
			const cell = actual[rowIdx].cellForId[id];
			expect(cell).toBeInstanceOf(DataBodyCell);
			const expectedCell = expected[rowIdx].cellForId[id];
			if (!(cell instanceof DataBodyCell && expectedCell instanceof DataBodyCell)) {
				throw new Error('Incorrect instance type');
			}
			expect(cell.value).toStrictEqual(expectedCell.value);
		});
	});
});

it('transforms data for data columns with custom rowDataId', () => {
	const actual = getBodyRows(data, dataColumns, {
		rowDataId: ({ firstName, lastName }) => `${firstName}-${lastName}`,
	});

	const row0 = new DataBodyRow<User>({
		id: '0',
		dataId: 'Adam-West',
		original: data[0],
		cells: [],
		cellForId: {},
	});
	const cells0 = [
		new DataBodyCell<User>({
			row: row0,
			column: dataColumns[0],
			value: 'Adam',
		}),
		new DataBodyCell<User>({
			row: row0,
			column: dataColumns[1],
			value: 'West',
		}),
		new DataBodyCell<User>({
			row: row0,
			column: dataColumns[2],
			value: 75,
		}),
	];
	row0.cells = cells0;
	const cellForId0 = {
		firstName: cells0[0],
		lastName: cells0[1],
		progress: cells0[2],
	};
	row0.cellForId = cellForId0;

	const row1 = new DataBodyRow<User>({
		id: '1',
		dataId: 'Becky-White',
		original: data[1],
		cells: [],
		cellForId: {},
	});
	const cells1 = [
		new DataBodyCell<User>({
			row: row1,
			column: dataColumns[0],
			value: 'Becky',
		}),
		new DataBodyCell<User>({
			row: row1,
			column: dataColumns[1],
			value: 'White',
		}),
		new DataBodyCell<User>({
			row: row1,
			column: dataColumns[2],
			value: 43,
		}),
	];
	row1.cells = cells1;
	const cellForId1 = {
		firstName: cells1[0],
		lastName: cells1[1],
		progress: cells1[2],
	};
	row1.cellForId = cellForId1;

	const expected: DataBodyRow<User>[] = [row0, row1];

	[0, 1].forEach((rowIdx) => {
		const row = actual[rowIdx];
		expect(row).toBeInstanceOf(DataBodyRow);
		if (!row.isData()) {
			throw new Error('Incorrect BodyRow subtype');
		}
		expect(row.original).toStrictEqual(expected[rowIdx].original);
		expect(row.cells.length).toStrictEqual(expected[rowIdx].cells.length);
		actual[rowIdx].cells.forEach((_, colIdx) => {
			const cell = actual[rowIdx].cells[colIdx];
			expect(cell).toBeInstanceOf(DataBodyCell);
			const expectedCell = expected[rowIdx].cells[colIdx];
			if (!(cell instanceof DataBodyCell && expectedCell instanceof DataBodyCell)) {
				throw new Error('Incorrect instance type');
			}
			expect(cell.value).toStrictEqual(expectedCell.value);
		});
		['firstName', 'lastName', 'progress'].forEach((id) => {
			const cell = actual[rowIdx].cellForId[id];
			expect(cell).toBeInstanceOf(DataBodyCell);
			const expectedCell = expected[rowIdx].cellForId[id];
			if (!(cell instanceof DataBodyCell && expectedCell instanceof DataBodyCell)) {
				throw new Error('Incorrect instance type');
			}
			expect(cell.value).toStrictEqual(expectedCell.value);
		});
	});
});

const checkedLabel = () => 'check';
const expandedLabel = () => 'expanded';
const displayColumns = [
	table.display({
		id: 'checked',
		header: 'Checked',
		cell: checkedLabel,
	}),
	table.display({
		id: 'expanded',
		header: 'Expanded',
		cell: expandedLabel,
	}),
];

it('transforms data with display columns', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const actual = getBodyRows(data, displayColumns as any);

	const row0 = new DataBodyRow<User>({
		id: '0',
		dataId: '0',
		original: data[0],
		cells: [],
		cellForId: {},
	});
	const cells0 = [
		new DisplayBodyCell<User>({
			row: row0,
			column: displayColumns[0],
			label: checkedLabel,
		}),
		new DisplayBodyCell<User>({
			row: row0,
			column: displayColumns[1],
			label: expandedLabel,
		}),
	];
	row0.cells = cells0;
	const cellForId0 = {
		checked: cells0[0],
		expanded: cells0[1],
	};
	row0.cellForId = cellForId0;

	const row1 = new DataBodyRow<User>({
		id: '1',
		dataId: '1',
		original: data[1],
		cells: [],
		cellForId: {},
	});
	const cells1 = [
		new DisplayBodyCell<User>({
			row: row1,
			column: displayColumns[0],
			label: checkedLabel,
		}),
		new DisplayBodyCell<User>({
			row: row1,
			column: displayColumns[1],
			label: expandedLabel,
		}),
	];
	row1.cells = cells1;
	const cellForId1 = {
		checked: cells1[0],
		expanded: cells1[1],
	};
	row1.cellForId = cellForId1;

	const expected: DataBodyRow<User>[] = [row0, row1];

	[0, 1].forEach((rowIdx) => {
		const row = actual[rowIdx];
		expect(actual[rowIdx]).toBeInstanceOf(DataBodyRow);
		if (!row.isData()) {
			throw new Error('Incorrect BodyRow subtype');
		}
		expect(row.original).toStrictEqual(expected[rowIdx].original);
		expect(row.cells.length).toStrictEqual(expected[rowIdx].cells.length);
		row.cells.forEach((_, colIdx) => {
			const cell = row.cells[colIdx];
			expect(cell).toBeInstanceOf(DisplayBodyCell);
			const expectedCell = expected[rowIdx].cells[colIdx];
			if (!(cell instanceof DisplayBodyCell && expectedCell instanceof DisplayBodyCell)) {
				throw new Error('Incorrect instance type');
			}
			expect(cell.label).toEqual(expectedCell.label);
		});
		['checked', 'expanded'].forEach((id) => {
			const cell = row.cellForId[id];
			expect(cell).toBeInstanceOf(DisplayBodyCell);
			const expectedCell = expected[rowIdx].cellForId[id];
			if (!(cell instanceof DisplayBodyCell && expectedCell instanceof DisplayBodyCell)) {
				throw new Error('Incorrect instance type');
			}
			expect(cell.label).toEqual(expectedCell.label);
		});
	});
});
