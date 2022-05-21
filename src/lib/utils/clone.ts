import type { BodyRow } from '$lib/bodyRows';

export interface Clonable<T> {
	clone(): T;
}

export const isClonable = <T>(obj: unknown): obj is Clonable<T> => {
	return typeof (obj as Clonable<T>).clone === 'function';
};

export const getCloned = <T extends object>(source: T, props?: Partial<T>): T => {
	const clone = isClonable(source)
		? source.clone()
		: Object.assign(Object.create(Object.getPrototypeOf(source)), source);
	if (props !== undefined) {
		Object.assign(clone, props);
	}
	return clone;
};

export const getClonedRow = <Item, Row extends BodyRow<Item>>(
	row: Row,
	props?: Partial<Row>
): Row => {
	const clonedRow = getCloned(row, props);
	const clonedCellsForId = Object.fromEntries(
		Object.entries(clonedRow.cellForId).map(([id, cell]) => {
			return [
				id,
				getCloned(cell, {
					row: clonedRow,
				}),
			];
		})
	);
	const clonedCells = clonedRow.cells.map(({ id }) => clonedCellsForId[id]);
	clonedRow.cellForId = clonedCellsForId;
	clonedRow.cells = clonedCells;
	return clonedRow;
};
