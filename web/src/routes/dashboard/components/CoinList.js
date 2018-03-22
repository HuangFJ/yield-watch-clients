import React from 'react';
import { List } from 'antd-mobile';
import PropTypes from 'prop-types';
import { compactInteger } from '../../../utils/common';
import styles from '../index.less';

const Item = List.Item;
const Brief = Item.Brief;

const CoinList = ({ data }) => {
    const _percentColor = (val) => {
        if (val > 0) {
            return styles.percentColorUp;
        } else if (val < 0) {
            return styles.percentColorDown;
        }
    }
    return (
        data.map((item, key) => (
            <Item
                key={key}
                extra={
                    <div>
                        {`$${item.coin.price_usd}`}<br />
                        <span className={_percentColor(item.coin.percent_change_24h)}>{`${item.coin.percent_change_24h}%`}</span>
                    </div>
                }
                align="top"
                multipleLine
                thumb={`https://s2.coinmarketcap.com/static/img/coins/32x32/${item.coin.no}.png`}
            >
                {item.coin.rank}. {item.coin.name} 
                <Brief>
                    持有 {item.amount} <br />
                    市值 ￥{compactInteger(item.value_cny, 2)}
                </Brief>
            </Item>
        ))
    )
}

CoinList.propTypes = {
    data: PropTypes.array,
}

export default CoinList;
