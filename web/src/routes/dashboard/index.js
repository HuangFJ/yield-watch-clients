import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PropTypes from 'prop-types';
import { CoinList, ValueChart, ValueDistribution } from './components';
import { List, Flex, WhiteSpace, Icon, Button } from 'antd-mobile';
import styles from './index.less';
import { compactInteger } from '../../utils/common';

class Dashboard extends React.Component {

    static propTypes = {
        dashboard: PropTypes.object,
    }

    componentDidMount() {
        console.log('Dashboard did mount');
    }

    render() {
        const { dashboard, dispatch } = this.props;

        return (
            <div className={styles.tabContent}>
                <List className={styles.summary}>
                    <Flex className={styles.group}>
                        <Flex.Item className={styles.cell}>
                            <header>资产市值(元)</header>
                            <p>{compactInteger(dashboard.totalValue, 3)}</p>
                        </Flex.Item>
                        <Flex.Item className={styles.cell}>
                            <header>净入金(元)</header>
                            <p>
                                <a style={{ display: 'flex', alignItems: 'center' }} onClick={() => this.props.dispatch(routerRedux.push({
                                    pathname: `/balance`,
                                }))}>
                                    <span style={{ flex: 1 }}>{compactInteger(dashboard.totalInvest, 3)}</span>
                                    <Icon type="right" style={{ flex: '0 0 auto', marginRight: 15 }} />
                                </a>
                            </p>
                        </Flex.Item>
                    </Flex>
                </List>
                {dashboard.values.length ?
                    <div>
                        <List renderHeader={() => '资产市值变化'} className={styles.values}>
                            <List.Item>
                                <ValueChart dataValue={dashboard.values} dataInvest={dashboard.invest} />
                            </List.Item>
                        </List>
                        <List renderHeader={() => '资产结构'} className={styles.distribution}>
                            <List.Item>
                                <ValueDistribution data={dashboard.coinList} />
                            </List.Item>
                        </List>
                        <List renderHeader={() => '资产列表'} className={styles.assets}>
                            <CoinList data={dashboard.coinList} dispatch={dispatch} />
                        </List>
                    </div>
                    : <div style={{ textAlign: 'center', color: '#888', marginTop: 50 }}>
                        <p>你还没有添加任何资产</p>
                        <p style={{ display: 'flex', alignItems: 'center', justifyContent:'center' }}>
                            现在就去<Button type="ghost" size="small" onClick={() => dispatch(routerRedux.push({
                                pathname: `/market`,
                            }))}>市场</Button>查找资产并录入盘点数量</p>
                    </div>
                }
                <WhiteSpace size="xl" />
            </div>
        )
    }
}

export default connect(({ app }) => ({ dashboard: app.dashboard }))(Dashboard);