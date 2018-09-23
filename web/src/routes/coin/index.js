import React from 'react';
import { connect } from 'dva';
import { Switch, Route } from 'dva/router';
import lodash from 'lodash';
import { NavBar, List, Flex, Icon, WhiteSpace, Tabs } from 'antd-mobile';
import { ValueChart } from '../dashboard/components';
import { compactInteger, percent, money } from '../../utils/common';
import styles from '../app.less';
import CoinState from './CoinState';
import CoinTrigger from './CoinTrigger';
import ListState from './ListState';
import ListTrigger from './ListTrigger';

class Coin extends React.Component {

    state = {
        activeTab: 2
    }

    _changeColor(val) {
        if (val > 0) {
            return styles.changeColorUp;
        } else if (val < 0) {
            return styles.changeColorDown;
        }
    }

    _fixNumber(val, precision) {
        const power = 10 ** precision;
        return Math.floor(val * power) / power;
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
        const { coin: { detail, coinState }, trigger, history, match, dispatch, loading } = this.props;

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
                                                <p className={this._changeColor(detail.percent_change)} style={{ fontSize: 24 }}>
                                                    ￥{money(detail.price_cny, 6)}
                                                    <span style={{ fontSize: 12, marginLeft: 5 }}>${money(detail.price_usd, 6)}</span>
                                                </p>
                                            </Flex.Item>
                                            <Flex.Item style={{ flex: '0 0 auto', width: '25%' }} className={styles.coinStateCell}>
                                                <header>24H涨跌幅</header>
                                                <p className={this._changeColor(detail.percent_change)}>{percent(detail.percent_change, 2)}%</p>
                                            </Flex.Item>
                                        </Flex>
                                        <Flex direction="row" className={styles.coinStateGroup}>
                                            <Flex.Item className={styles.coinStateCell}>
                                                <header>流通总数</header>
                                                <p>{compactInteger(detail.available_supply, 2)}</p>
                                            </Flex.Item>
                                            <Flex.Item className={styles.coinStateCell}>
                                                <header>24H成交量</header>
                                                <p>${compactInteger(detail.volume_usd, 2)}</p>
                                            </Flex.Item>
                                            <Flex.Item style={{ flex: '0 0 auto', width: '25%' }} className={styles.coinStateCell}>
                                                <header>总市值</header>
                                                <p>${compactInteger(detail.market_cap_usd, 2)}</p>
                                            </Flex.Item>
                                        </Flex>
                                    </Flex>
                                </List>
                                
                                <List renderHeader={() => '价格变化'}>
                                    <List.Item>
                                        <Tabs 
                                        onTabClick = {(tab, index)=>{
                                            this.setState({
                                                activeTab: index
                                            })
                                            dispatch({
                                                type: 'coin/queryCoinByUnit',
                                                payload: {coin_id:detail.id, unit: tab.unit}
                                            })
                                        }}
                                        tabs={[
                                            { title: '日' , unit: 'd'},
                                            { title: '周' , unit: 'w'},
                                            { title: '月' , unit: 'm'},
                                            { title: '年' , unit: 'y'},
                                            { title: '全部' , unit: 'a'},
                                        ]} renderTabBar={props => <Tabs.DefaultTabBar {...props} page={5} activeTab={this.state.activeTab} />}>
                                            <ValueChart dataValue={detail.history} />
                                        </Tabs>
                                    </List.Item>
                                </List>
                                
                                <ListTrigger {...{ loading, trigger, dispatch, match }} />

                                <ListState {...{ loading, coinState, detail, dispatch, match }} />

                                <WhiteSpace size="xl" />
                            </div>
                        }
                    </div>
                </div>
                <Switch>
                    <Route path={`${match.url}/state/:id`} component={CoinState} />
                    <Route path={`${match.url}/trigger`} component={CoinTrigger} />
                </Switch>
            </div>
        )
    }
}

export default connect(({ coin, loading, trigger }) => ({ coin, loading, trigger: trigger.trigger }))(Coin);