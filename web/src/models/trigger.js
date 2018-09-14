import { del_trigger, set_trigger, get_triggers, get_trigger } from '../services/api';
import { routerRedux } from 'dva/router'

export default {

    namespace: 'trigger',

    state: {
        triggers: [],
        trigger: {
            coin: {}
        }
    },

    subscriptions: {

        setupHistory({ dispatch, history }) {
            const pathname = history.location.pathname;
            const found = pathname.match(/^\/triggers\/([^\/]+)$/)
            if (found) {
                const coin_id = found[1]
                dispatch({
                    type: 'queryTrigger',
                    payload: { coin_id }
                })
            }
        },

    },

    effects: {
        * queryTriggers(_, { call, put }) {
            const triggers = yield call(get_triggers);
            triggers.sort((a, b) => a.coin.rank - b.coin.rank)
            yield put({
                type: 'updateState',
                payload: { triggers },
            });
        },

        * queryTrigger({ payload }, { put, call }) {
            const trigger = yield call(get_trigger, payload);
            yield put({
                type: 'updateState',
                payload: { trigger },
            });
        },

        * switchTrigger({ payload }, { put, call, select }) {
            const { coin_id, status } = payload
            const trigger = yield call(set_trigger, { coin_id, status: +status });
            const triggers = yield select(_ => _.trigger.triggers)
            const index = triggers.findIndex(e => e.coin_id === trigger.coin_id)
            if (index >= 0) {
                triggers[index] = trigger
            }
            yield put({
                type: 'updateState',
                payload: { triggers, trigger },
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

        * delTrigger({ payload }, { put, call, select }) {
            const { coin_id } = payload
            yield call(del_trigger, { coin_id });
            const { coin } = yield select(_ => _.trigger.trigger)
            const triggers = yield select(_ => _.trigger.triggers)
            const index = triggers.findIndex(e => e.coin_id === coin.id)
            if (index >= 0) {
                triggers.splice(index, 1)
            }
            yield put({
                type: 'updateState',
                payload: { triggers, trigger: { coin } },
            });
        },

        * triggerDetail({ payload }, { put }) {
            yield put({
                type: 'updateState',
                payload: { trigger: payload.trigger },
            })

            yield put(routerRedux.push({
                pathname: `/triggers/${payload.trigger.coin.id}`,
            }))
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