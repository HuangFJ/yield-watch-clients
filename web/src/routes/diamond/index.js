import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';

const Diamond = ({ app, diamond }) => (
    <div>
        Hi, {app.user.name}, 准备好开始探索了吗？
    </div>
);

Diamond.propTypes = {
    app: PropTypes.object,
    diamond: PropTypes.object,
}

export default connect(({ app, diamond }) => ({ app, diamond }))(Diamond);