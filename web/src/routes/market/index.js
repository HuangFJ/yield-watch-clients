import React from 'react';
import styles from './index.less';
import PropTypes from 'prop-types';
import { connect } from 'dva';

const Market = ({ market, loading }) => {
    return (
        <div>market</div>
    )
}

Market.propTypes = {
    market: PropTypes.object,
    loading: PropTypes.object,
}

export default connect(({ market, loading }) => ({ market, loading }))(Market);