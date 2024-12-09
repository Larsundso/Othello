import type { Game } from '../../routes/proxy+layout.server';
import getLegalMoves from './getLegalMoves';

export default (game: Game) => !!getLegalMoves(game).length;
