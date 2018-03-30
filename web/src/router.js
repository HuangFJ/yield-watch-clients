import React from 'react';
import { Redirect, Route, Switch, routerRedux } from 'dva/router';
import PropTypes from 'prop-types';
import App from './routes/app';
import dynamic from 'dva/dynamic';

// routerRedux use react-router-redux, sync route to state
const { ConnectedRouter } = routerRedux;

const Routers = ({ history, app }) => {
  const routes = [
    {
      path: '/login',
      exact: true,
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    }, {
      path: '/register',
      exact: true,
      models: () => [import('./models/register')],
      component: () => import('./routes/register/'),
    }, {
      path: '/dashboard',
      exact: false,
      models: () => [import('./models/dashboard')],
      component: () => import('./routes/dashboard/'),
    }, {
      path: '/market',
      exact: false,
      models: () => [import('./models/market')],
      component: () => import('./routes/market/'),
    }, {
      path: '/diamond',
      exact: false,
      models: () => [import('./models/diamond')],
      component: () => import('./routes/diamond/'),
    },
  ];

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
          {
            routes.map(({ path, exact, ...dynamics }, key) =>
              <Route key={key}
                exact={exact}
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })} />
            )
          }
          <Route
            component={dynamic({
              app,
              models: () => [import('./models/error')],
              component: () => import('./routes/error/'),
            })} />
        </Switch>
      </App>
    </ConnectedRouter>
  );
};

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
};

export default Routers;
