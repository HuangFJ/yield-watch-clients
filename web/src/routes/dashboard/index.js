import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PropTypes from 'prop-types';
import { CoinList, ValueChart, ValueDistribution } from './components';
import { List, Flex, WhiteSpace, Icon } from 'antd-mobile';
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

        const emptyListItem = <List.Item className={styles.emptyListItem}>暂无数据</List.Item>;

        return (
            <div>
                <List className={styles.summary}>
                    <Flex className={styles.group}>
                        <Flex.Item className={styles.cell}>
                            <header>资产市值(元)</header>
                            <p>{compactInteger(dashboard.totalValue, 3)}</p>
                        </Flex.Item>
                        <Flex.Item className={styles.cell}>
                            <header>净入金(元)</header>
                            <p>
                                <a style={{ display: 'flex' }} onClick={() => this.props.dispatch(routerRedux.push({
                                    pathname: `/balance`,
                                }))}>
                                    <span style={{ flex: 1 }}>{compactInteger(dashboard.totalInvest, 3)}</span>
                                    <Icon type="right" style={{ flex: '0 0 auto', marginRight: 15 }} />
                                </a>
                            </p>
                        </Flex.Item>
                    </Flex>
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
                <WhiteSpace size="xl" />
            </div>
        )
    }
}

export default connect(({ app }) => ({ dashboard: app.dashboard }))(Dashboard);