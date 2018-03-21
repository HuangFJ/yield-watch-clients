import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { CoinList, ValueChart, ValueDistribution } from './components';
import { List, Flex } from 'antd-mobile';
import styles from './index.less';

const Dashboard = ({ dashboard }) => {
    return (
        <div>
            <List renderHeader={() => '概览'} className={styles.summary}>
                <List.Item>
                    <Flex>
                        <Flex.Item>
                            资产总市值 ￥{dashboard.totalValue}
                        </Flex.Item>
                        <Flex.Item>
                            本金结余 ￥{dashboard.totalInvest}
                        </Flex.Item>
                    </Flex>
                </List.Item>
            </List>
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
                <CoinList data={dashboard.coinList} />
            </List>
        </div>
    )
}

Dashboard.propTypes = {
    dashboard: PropTypes.object,
    loading: PropTypes.object,
}

export default connect(({ dashboard }) => ({ dashboard }))(Dashboard);