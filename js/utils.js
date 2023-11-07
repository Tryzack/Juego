import CollisionBlock from "./classes/CollisionBlock.js";

const convertAndCreateObjects = (matrix) => {
	matrix = parse2D(matrix);
	matrix = createObjectsFrom2D(matrix);
	return matrix;
};

const parse2D = (matrix) => {
	const rows = [];
	for (let i = 0; i < matrix.length; i += 16) {
		rows.push(matrix.slice(i, i + 16));
	}
	return rows;
};

const createObjectsFrom2D = (matrix) => {
	const objects = [];
	matrix.forEach((row, y) => {
		row.forEach((symbol, x) => {
			if (symbol == 292) {
				const block = new CollisionBlock({
					x: x * 64,
					y: y * 64,
				});
				objects.push(block);
			}
		});
	});
	return objects;
};

export { parse2D };
export { createObjectsFrom2D };
export { convertAndCreateObjects };
