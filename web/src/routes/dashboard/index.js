import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { CoinList, ValueChart, ValueDistribution } from './components';
import { List, Flex } from 'antd-mobile';

const Dashboard = ({ dashboard }) => {
    return (
        <div>
            <List renderHeader={() => '概览'} >
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
            <List renderHeader={() => '资产市值变化'}>
                <List.Item>
                    <ValueChart dataValue={dashboard.values} dataInvest={dashboard.invest} />
                </List.Item>
            </List>
            <List renderHeader={() => '资产结构'}>
                <List.Item>
                    <ValueDistribution data={dashboard.coinList} />
                </List.Item>
            </List>
            <List renderHeader={() => '资产列表'}>
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