import { coins as coins_api } from '../services/api';

export default {

    namespace: 'market',

    state: {
        coins: [],
        coinsRaw: [],
        scrollToIndex: -1,
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
            const { call, put } = actions;
            const coinsRaw = yield call(coins_api);
            const coins = coinsRaw;
            yield put({
                type: 'updateState',
                payload: { coins, coinsRaw },
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