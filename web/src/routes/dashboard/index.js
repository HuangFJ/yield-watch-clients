import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { CoinList, ValueChart, ValueDistribution } from './components';
import { List, Flex, WhiteSpace } from 'antd-mobile';
import styles from './index.less';
import { compactInteger } from '../../utils/common';

class Dashboard extends React.Component {

    static propTypes = {
        dashboard: PropTypes.object,
    }

    componentDidMount(){
        console.log('Dashboard did mount');
    }

    render() {
        const { dashboard, dispatch } = this.props;

        const emptyListItem = <List.Item className={styles.emptyListItem}>暂无数据</List.Item>;

        return (
            <div>
                <List renderHeader={() => '概览'} className={styles.summary}>
                    <List.Item>
                        <Flex>
                            <Flex.Item>
                                资产市值 ￥{compactInteger(dashboard.totalValue, 2)}
                            </Flex.Item>
                            <Flex.Item>
                                本金结余 ￥{compactInteger(dashboard.totalInvest, 2)}
                            </Flex.Item>
                        </Flex>
                    </List.Item>
                </List>
                <List renderHeader={() => '资产市值变化'} className={styles.values}>
                    {dashboard.values.length ?
                        <List.Item>
                            <ValueChart dataValue={dashboard.values} dataInvest={dashboard.invest} />
                        </List.Item>
                        : emptyListItem
                    }
                </List>
                <List renderHeader={() => '资产结构'} className={styles.distribution}>
                    {dashboard.coinList.length ?
                        <List.Item>
                            <ValueDistribution data={dashboard.coinList} />
                        </List.Item>
                        : emptyListItem
                    }
                </List>
                <List renderHeader={() => '资产列表'} className={styles.assets}>
                    {dashboard.coinList.length ?
                        <CoinList data={dashboard.coinList} dispatch={dispatch} />
                        : emptyListItem
                    }
                </List>
                <WhiteSpace />
            </div>
        )
    }
}

export default connect(({ app }) => ({ dashboard: app.dashboard }))(Dashboard);