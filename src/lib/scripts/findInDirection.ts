import type { Game } from '../../routes/proxy+layout.server';
import makeList from './makeList';

export default (
	game: Game,
	reference: { x: number; y: number },
	direction: { x: number; y: number },
) => {
	const allFields = makeList(game);

	let currentField: { x: number; y: number } = reference;
	const foundFields: typeof allFields = [];

	while (currentField.x >= 0 && currentField.x < 8 && currentField.y >= 0 && currentField.y < 8) {
		currentField = { x: currentField.x + direction.x, y: currentField.y + direction.y };
		const foundField = allFields.find((f) => f.x === currentField.x && f.y === currentField.y);
		if (foundField) foundFields.push(foundField);
		else break;
	}

	return foundFields;
};
