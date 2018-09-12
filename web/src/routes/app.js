/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import { Loader } from '../components';
import { Helmet } from 'react-helmet';
import { TabBar } from 'antd-mobile';
import styles from './app.less';
import Dashboard from './dashboard';
import Market from './market';
import Diamond from './diamond';
import dynamic from 'dva/dynamic';

dynamic.setDefaultLoadingComponent(() => {
    return <Loader fullScreen spinning={true} />;
});

class App extends React.Component {

    static propTypes = {
        dva: PropTypes.object,
        location: PropTypes.object,
        dispatch: PropTypes.func,
        app: PropTypes.object,
        loading: PropTypes.object,
    }

    _Login = dynamic({
        app: this.props.dva,
        models: () => [import('../models/login')],
        component: () => import('./login')
    })

    _Register = dynamic({
        app: this.props.dva,
        models: () => [import('../models/register')],
        component: () => import('./register')
    })

    _Coin = dynamic({
        app: this.props.dva,
        models: () => [import('../models/coin')],
        component: () => import('./coin')
    })

    _Balance = dynamic({
        app: this.props.dva,
        component: () => import('./balance')
    })

    _Triggers = dynamic({
        app: this.props.dva,
        component: () => import('./diamond/Triggers')
    })

    componentDidMount() {
        console.log('App did mount');
    }

    render() {
        const { dispatch, app, loading, location } = this.props;

        let { pathname } = location;
        const isDashboard = pathname === '/dashboard';
        const isMarket = pathname === '/market';
        const isDiamond = pathname === '/diamond';

        const isLoading = loading.effects['app/boot']
            || loading.effects['app/queryDashboard']
            || loading.effects['app/queryMarket']
            || loading.effects['app/queryDiamond']
            || loading.effects['coin/query'];

        return (
            <div>
                <Helmet>
                    <title>{`Welcome! ${app.user.name || ''}`}</title>
                </Helmet>
                <Loader fullScreen spinning={isLoading} />
                <div className={styles.fullScreen}>
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
                            onPress={() => dispatch({
                                type: 'app/queryDashboard',
                            })}
                        >
                            <Dashboard />
                        </TabBar.Item>
                        <TabBar.Item
                            title="市场"
                            icon={<div className={styles.marketTab} />}
                            selectedIcon={<div className={styles.marketTabSelected} />}
                            selected={isMarket}
                            onPress={() => dispatch({
                                type: 'app/queryMarket',
                            })}
                        >
                            <Market />
                        </TabBar.Item>
                        <TabBar.Item
                            title="探索"
                            icon={<div className={styles.diamondTab} />}
                            selectedIcon={<div className={styles.diamondTabSelected} />}
                            selected={isDiamond}
                            onPress={() => dispatch({
                                type: 'app/queryDiamond',
                            })}
                        >
                            <Diamond />
                        </TabBar.Item>
                    </TabBar>
                </div>
                <Switch>
                    <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
                    <Route exact path="/login" component={this._Login} />
                    <Route exact path="/register" component={this._Register} />
                    <Route path="/coins/:coin_id" component={this._Coin} />
                    <Route path="/balance" component={this._Balance} />
                    <Route path="/triggers" component={this._Triggers} />
                </Switch>
            </div>
        );
    }
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App));