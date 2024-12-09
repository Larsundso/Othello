import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (req) => {
	const game = req.cookies.get('game');
	if (!game)
		return {
			fields: (new Array(8).fill(new Array(8).fill(null)) as null[][]).map((row, i) =>
				row.map((_, j) => ([3, 4].includes(i) && [3, 4].includes(j) ? (i + j) % 2 : null)),
			),
			now: Math.round(Math.random() * 2) > 1 ? 1 : 0,
			restored: false,
		} as Game;

	return { ...JSON.parse(game), restored: true } as Game;
};

export interface Game {
	fields: (0 | 1 | null)[][];
	now: 0 | 1;
	restored: boolean;
}
