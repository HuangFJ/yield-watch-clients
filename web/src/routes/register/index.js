import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { InputItem, Button } from 'antd-mobile';
import { createForm } from 'rc-form';

const Register = ({
    register,
    loading,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldError,
        getField,
    },
    dispatch,
}) => {
    const handleSubmit = () => validateFields((errors, values) => {
        if (errors) return;
        dispatch({
            type: 'register/submit',
            payload: {
                name: values.strName
            }
        })
    });

    let errors;
    return (
        <div>
            {getFieldDecorator('strName', {
                rules: [
                    { 
                        required: true,
                        message: '姓名为必填项'
                    },
                ],
            })(<InputItem placeholder="请输入您的姓名" />)}
            {(errors = getFieldError('strName')) ? errors.join(',') : null}
            <Button type="primary" onClick={handleSubmit} loading={loading.effects['register/submit']}>
                注册
            </Button>
        </div>
    )
}

Register.propTypes = {
    register: PropTypes.object,
    loading: PropTypes.object,
    form: PropTypes.object,
    dispatch: PropTypes.func,
}

export default connect(({ register, loading }) => ({ register, loading }))(createForm()(Register));