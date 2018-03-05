import React from 'react';
import { connect } from 'dva';
import { List, InputItem, Button, Flex, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { PropTypes } from 'prop-types';
import { CountdownButton } from './components';
import { Helmet } from 'react-helmet';

const Login = ({
    login,
    loading,
    dispatch,
    form: {
        getFieldDecorator,
        validateFields,
    },
}) => {

    const handleError = (err) => {
        err && Toast.fail(err.message);
        dispatch({
            type: 'login/updateState',
            payload: { disabled: true },
        });
    };

    const requireAndValidMobile = async (strMobile) => {
        let err;
        if (!strMobile) err = '手机号必填。';
        else if (!/\d{3} \d{4} \d{4}/g.test(strMobile)) err = '手机号格式错误。';

        return err ? Promise.reject({ message: err }) : strMobile.replace(/ /g, '');
    };

    const requireAndValidCode = async (strCode) => {
        let err;
        if (!strCode) err = '短信验证码必填。';
        else if (!/\d{4}/g.test(strCode)) err = '短信验证码格式错误。';

        return err ? Promise.reject({ message: err }) : +strCode; //alias of parseInt
    };

    const handleSms = () => validateFields((_, values) => {
        const { strMobile } = values;
        requireAndValidMobile(strMobile)
            .then(mobile =>
                dispatch({
                    type: 'login/sms',
                    payload: { mobile },
                })
            )
            .catch(handleError);
    });

    const handleLogin = () => validateFields((_, values) => {
        const { strMobile, strCode } = values;
        requireAndValidMobile(strMobile)
            .then(mobile => requireAndValidCode(strCode)
                .then(code => Promise.resolve({ mobile, code })))
            .then(({ mobile, code }) => {
                dispatch({
                    type: 'login/smsAuth',
                    payload: { mobile, code },
                })
            })
            .catch(handleError);
    });

    const handleMobileChange = (strMobile) => {
        requireAndValidMobile(strMobile)
            .then(_ => {
                if (!login.countdown) return Promise.reject();
                dispatch({
                    type: 'login/updateState',
                    payload: { disabled: false },
                });
            })
            .catch(_ => handleError())
    };

    const handleCodeChange = (strCode) => {
        requireAndValidCode(strCode)
            .then(_ => {
                if (!login.countdown) return Promise.reject();
                dispatch({
                    type: 'login/updateState',
                    payload: { disabled: false },
                });
            })
            .catch(_ => handleError())
    };

    return (
        <div>
            <Helmet>
                <title>You need login!</title>
            </Helmet>
            <List>
                <List.Item>
                    {getFieldDecorator('strMobile')(
                        <InputItem type="phone" onChange={handleMobileChange} placeholder="手机号码" />
                    )}
                </List.Item>
                <List.Item>
                    <Flex>
                        <Flex.Item>
                            {getFieldDecorator('strCode')(
                                <InputItem type="number" onChange={handleCodeChange} placeholder="短信验证码" />
                            )}
                        </Flex.Item>
                        <Flex.Item>
                            <CountdownButton type="primary" size="small" label="发送" interval={login.interval}
                                onClick={handleSms} loading={loading.effects['login/sms']} />
                        </Flex.Item>
                    </Flex>

                </List.Item>
                <List.Item>
                    <Button disabled={login.disabled} type="primary" onClick={handleLogin} loading={loading.effects['login/smsAuth']}>
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