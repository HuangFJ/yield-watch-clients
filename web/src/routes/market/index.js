import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { List } from 'antd-mobile';
import { Loader } from '../../components';

const Market = ({ market, loading }) => {
    return (
        <div>
            <Loader fullScreen spinning={loading.effects['market/query']} />
            <List loading={loading}>
                {
                    market.coins.map((item, idx) => (
                        <List.Item key={item.id} extra={`\$${item.price_usd}`} align="top" thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine>
                            {item.name} 
                            <List.Item.Brief>{item.volume_usd}</List.Item.Brief>
                        </List.Item>
                    ))
                }
            </List>
        </div>
    )
}

Market.propTypes = {
    market: PropTypes.object,
    loading: PropTypes.object,
}

export default connect(({ market, loading }) => ({ market, loading }))(Market);