/* global window */
import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Loader } from '../components';
import { Helmet } from 'react-helmet';
import { OPEN_PAGES } from '../constants';
import { TabBar } from 'antd-mobile';
import styles from './app.less';

const App = ({ children, dispatch, app, loading, location }) => {

    let { pathname } = location;
    pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;

    const isLoading = loading.effects['app/query']
        || loading.effects['dashboard/query']
        || loading.effects['market/query'];

    if (OPEN_PAGES && OPEN_PAGES.includes(pathname)) {
        return (
            <div>
                <Loader fullScreen spinning={isLoading} />
                {children}
            </div>
        );
    }
    return (
        <div>
            <Loader fullScreen spinning={isLoading} />
            <Helmet>
                <title>{`Welcome! ${app.user.name}`}</title>
            </Helmet>
            <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
                <TabBar
                    unselectedTintColor="rgb(0, 38, 77)"
                    tintColor="#7f00ff"
                    barTintColor="white"
                >
                    <TabBar.Item
                        title="资产"
                        icon={<div className={styles.dashboardTab} />}
                        selectedIcon={<div className={styles.dashboardTabSelected} />}
                        selected={pathname === '/dashboard'}
                        onPress={() => dispatch(routerRedux.push({
                            pathname: '/dashboard'
                        }))}
                    >
                        {children}
                    </TabBar.Item>
                    <TabBar.Item
                        title="市场"
                        icon={<div className={styles.marketTab} />}
                        selectedIcon={<div className={styles.marketTabSelected} />}
                        selected={pathname === '/market'}
                        onPress={() => dispatch(routerRedux.push({
                            pathname: '/market'
                        }))}
                        ref={compo => app.marketScrollEl = ReactDOM.findDOMNode(compo)}
                    >
                        {children}
                    </TabBar.Item>
                    <TabBar.Item
                        title="探索"
                        icon={<div className={styles.diamondTab} />}
                        selectedIcon={<div className={styles.diamondTabSelected} />}
                        selected={pathname === '/diamond'}
                        onPress={() => dispatch(routerRedux.push({
                            pathname: '/diamond'
                        }))}
                    >
                        {children}
                    </TabBar.Item>
                </TabBar>
            </div>
        </div>
    );
};

App.propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    app: PropTypes.object,
    loading: PropTypes.object,
};

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App));