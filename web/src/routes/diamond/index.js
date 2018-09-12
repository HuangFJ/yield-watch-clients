import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import styles from '../app.less';
import { List } from 'antd-mobile';
import { routerRedux } from 'dva/router';

class Diamond extends React.Component {

    static propTypes = {
        app: PropTypes.object,
        diamond: PropTypes.object,
    }

    componentDidMount() {
        console.log('Diamond did mount');
    }

    render() {
        const { app, dispatch } = this.props;
        return (
            <div className={styles.tabContent}>
                <h1>Hi, {app.user.name}</h1>
                <List>
                    <List.Item arrow="horizontal" onClick={() => dispatch(routerRedux.push({
                        pathname: `/triggers`,
                    }))}>
                        价格提醒
                    </List.Item>
                </List>

            </div>

        );
    }
}

export default connect(({ app }) => ({ app }))(Diamond);