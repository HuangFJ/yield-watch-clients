import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { InputItem, Button, Result, List } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Helmet } from 'react-helmet';

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
            <Helmet>
                <title>You need register!</title>
            </Helmet>
            <Result
                img={<img src="images/yield.png" style={{ width: 60, height: 60 }} className="am-icon" alt="" />}
                title="请先注册"
                message={<div>{(errors = getFieldError('strName')) ? errors.join(',') : null}</div>}
            />
            <List>
                <List.Item>
                    {getFieldDecorator('strName', {
                        rules: [
                            {
                                required: true,
                                message: '键入你的姓名或昵称'
                            },
                        ],
                    })(<InputItem placeholder="名称" />)}
                </List.Item>
                <List.Item>
                    <Button type="primary" onClick={handleSubmit} loading={loading.effects['register/submit']}>
                        注册
                    </Button>
                </List.Item>
            </List>
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