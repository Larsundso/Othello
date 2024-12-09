import type { Game } from '../../routes/proxy+layout.server';
import checkLegalMove from './checkLegalMove';
import makeList from './makeList';

export default (game: Game) => {
	const allEmptyFields = makeList(game).filter((f) => f.value === null);

	const legalMoves: typeof allEmptyFields = [];

	while (allEmptyFields.length) {
		if (checkLegalMove(game, allEmptyFields[0].x, allEmptyFields[0].y).success) {
			legalMoves.push(allEmptyFields[0]);
		}

		allEmptyFields.shift();
	}

	return legalMoves;
};
