import dva from 'dva';
import './index.css';
import createLoading from 'dva-loading';
import createHistory from 'history/createBrowserHistory';

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
app.model(require('./models/app').default);

// 4. Router by react-router
app.router(require('./router').default);

// 5. Start
app.start('#root');
