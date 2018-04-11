import { coin } from '../services/api';

export default {

    namespace: 'coin',

    state: {
        detail: {},
    },

    effects: {
        * query({payload}, {put, call}){
            const detail = yield call(coin, {id: payload.coinId});
            detail.history = detail.history.map(datum => [datum[0] * 1000, datum[1]]);
            yield put({
                type: 'updateState',
                payload: { detail },
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