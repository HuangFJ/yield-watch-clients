import React from 'react';
import { connect } from 'dva';
import { routerRedux, Switch, Route } from 'dva/router';
import lodash from 'lodash';
import { NavBar, List, Flex, SwipeAction, InputItem, DatePicker, Button, Toast, WingBlank } from 'antd-mobile';
import { ValueChart } from '../dashboard/components';
import { compactInteger } from '../../utils/common';
import styles from '../app.less';
import * as d3 from 'd3';

class CoinStateCore extends React.Component {
    state = {}

    handle = () => {
        let { id, coin_id, amount, date } = this._calc(this.props);
        amount = +amount;

        if (!amount) {
            Toast.fail("请输入持有数量！");
            return;
        }

        this.props.dispatch({
            type: 'coin/setCoinState',
            payload: {
                id,
                coin_id,
                amount,
                created: Math.floor(date.getTime() / 1000),
                history: this.props.history,
            },
        });
    }

    _calc = (props) => {
        const { match, coin } = props;
        const id = +match.params.id;
        const coin_id = coin.detail.id;
        const data = coin.coinState.find((item) => item.id === id) || {};
        const amount = this.state.amount !== undefined ?
            this.state.amount
            : data.amount ?
                '' + data.amount
                : null;
        const date = this.state.date !== undefined ?
            this.state.date
            : data.created ?
                new Date(data.created * 1000)
                : new Date();

        return { id, coin_id, amount, date }
    }

    render() {
        const { history, coin, loading } = this.props;
        const { amount, date } = this._calc(this.props);

        return (
            <div className={styles.fullScreen}>
                <NavBar mode="dark" leftContent="< 返回" onLeftClick={history.goBack}>
                    设置盘点
                </NavBar>
                <WingBlank>
                    <InputItem
                        type="money"
                        placeholder="持有数量"
                        clear
                        moneyKeyboardAlign="left"
                        value={amount}
                        onChange={amount => this.setState({ amount })}
                    >{coin.detail.symbol}</InputItem>
                    <DatePicker
                        mode="date"
                        title="选择日期"
                        extra="Optional"
                        value={date}
                        onChange={date => this.setState({ date })}
                    >
                        <List.Item arrow="horizontal">日期</List.Item>
                    </DatePicker>
                    <Button type="primary" onClick={this.handle} loading={loading.effects['coin/setCoinState']}>
                        保存
                    </Button>
                </WingBlank>
            </div>
        )
    }
}

const CoinState = connect(({ coin, loading }) => ({ coin, loading }))(CoinStateCore);

class Coin extends React.Component {

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
                <div className={styles.fullScreen}>
                    <NavBar mode="dark" leftContent="< 返回" onLeftClick={history.goBack}>
                        {lodash.isEmpty(detail) ? null : `${detail.symbol}(${detail.name})`}
                    </NavBar>
                    {lodash.isEmpty(detail) ? null :
                        <div>
                            <List>
                                <List.Item>
                                    <Flex>
                                        <Flex.Item>
                                            $ {detail.price_usd}
                                        </Flex.Item>
                                        <Flex.Item>
                                            {detail.percent_change_1h}%
                            </Flex.Item>
                                    </Flex>
                                </List.Item>
                                <List.Item>
                                    <Flex>
                                        <Flex.Item>
                                            24H {detail.percent_change_24h}%
                            </Flex.Item>
                                        <Flex.Item>
                                            ${compactInteger(detail.volume_usd, 2)}
                                        </Flex.Item>
                                        <Flex.Item>
                                            ${compactInteger(detail.market_cap_usd, 2)}
                                        </Flex.Item>
                                    </Flex>
                                </List.Item>
                            </List>
                            <List renderHeader={() => '价格变化'}>
                                <List.Item>
                                    <ValueChart dataValue={detail.history} />
                                </List.Item>
                            </List>
                            <List renderHeader={() => '持有盘点'}>
                                {!coinState.length ? null :
                                    coinState.map((row) => (
                                        <SwipeAction
                                            key={row.id}
                                            autoClose
                                            left={[{
                                                text: '删除',
                                                onPress: () => {
                                                    this.props.dispatch({
                                                        type: 'coin/delCoinState',
                                                        payload: row,
                                                    })
                                                },
                                                style: { backgroundColor: 'red', color: 'white' },
                                            }]}>
                                            <List.Item key={row.id} extra={row.amount} arrow="horizontal"
                                                onClick={() => dispatch(routerRedux.push({
                                                    pathname: `${match.url}/state/${row.id}`,
                                                }))}
                                            >
                                                {d3.timeFormat("%Y-%m-%d")(new Date(row.created * 1000))}
                                            </List.Item>
                                        </SwipeAction>
                                    ))
                                }
                                <Flex justify="center">
                                    <Button
                                        type="ghost"
                                        inline
                                        size="small"
                                        className="am-button-borderfix"
                                        onClick={() => dispatch(routerRedux.push({
                                            pathname: `${match.url}/state/0`,
                                        }))}>新增</Button>
                                </Flex>
                            </List>
                        </div>
                    }
                </div>
                <Switch>
                    <Route path={`${match.url}/state/:id`} component={CoinState} />
                </Switch>
            </div>
        )
    }
}

export default connect(({ coin }) => ({ coin }))(Coin);