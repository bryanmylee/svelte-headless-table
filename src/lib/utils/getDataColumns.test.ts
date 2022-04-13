import type { SampleRow } from '$lib/sampleRows';
import { createColumns, createDataColumn, createGroup } from './createColumns';
import { getDataColumns } from './getDataColumns';

describe('getDataColumns', () => {
	test('3 columns', () => {
		const columns = createColumns<SampleRow>([
			createDataColumn({
				header: 'First Name',
				key: 'firstName',
			}),
			createDataColumn({
				header: 'Last Name',
				key: 'lastName',
			}),
			createDataColumn({
				header: 'Age',
				key: 'age',
			}),
		]);

		const actual = getDataColumns(columns);

		const expected = [
			createDataColumn({
				header: 'First Name',
				key: 'firstName',
			}),
			createDataColumn({
				header: 'Last Name',
				key: 'lastName',
			}),
			createDataColumn({
				header: 'Age',
				key: 'age',
			}),
		];

		expect(actual).toStrictEqual(expected);
	});

	test('1 group column over 3 columns', () => {
		const columns = createColumns<SampleRow>([
			createGroup({
				header: 'Info',
				columns: [
					createDataColumn({
						header: 'First Name',
						key: 'firstName',
					}),
					createDataColumn({
						header: 'Last Name',
						key: 'lastName',
					}),
					createDataColumn({
						header: 'Age',
						key: 'age',
					}),
				],
			}),
		]);

		const actual = getDataColumns(columns);

		const expected = [
			createDataColumn({
				header: 'First Name',
				key: 'firstName',
			}),
			createDataColumn({
				header: 'Last Name',
				key: 'lastName',
			}),
			createDataColumn({
				header: 'Age',
				key: 'age',
			}),
		];

		expect(actual).toStrictEqual(expected);
	});

	test('1 group column over 2 columns, 1 group column over 3 columns', () => {
		const columns = createColumns<SampleRow>([
			createGroup({
				header: 'Name',
				columns: [
					createDataColumn({
						header: 'First Name',
						key: 'firstName',
					}),
					createDataColumn({
						header: 'Last Name',
						key: 'lastName',
					}),
				],
			}),
			createGroup({
				header: 'Info',
				columns: [
					createDataColumn({
						header: 'Age',
						key: 'age',
					}),
					createDataColumn({
						header: 'Status',
						key: 'status',
					}),
					createDataColumn({
						header: 'Profile Progress',
						key: 'progress',
					}),
				],
			}),
		]);

		const actual = getDataColumns(columns);

		const expected = [
			createDataColumn({
				header: 'First Name',
				key: 'firstName',
			}),
			createDataColumn({
				header: 'Last Name',
				key: 'lastName',
			}),
			createDataColumn({
				header: 'Age',
				key: 'age',
			}),
			createDataColumn({
				header: 'Status',
				key: 'status',
			}),
			createDataColumn({
				header: 'Profile Progress',
				key: 'progress',
			}),
		];

		expect(actual).toStrictEqual(expected);
	});

	test('uneven columns, 1 group column over 2 columns, 3 columns', () => {
		const columns = createColumns<SampleRow>([
			createGroup({
				header: 'Name',
				columns: [
					createDataColumn({
						header: 'First Name',
						key: 'firstName',
					}),
					createDataColumn({
						header: 'Last Name',
						key: 'lastName',
					}),
				],
			}),
			createDataColumn({
				header: 'Age',
				key: 'age',
			}),
			createDataColumn({
				header: 'Status',
				key: 'status',
			}),
			createDataColumn({
				header: 'Profile Progress',
				key: 'progress',
			}),
		]);

		const actual = getDataColumns(columns);

		const expected = [
			createDataColumn({
				header: 'First Name',
				key: 'firstName',
			}),
			createDataColumn({
				header: 'Last Name',
				key: 'lastName',
			}),
			createDataColumn({
				header: 'Age',
				key: 'age',
			}),
			createDataColumn({
				header: 'Status',
				key: 'status',
			}),
			createDataColumn({
				header: 'Profile Progress',
				key: 'progress',
			}),
		];

		expect(actual).toStrictEqual(expected);
	});
});
