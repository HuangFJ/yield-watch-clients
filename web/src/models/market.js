import { coins as coins_api } from '../services/api';

export default {

    namespace: 'market',

    state: {
        coins: [],
        scrollEl: null,
    },

    subscriptions: {
        setup(args) {
            const { dispatch, history } = args;
            history.listen(({ pathname }) => {
                if (pathname === '/market') {
                    dispatch({ type: 'query' });
                }
            });
        },
    },

    effects: {
        *query(_, actions) {
            const { call, put, select } = actions;
            const scrollEl = yield select(_=>_.app.marketScrollEl)
            const coins = yield call(coins_api);
            yield put({
                type: 'updateState',
                payload: { coins , scrollEl},
            })
        }
    },

    reducers: {
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        }
    }

}