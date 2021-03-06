import dva from 'dva';
import createLoading from 'dva-loading';
import createHistory from 'history/createBrowserHistory';
import router from './router';
import './index.css';

import appModel from './models/app';

// 1. Initialize
const app = dva({
    history: createHistory(),
    onError(error, dispatch) {
        console.log(`Oops! ${error.message}`);
    },
});

// 2. Plugins
app.use(createLoading({
    effects: true,
}));

// 3. Model by redux
app.model(appModel);

// 4. Router by react-router
app.router(router);

// 5. Start
app.start('#root');
