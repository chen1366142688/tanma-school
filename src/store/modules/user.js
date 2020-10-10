import Cookies from 'js-cookie';

const user = {
    state: {},
    mutations: {
        logout (state, vm) {
            Cookies.remove('user');
            sessionStorage.clear();
        }
    }
};

export default user;
