import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import PropTypes from 'prop-types';

const Error = ({ error }) => (
    <div className="content-inner">
        <div className={styles.error}>
            <img src="https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg" alt="" />
            <h1>{error.message}</h1>
        </div>
    </div>
);

Error.propTypes = {
    error: PropTypes.object,
}

export default connect(({ error }) => ({ error }))(Error);