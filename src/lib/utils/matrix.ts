import type { Matrix } from '$lib/types/Matrix';

export const getNullMatrix = (width: number, height: number): Matrix<null> => {
	const result: Matrix<null> = [];
	// Use a loop to create a new array instance per row.
	for (let i = 0; i < height; i++) {
		result.push(Array(width).fill(null));
	}
	return result;
};

export const getTransposed = <T>(matrix: Matrix<T>): Matrix<T> => {
	const height = matrix.length;
	if (height === 0) {
		return matrix;
	}
	const width = matrix[0].length;
	const result: Matrix<T | null> = getNullMatrix(height, width);
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			result[i][j] = matrix[j][i];
		}
	}
	// We guarantee that all elements are filled.
	return result as Matrix<T>;
};
