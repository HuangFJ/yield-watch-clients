import { coins as coins_api } from '../services/api';

export default {

    namespace: 'market',

    state: {
        coins: [],
        scrollEl: null,
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
            const { call, put, select } = actions;
            const scrollEl = yield select(_ => _.app.marketScrollEl)
            const coinsRaw = yield call(coins_api);
            const coins = coinsRaw;
            yield put({
                type: 'updateState',
                payload: { coins, scrollEl, coinsRaw },
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