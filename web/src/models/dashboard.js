import { my_coins, my_values } from '../services/api';

export default {

    namespace: 'dashboard',

    subscriptions: {

        setup({ dispatch, history }) {
            history.listen(({ pathname }) => {
                if (pathname === '/dashboard' || pathname === '/') {
                    dispatch({ type: 'query' });
                }
            });
        },

    },

    state: {
        totalValue: 0,
        totalInvest: 0,
        coinList: [],
        values: [],
        invest: [],
    },

    effects: {

        *query(_, { call, put }) {
            const myCoins = yield call(my_coins);
            const myValues = yield call(my_values);
            const coinList = myCoins.states;
            const totalValue = coinList.reduce(
                (accumulator, curVal) => accumulator + curVal.value_cny,
                0
            );
            const values = myValues.map(datum => [datum[0] * 1000, datum[1]]);
            yield put({
                type: 'updateState', payload: {
                    values,
                    totalValue,
                    coinList,
                }
            });
        },

    },

    reducers: {

        updateState(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        },

    },

}