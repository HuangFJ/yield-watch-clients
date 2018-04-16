import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';

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
            <div style={{ textAlign: 'center', color: '#888', marginTop: 50 }}>
                <p>Hi, {app.user.name}, 准备好开始探索了吗？</p>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(Diamond);