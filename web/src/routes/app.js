/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Loader } from '../components';
import { Helmet } from 'react-helmet';
import { TAB_PAGES } from '../constants';
import { TabBar } from 'antd-mobile';
import styles from './app.less';

const App = ({ children, dispatch, app, loading, location }) => {

    let { pathname } = location;
    pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
    const isDashboard = pathname === '/dashboard';
    const isMarket = pathname === '/market';
    const isDiamond = pathname === '/diamond';

    const isLoading = loading.effects['app/query']
        || loading.effects['dashboard/query']
        || loading.effects['market/query'];

    if (TAB_PAGES && TAB_PAGES.includes(pathname)) {
        return (
            <div>
                <Loader fullScreen spinning={isLoading} />
                <Helmet>
                    <title>{`Welcome! ${app.user.name || ''}`}</title>
                </Helmet>
                <div className={styles.tabsWrapper}>
                    <TabBar
                        unselectedTintColor="#000"
                        tintColor="#7f00ff"
                        barTintColor="white"
                    >
                        <TabBar.Item
                            title="资产"
                            icon={<div className={styles.dashboardTab} />}
                            selectedIcon={<div className={styles.dashboardTabSelected} />}
                            selected={isDashboard}
                            onPress={() => dispatch(routerRedux.push({
                                pathname: '/dashboard'
                            }))}
                        >
                            {isDashboard ? children : null}
                        </TabBar.Item>
                        <TabBar.Item
                            title="市场"
                            icon={<div className={styles.marketTab} />}
                            selectedIcon={<div className={styles.marketTabSelected} />}
                            selected={isMarket}
                            onPress={() => dispatch(routerRedux.push({
                                pathname: '/market'
                            }))}
                        >
                            {isMarket ? children : null}
                        </TabBar.Item>
                        <TabBar.Item
                            title="探索"
                            icon={<div className={styles.diamondTab} />}
                            selectedIcon={<div className={styles.diamondTabSelected} />}
                            selected={isDiamond}
                            onPress={() => dispatch(routerRedux.push({
                                pathname: '/diamond'
                            }))}
                        >
                            {isDiamond ? children : null}
                        </TabBar.Item>
                    </TabBar>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <Loader fullScreen spinning={isLoading} />
                {children}
            </div>
        );
    }
};

App.propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    app: PropTypes.object,
    loading: PropTypes.object,
};

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App));