/* global window */
/* global document */
import queryString from 'query-string';
import { me, unauth } from '../services/api';
import { routerRedux } from 'dva/router';
import { UserNotFound } from '../utils/error';

export default {

    namespace: 'app',

    state: {
        user: {},
        refererPathname: '',
        refererQuery: {},
        marketScrollEl: null,
    },

    subscriptions: {

        setupHistory({ dispatch, history }) {
            history.listen(location => {
                dispatch({
                    type: 'updateState',
                    payload: {
                        refererPathname: location.pathname,
                        refererQuery: queryString.parse(location.search),
                    },
                });
            });
        },

        setup({ dispatch }) {
            dispatch({ type: 'query' });
        },

    },

    effects: {

        * query(_, { call, put, select }) {
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
                yield put({
                    type: 'updateState',
                    payload: { user },
                });
                if (
                    window.location.pathname === '/login'
                    || window.location.pathname === '/register'
                ) {
                    yield put(routerRedux.push({
                        pathname: '/dashboard'
                    }));
                }
            }
        },

        * logout(_, { call, put }) {
            yield call(unauth);
            yield put({ type: 'query' })
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