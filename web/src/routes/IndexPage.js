import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import styles from './IndexPage.css';
import {Button} from 'antd-mobile';

function IndexPage({dispatch}) {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Yay! Welcome to dva!</h1>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
        <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">Getting Started</a></li>
        <Button onClick={()=>dispatch({type:'login/sms', payload:{mobile: '18559117919'}})}>sms</Button>
        <Button onClick={()=>dispatch({type:'login/sms_auth', payload:{mobile: '18559117919', code: 6822}})}>sms auth</Button>
        <Button onClick={()=>dispatch({type:'login/me'})}>me</Button>
      </ul>
    </div>
  );
}

IndexPage.propTypes = {
  dispatch: PropTypes.func,
};

export default connect()(IndexPage);
