import { sms, auth } from '../services/api';

const delay = timeout => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

export default {

    namespace: 'login',

    state: {
        interval: 0,
        countdown: false,
        disabled: true,
    },

    effects: {

        * sms({ payload }, { call, put, select }) {
            const { interval } = yield call(sms, payload);
            yield put({
                type: 'updateState',
                payload: { interval, countdown: true },
            });

            while (true) {
                let { interval, countdown } = yield select(_ => _.login);
                console.log(`SMS Countdown: ${countdown}, ${interval}`);
                if (!countdown || interval <= 0) break;
                yield call(delay, 1000);
                interval = interval - 1;
                yield put({
                    type: 'updateState',
                    payload: { interval },
                });
                if (interval <= 0) break;
            }
        },

        * smsAuth({ payload }, { call, put }) {
            yield call(auth, payload);
            yield put({
                type: 'updateState',
                payload: { countdown: false },
            });
            yield put({ type: 'app/boot' });
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

};
