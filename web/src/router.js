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
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    }, {
      path: '/register',
      models: () => [import('./models/register')],
      component: () => import('./routes/register/'),
    }, {
      path: '/dashboard',
      models: () => [import('./models/dashboard')],
      component: () => import('./routes/dashboard/'),
    }, {
      path: '/market',
      models: () => [import('./models/market')],
      component: () => import('./routes/market/'),
    },
  ];

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
          {
            routes.map(({ path, ...dynamics }, key) =>
              <Route key={key}
                exact
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
