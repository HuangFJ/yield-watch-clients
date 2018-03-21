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
                    unselectedTintColor="#949494"
                    tintColor="#33A3F4"
                    barTintColor="white"
                >
                    <TabBar.Item
                        title="DashBoard"
                        icon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png) center center /  21px 21px no-repeat'
                        }}
                        />
                        }
                        selectedIcon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png) center center /  21px 21px no-repeat'
                        }}
                        />
                        }
                        selected={pathname === '/dashboard'}
                        onPress={() => dispatch(routerRedux.push({
                            pathname: '/dashboard'
                        }))}
                    >
                        {children}
                    </TabBar.Item>
                    <TabBar.Item
                        title="Market"
                        icon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png) center center /  21px 21px no-repeat'
                        }}
                        />
                        }
                        selectedIcon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png) center center /  21px 21px no-repeat'
                        }}
                        />
                        }
                        selected={pathname === '/market'}
                        onPress={() => dispatch(routerRedux.push({
                            pathname: '/market'
                        }))}
                        ref={compo => app.marketScrollEl = ReactDOM.findDOMNode(compo)}
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