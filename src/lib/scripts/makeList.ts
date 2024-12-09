import type { Game } from '../../routes/proxy+layout.server';

export default (game: Game): { x: number; y: number; value: 0 | 1 | null }[] =>
	game.fields.map((f, i) => f.map((c, j) => ({ x: i, y: j, value: c }))).flat(1);
