import Cookies from 'js-cookie';

export default () => {
	Cookies.remove('game', { sameSite: 'strict', secure: false });
	location.reload();
};
