import type { Game } from '../../routes/proxy+layout.server';
import Cookies from 'js-cookie';

export default (game: Game) => {
	Cookies.set('game', JSON.stringify(game), {
		sameSite: 'strict',
		secure: false,
	});
};
