import React from 'react';
import { connect } from 'dva';
import { List, InputItem, Button, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import { PropTypes } from 'prop-types';
import styles from './index.less';
import { CountdownButton } from './components';

const Login = ({
    login,
    loading,
    dispatch,
    form: {
        getFieldDecorator,
        validateFields,
    },
}) => {
    const handleSms = () => validateFields((errors, values) => {
        if (errors) return;
        const { strMobile } = values;
        const mobile = strMobile.replace(/ /g, '');
        dispatch({
            type: 'login/sms',
            payload: { mobile },
        });
    });

    const handleSubmit = () => validateFields((errors, values) => {
        if (errors) return;
        const { strMobile, strCode } = values;
        const mobile = strMobile.replace(/ /g, '');
        const code = parseInt(strCode, 10);
        dispatch({
            type: 'login/smsAuth',
            payload: { mobile, code },
        });
    });

    const handleChange = () => validateFields((errors, values) => {
        let disabled = true;
        if (!errors) {
            const { strMobile } = values;
            if (/\d{3} \d{4} \d{4}/g.test(strMobile) && login.countdown) {
                disabled = false;
            }
        }
        dispatch({
            type: 'login/updateState',
            payload: { disabled },
        });
    });

    return (
        <div>
            <List>
                <List.Item>
                    {getFieldDecorator('strMobile', {
                        rules: [
                            {
                                required: true,
                                message: '手机号必填',
                            },
                        ],
                    })(<InputItem type="phone" placeholder="请输入手机号码" />)}
                </List.Item>
                <List.Item>
                    <Flex>
                        <Flex.Item>
                            {getFieldDecorator('strCode')(<InputItem type="number" onChange={handleChange} placeholder="请输入验证码" />)}
                        </Flex.Item>
                        <Flex.Item>
                            <CountdownButton type="primary" size="small" label="发送验证码" interval={login.interval}
                                onClick={handleSms} loading={loading.effects['login/sms']} />
                        </Flex.Item>
                    </Flex>

                </List.Item>
                <List.Item>
                    <Button disabled={login.disabled} type="primary" onClick={handleSubmit} loading={loading.effects['login/smsAuth']}>
                        登录
                    </Button>
                </List.Item>
            </List>
        </div>
    )
}

Login.propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object,
    login: PropTypes.object,
}

export default connect(({ login, loading }) => ({ login, loading }))(createForm()(Login));