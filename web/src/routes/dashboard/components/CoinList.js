import React from 'react';
import { List } from 'antd-mobile';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { compactInteger } from '../../../utils/common';

const CoinList = ({ data, dispatch }) => {
    return (
        data.map((item, key) => (
            <List.Item
                onClick={() => dispatch(routerRedux.push({
                    pathname: `/coins/${item.coin.id}`,
                }))}
                key={key}
                extra={<div>￥{compactInteger(item.value_cny, 3)}</div>}
                align="top"
                multipleLine
                thumb={`https://s2.coinmarketcap.com/static/img/coins/32x32/${item.coin.no}.png`} >
                {item.amount} {item.coin.symbol}
            </List.Item>
        ))
    )
}

CoinList.propTypes = {
    data: PropTypes.array,
}

export default CoinList;
