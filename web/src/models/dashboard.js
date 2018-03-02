import { my_coins, my_values } from '../services/api';

export default {

    namespace: 'dashboard',

    subscriptions: {

        setup({ dispatch, history }) {
            history.listen(({ pathname }) => {
                if (pathname === '/dashboard' || pathname === '/') {
                    dispatch({ type: 'myCoins' });
                    dispatch({ type: 'myValues' });
                }
            });
        },

    },

    state: {
        totalValue: 0,
        totalInvest: 0,
        coinList: [],
        values: [],
    },

    effects: {

        *myCoins(_, { call, put, select }) {
            const coinList = yield call(my_coins);
            yield put({ type: 'updateCoins', payload: coinList });
        },

        *myValues(_, { call, put }) {
            const data = yield call(my_values);
            yield put({ type: 'updateValues', payload: data });
        },

    },

    reducers: {

        updateCoins(state, { payload }) {
            const coinList = payload.states;
            const totalValue = coinList.reduce(
                (accumulator, curVal) => accumulator + curVal.value_cny,
                0
            ).toFixed(2);
            return {
                ...state,
                coinList,
                totalValue,
            }
        },

        updateValues(state, { payload }) {
            const values = payload.map(datum => [datum[0] * 1000, datum[1]]);
            return {
                ...state,
                values,
            }
        },

    },

}