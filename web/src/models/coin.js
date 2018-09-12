import { coin, get_coin_states, del_coin_state, set_coin_state, set_trigger, del_trigger, get_trigger } from '../services/api';

export default {

    namespace: 'coin',

    state: {
        detail: {},
        coinState: [],
        trigger: {}
    },

    effects: {
        * query({ payload }, { put, call }) {
            const detail = yield call(coin, payload);
            const coinState = yield call(get_coin_states, payload);
            const trigger = yield call(get_trigger, payload);
            detail.history = detail.history.map(datum => [datum[0] * 1000, datum[1]]);
            yield put({
                type: 'updateState',
                payload: { detail, coinState, trigger },
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

        * setCoinState({ payload }, { put, call }) {
            yield call(set_coin_state, payload);
            const coinState = yield call(get_coin_states, payload);
            yield put({
                type: 'updateState',
                payload: { coinState },
            });
            yield put({
                type: 'app/updateDashboardState',
                payload: { totalValue: -1, coinList: [] },
            });
        },

        * switchTrigger({ payload }, { put, call }) {
            const { coin_id, status } = payload
            const trigger = yield call(set_trigger, { coin_id, status: +status });
            yield put({
                type: 'updateState',
                payload: { trigger },
            });
        },

        * setTrigger({ payload }, { put, call }) {
            const { coin_id, floor, ceil } = payload
            const trigger = yield call(set_trigger, { coin_id, floor: +floor, ceil: +ceil });
            yield put({
                type: 'updateState',
                payload: { trigger },
            });
        },

        * delTrigger({ payload }, { put, call }) {
            const { coin_id } = payload
            yield call(del_trigger, { coin_id });
            yield put({
                type: 'updateState',
                payload: { trigger: {} },
            });
        }

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