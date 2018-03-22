import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import {NavBar,Icon} from 'antd-mobile';

const Error = ({ error }) => (
    <div>
    <NavBar
      mode="light"
      icon={<Icon type="left" />}
      onLeftClick={() => console.log('onLeftClick')}
      rightContent={[
        <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
        <Icon key="1" type="ellipsis" />,
      ]}
    >NavBar</NavBar>
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