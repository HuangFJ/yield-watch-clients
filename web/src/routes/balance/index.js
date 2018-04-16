import React from 'react';
import { connect } from 'dva';
import { routerRedux, Switch, Route } from 'dva/router';
import { NavBar, List, Flex, SwipeAction, Icon, Button } from 'antd-mobile';
import styles from '../app.less';
import { timeFormat } from 'd3';
import Detail from './Detail';
import classNames from 'classnames';

class Balance extends React.Component {

    componentDidMount() {
        console.log('Balance did mount');
    }

    render() {
        const { invest, history, match, dispatch, loading } = this.props;
        return (
            <div>
                <div className={styles.flexPage}>
                    <div className={styles.nav}>
                        <NavBar mode="dark"
                            leftContent={<Flex><Icon type="left" />返回</Flex>}
                            onLeftClick={history.goBack}>
                            净入金变化
                        </NavBar>
                    </div>
                    <div className={styles.body}>
                        <List renderHeader={() => (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{flex: 1}}>净入金为累计入金减去累计出金，可以是负值。</span>
                                <Icon className={classNames({
                                    [styles.hidden]: !loading.effects['app/delBalance']
                                })} type="loading" size="xxs" />
                            </div>
                        )}>
                            {!invest.length ? null :
                                invest.map((row) => (
                                    <SwipeAction
                                        key={row[2]}
                                        autoClose
                                        right={[{
                                            text: '删除',
                                            onPress: () => {
                                                this.props.dispatch({
                                                    type: 'app/delBalance',
                                                    payload: row,
                                                })
                                            },
                                            style: { backgroundColor: 'red', color: 'white' },
                                        }]}>
                                        <List.Item key={row[2]} extra={`￥${row[1]}`}
                                            onClick={() => dispatch(routerRedux.push({
                                                pathname: `${match.url}/${row[2]}`,
                                            }))}
                                        >
                                            {timeFormat("%Y-%m-%d")(new Date(row[0]))}
                                        </List.Item>
                                    </SwipeAction>
                                ))
                            }
                            <List.Item>
                                <Button type="ghost" size="small" onClick={() => dispatch(routerRedux.push({
                                    pathname: `${match.url}/0`,
                                }))}>录入</Button>
                            </List.Item>
                        </List>
                    </div>
                </div>
                <Switch>
                    <Route path={`${match.url}/:id`} component={Detail} />
                </Switch>
            </div>
        )
    }
}

export default connect(({ app, loading }) => ({ invest: app.dashboard.investRaw, loading }))(Balance);