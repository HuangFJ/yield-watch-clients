import React from 'react';
import { connect } from 'dva';
import { routerRedux, Switch, Route } from 'dva/router';
import lodash from 'lodash';
import { NavBar, List, Flex, SwipeAction, Icon, Button } from 'antd-mobile';
import { ValueChart } from '../dashboard/components';
import { compactInteger } from '../../utils/common';
import styles from '../app.less';
import CoinState from './CoinState';
import * as d3 from 'd3';

class Coin extends React.Component {

    _changeColor(val) {
        if (val > 0) {
            return styles.changeColorUp;
        } else if (val < 0) {
            return styles.changeColorDown;
        }
    }

    componentWillMount() {
        const params = this.props.match.params;
        this.props.dispatch({
            type: 'coin/query',
            payload: params,
        });
    }

    componentDidMount() {
        console.log('Coin did mount');
    }

    render() {
        const { coin: { detail, coinState }, history, match, dispatch } = this.props;
        return (
            <div>
                <div className={styles.flexPage}>
                    <div className={styles.nav}>
                        <NavBar mode="dark"
                            leftContent={<Flex><Icon type="left" />返回</Flex>}
                            onLeftClick={history.goBack}>
                            {lodash.isEmpty(detail) ? null : detail.name}
                        </NavBar>
                    </div>
                    <div className={styles.body}>
                        {lodash.isEmpty(detail) ? null :
                            <div>
                                <List>
                                    <Flex direction="column" style={{ padding: '25px 15px' }}>
                                        <Flex direction="row" className={styles.coinStateGroup} >
                                            <Flex.Item className={styles.coinStateCell}>
                                                <header>{detail.symbol}价格</header>
                                                <p className={this._changeColor(detail.percent_change_1h)} style={{ fontSize: 24 }}>${detail.price_usd}</p>
                                            </Flex.Item>
                                            <Flex.Item className={styles.coinStateCell}>
                                                <header>1H涨跌幅</header>
                                                <p className={this._changeColor(detail.percent_change_1h)}>{detail.percent_change_1h}%</p>
                                            </Flex.Item>
                                        </Flex>
                                        <Flex direction="row" className={styles.coinStateGroup}>
                                            <Flex.Item className={styles.coinStateCell}>
                                                <header>24H涨跌幅</header>
                                                <p className={this._changeColor(detail.percent_change_24h)}>{detail.percent_change_24h}%</p>
                                            </Flex.Item>
                                            <Flex.Item className={styles.coinStateCell}>
                                                <header>24H成交量</header>
                                                <p>${compactInteger(detail.volume_usd, 2)}</p>
                                            </Flex.Item>
                                            <Flex.Item className={styles.coinStateCell}>
                                                <header>总市值</header>
                                                <p>${compactInteger(detail.market_cap_usd, 2)}</p>
                                            </Flex.Item>
                                        </Flex>
                                    </Flex>
                                </List>

                                <List renderHeader={() => '价格变化'}>
                                    <List.Item>
                                        <ValueChart dataValue={detail.history} />
                                    </List.Item>
                                </List>

                                <List renderHeader={() => '持币变化'}>
                                    {!coinState.length ? null :
                                        coinState.map((row) => (
                                            <SwipeAction
                                                key={row.id}
                                                autoClose
                                                right={[{
                                                    text: '删除',
                                                    onPress: () => {
                                                        this.props.dispatch({
                                                            type: 'coin/delCoinState',
                                                            payload: row,
                                                        })
                                                    },
                                                    style: { backgroundColor: 'red', color: 'white' },
                                                }]}>
                                                <List.Item key={row.id} extra={`${row.amount} ${detail.symbol}`}
                                                    onClick={() => dispatch(routerRedux.push({
                                                        pathname: `${match.url}/state/${row.id}`,
                                                    }))}
                                                >
                                                    {d3.timeFormat("%Y-%m-%d")(new Date(row.created * 1000))}
                                                </List.Item>
                                            </SwipeAction>
                                        ))
                                    }
                                    <List.Item>
                                        <Button type="ghost" size="small" onClick={() => dispatch(routerRedux.push({
                                            pathname: `${match.url}/state/0`,
                                        }))}>盘点</Button>
                                    </List.Item>
                                </List>
                            </div>
                        }
                    </div>
                </div>
                <Switch>
                    <Route path={`${match.url}/state/:id`} component={CoinState} />
                </Switch>
            </div>
        )
    }
}

export default connect(({ coin }) => ({ coin }))(Coin);