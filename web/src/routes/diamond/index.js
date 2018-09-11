import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import styles from './index.less';

class Diamond extends React.Component {

    static propTypes = {
        app: PropTypes.object,
        diamond: PropTypes.object,
    }

    componentDidMount() {
        console.log('Diamond did mount');
    }

    render() {
        const { app } = this.props;
        return (
            <div className={styles.tabContent}>
                <p>Hi, {app.user.name}, 准备好开始探索了吗？</p>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(Diamond);