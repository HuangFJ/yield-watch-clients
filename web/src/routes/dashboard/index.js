import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { CoinList, ValueChart } from './components';
import { List, Flex } from 'antd-mobile';

const Dashboard = ({ dashboard, loading }) => {
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
                    {/* <VictoryPie
                        colorScale="cool"
                        cornerRadius={25}
                        labelRadius={90}
                        labelComponent={<Label angle={45} />}
                        data={dashboard.coinList}
                        x={datum => datum.coin.symbol}
                        y={datum => datum.value_cny}
                    /> */}

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

export default connect(({ dashboard, loading }) => ({ dashboard, loading }))(Dashboard);