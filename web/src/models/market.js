import { coins as coins_api } from '../services/api';

export default {

    namespace: 'market',

    state: {
        coins: [],
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({ pathname }) => {
                if (pathname === '/market') {
                    dispatch({ type: 'query' });
                }
            });
        },
    },

    effects: {
        *query(_, { call, put }) {
            const coins = yield call(coins_api);
            yield put({
                type: 'updateState',
                payload: { coins },
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