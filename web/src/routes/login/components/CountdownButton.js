import React from 'react';
import { Button } from 'antd-mobile';
import PropTypes from 'prop-types';

const CountdownButton = ({ label, interval, disabled, ...btnProps }) => {
    const counting = interval > 0;
    const txtLabel = counting ? `再次${label}(${interval})` : label;
    return (
        <Button disabled={counting || disabled} {...btnProps}>
            {txtLabel}
        </Button>
    )
}

CountdownButton.propTypes = {
    interval: PropTypes.number,
    label: PropTypes.string,
}

export default CountdownButton;