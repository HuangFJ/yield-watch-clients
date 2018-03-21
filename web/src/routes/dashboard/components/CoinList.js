import React from 'react';
import { List } from 'antd-mobile';
import PropTypes from 'prop-types';

const Item = List.Item;
const Brief = Item.Brief;

const CoinList = ({ data }) => {
    return (
        data.map((item, key) => (
            <Item key={item.coin.id} extra={`$${item.coin.price_usd}`} align="top" 
            thumb={`https://s2.coinmarketcap.com/static/img/coins/32x32/${item.coin.no}.png`} multipleLine>
                {item.coin.name} <Brief>{item.amount}</Brief>
            </Item>
        ))
    )
}

CoinList.propTypes = {
    data: PropTypes.array,
}

export default CoinList;
