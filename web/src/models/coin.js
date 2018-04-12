import { coin, get_coin_states, del_coin_state, set_coin_state } from '../services/api';

export default {

    namespace: 'coin',

    state: {
        detail: {},
        coinState: [],
    },

    effects: {
        * query({ payload }, { put, call }) {
            const detail = yield call(coin, payload);
            const coinState = yield call(get_coin_states, payload);
            detail.history = detail.history.map(datum => [datum[0] * 1000, datum[1]]);
            yield put({
                type: 'updateState',
                payload: { detail, coinState },
            });
        },

        * delCoinState({ payload }, { put, call, select }) {
            yield call(del_coin_state, payload);
            const coin_id = yield select(_ => _.coin.detail.id);
            const coinState = yield call(get_coin_states, { coin_id });
            yield put({
                type: 'updateState',
                payload: { coinState },
            });
            yield put({
                type: 'app/updateDashboardState',
                payload: { totalValue: -1, coinList: [] },
            });
        },

        * setCoinState({ payload: { history, ...data } }, { put, call }) {
            yield call(set_coin_state, data);
            const coinState = yield call(get_coin_states, data);
            yield put({
                type: 'updateState',
                payload: { coinState },
            });
            yield put({
                type: 'app/updateDashboardState',
                payload: { totalValue: -1, coinList: [] },
            });
            history.goBack();
        },

    },

    reducers: {

        updateState(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        },
    }

}