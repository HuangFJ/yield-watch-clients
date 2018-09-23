/* global window */
/* global document */
import queryString from 'query-string';
import { me, unauth, my_coins, my_values, coins as coins_api, set_balance, del_balance } from '../services/api';
import { routerRedux } from 'dva/router';
import { UserNotFound } from '../utils/error';
import lodash from 'lodash';

export default {

    namespace: 'app',

    state: {
        user: {},
        refererPathname: '',
        refererQuery: {},
        dashboard: {
            totalValue: -1,
            totalInvest: 0,
            coinList: [],
            values: [],
            invest: [],
            investRaw: [],
        },
        market: {
            coins: [],
            coinsRaw: [],
        },
    },

    subscriptions: {

        setupHistory({ dispatch, history }) {
            history.listen(location => {
                const pathname = location.pathname;
                console.log(pathname);
                if (pathname === '/dashboard') {
                    dispatch({ type: 'queryDashboard' });
                } else if (pathname === '/market') {
                    dispatch({ type: 'queryMarket' });
                } else if (pathname === '/diamond') {
                    dispatch({ type: 'queryDiamond' });
                }

                dispatch({
                    type: 'updateState',
                    payload: {
                        refererPathname: pathname,
                        refererQuery: queryString.parse(location.search),
                    },
                });
            });
        },

        setup({ dispatch }) {
            // when reload the special browser page
            dispatch({ type: 'boot' });
            window.navigator.serviceWorker.register('/serviceworker.js');
        },

    },

    effects: {

        * boot(_, { call, put, select }) {
            const ret = yield call(me);
            const { refererPathname } = yield select(_ => _.app);
            if (ret.err) {
                if (ret.err instanceof UserNotFound) {
                    yield put(routerRedux.push({
                        pathname: '/register',
                    }));
                } else {
                    yield put(routerRedux.push({
                        pathname: '/login',
                        search: queryString.stringify({
                            from: refererPathname,
                        }),
                    }));
                }
            } else {
                const user = ret.data;
                yield put({ type: 'updateState', payload: { user } });

                let { pathname } = window.location;
                if (
                    pathname === '/'
                    || pathname === '/login'
                    || pathname === '/register'
                    || pathname === '/dashboard'
                ) {
                    yield put({ type: 'queryDashboard' });
                } else if (pathname === '/market') {
                    yield put({ type: 'queryMarket' });
                } else if (pathname === '/diamond') {
                    yield put({ type: 'queryDiamond' });
                }
            }
        },

        * queryDashboard(_, { call, put, select }) {
            // if not login, do nothing
            // query and redirect. if queried, redirect only
            // if current location is self, do not redirect
            const needRoute = window.location.pathname !== '/dashboard';
            const router = routerRedux.push({ pathname: '/dashboard' });

            const user = yield select(_ => _.app.user);
            if (lodash.isEmpty(user)) return;

            const dashboard = yield select(_ => _.app.dashboard);
            if (dashboard.totalValue !== -1) {
                if (needRoute) yield put(router);
                return;
            }

            console.log('query dashboard data');
            const myCoins = yield call(my_coins);
            const myValues = yield call(my_values);
            const coinList = myCoins.states;
            const totalValue = coinList.reduce(
                (accumulator, curVal) => accumulator + curVal.value_cny,
                0
            );
            const values = myValues.map(datum => [datum[0] * 1000, datum[1]]);
            yield put({
                type: 'updateDashboardState',
                payload: {
                    values,
                    totalValue,
                    coinList,
                },
            });
            yield put({
                type: 'updateInvest',
                payload: myCoins.balance,
            });

            if (needRoute) yield put(router);
        },

        * queryMarket(_, { call, put, select }) {
            const needRoute = window.location.pathname !== '/market';
            const router = routerRedux.push({ pathname: '/market' });

            const user = yield select(_ => _.app.user);
            if (lodash.isEmpty(user)) return;

            const market = yield select(_ => _.app.market);
            if (market.coinsRaw.length) {
                if (needRoute) yield put(router);
                return;
            }

            console.log('query market data');
            const coinsRaw = yield call(coins_api);
            const coins = coinsRaw;
            yield put({
                type: 'updateMarketState',
                payload: { coins, coinsRaw },
            });

            if (needRoute) yield put(router);
        },

        * queryDiamond(_, { put }) {
            const needRoute = window.location.pathname !== '/diamond';
            const router = routerRedux.push({ pathname: '/diamond' });

            if (needRoute) yield put(router);
        },

        * logout(_, { call, put }) {
            yield call(unauth);
            yield put({ type: 'boot' })
        },

        * delBalance({ payload }, { put, call, select }) {
            yield call(del_balance, payload);
            const myCoins = yield call(my_coins);
            yield put({
                type: 'updateInvest',
                payload: myCoins.balance,
            });
        },

        * setBalance({ payload }, { put, call }) {
            yield call(set_balance, payload);
            const myCoins = yield call(my_coins);
            yield put({
                type: 'updateInvest',
                payload: myCoins.balance,
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

        updateDashboardState(state, { payload }) {
            const { dashboard, ...other } = state;
            return {
                ...other,
                dashboard: {
                    ...dashboard,
                    ...payload,
                },
            }
        },

        updateMarketState(state, { payload }) {
            const { market, ...other } = state;
            return {
                ...other,
                market: {
                    ...market,
                    ...payload,
                },
            }
        },

        updateInvest(state, { payload }) {
            const { dashboard, ...other } = state;
            const totalInvest = payload[payload.length - 1] ? payload[payload.length - 1][1] : 0;
            const invest = payload.map(datum => [datum[0] * 1000, datum[1], datum[2]]);
            const investRaw = invest.slice();
            const valueStartPoint = dashboard.values[0];
            if (invest.length && valueStartPoint) {
                if (invest[0][0] > valueStartPoint[0]) {
                    // align start
                    invest.unshift([valueStartPoint[0], 0]);
                }
                invest.push([new Date().getTime(), invest[invest.length - 1][1]]);
            }
            console.log('Invest data: ', invest)
            return {
                ...other,
                dashboard: {
                    ...dashboard,
                    totalInvest,
                    invest,
                    investRaw
                },
            }
        },

    }

}