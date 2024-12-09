import type { Game } from '../../routes/proxy+layout.server';

// false = not finished
// 1 = player 1 won
// 0 = player 0 won
// null = draw
export default (game: Game): false | 1 | 0 | null => {
	const emptyFields = game.fields
		.map((row) => row.filter((f) => f === null).length)
		.reduce((a, b) => a + b, 0);

	if (emptyFields) return false;

	const player0Fields = game.fields
		.map((row) => row.filter((f) => f === 0).length)
		.reduce((a, b) => a + b, 0);

	const player1Fields = game.fields
		.map((row) => row.filter((f) => f === 1).length)
		.reduce((a, b) => a + b, 0);

	if (player0Fields === player1Fields) return null;
	return player0Fields > player1Fields ? 0 : 1;
};
