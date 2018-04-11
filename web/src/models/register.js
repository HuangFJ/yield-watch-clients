import { register } from "../services/api";

export default {

    namespace: 'register',

    state: null,

    effects: {

        * submit({ payload }, { call, put }) {
            yield call(register, payload);
            yield put({ type: 'app/boot' });
        },

    },

}