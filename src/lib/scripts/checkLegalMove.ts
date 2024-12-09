import type { Game } from '../../routes/proxy+layout.server';
import findInDirection from './findInDirection';

export default (
	game: Game,
	x: number,
	y: number,
): { changingFields: { x: number; y: number; value: 0 | 1 | null }[]; success: boolean } => {
	if (game.fields[x][y] !== null) return { success: false, changingFields: [] };

	const neighbours = [
		// above
		findInDirection(game, { x, y }, { x: -1, y: -1 }),
		findInDirection(game, { x, y }, { x: -1, y: 0 }),
		findInDirection(game, { x, y }, { x: -1, y: 1 }),

		// left and right
		findInDirection(game, { x, y }, { x: 0, y: -1 }),
		findInDirection(game, { x, y }, { x: 0, y: 1 }),

		// below
		findInDirection(game, { x, y }, { x: 1, y: -1 }),
		findInDirection(game, { x, y }, { x: 1, y: 0 }),
		findInDirection(game, { x, y }, { x: 1, y: 1 }),
	];

	const validNeighbours = neighbours
		.filter((n) => n.find((f) => f.value === game.now))
		.filter((n) => n.find((f, i) => f.value === game.now && n[i - 1]?.value !== null))
		.map((n) =>
			n.slice(
				0,
				n.findIndex((f) => f.value === null),
			),
		)
		.filter((n) => n.at(0)?.value !== game.now)
		.map((n) =>
			n.slice(
				0,
				n.findIndex((f) => f.value === game.now),
			),
		);


	if (!validNeighbours.length || !validNeighbours.find((f) => f.length)) {
		return { success: false, changingFields: [] };
	}

	return { success: true, changingFields: validNeighbours.flat(1) };
};
