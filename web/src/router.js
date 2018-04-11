import React from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import App from './routes/app';

// routerRedux use react-router-redux, sync route to state
const { ConnectedRouter } = routerRedux;

const Routers = ({ history, app }) => (
  <ConnectedRouter history={history}>
    <App dva={app} />
  </ConnectedRouter>
);

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
};

export default Routers;