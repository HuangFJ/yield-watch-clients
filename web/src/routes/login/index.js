import React from 'react';
import { connect } from 'dva';
import { List, InputItem, Button, Flex, Toast, Result } from 'antd-mobile';
import { createForm } from 'rc-form';
import { PropTypes } from 'prop-types';
import { CountdownButton } from './components';
import { Helmet } from 'react-helmet';
import styles from '../app.less';

class Login extends React.Component {

    static propTypes = {
        form: PropTypes.object,
        dispatch: PropTypes.func,
        loading: PropTypes.object,
        login: PropTypes.object,
    }

    handleError = (err) => {
        err && Toast.fail(err.message);
        this.props.dispatch({
            type: 'login/updateState',
            payload: { disabled: true },
        });
    }

    requireAndValidMobile = async (strMobile) => {
        let err;
        if (!strMobile) err = '手机号必填。';
        else if (!/\d{3} \d{4} \d{4}/g.test(strMobile)) err = '手机号格式错误。';

        return err ? Promise.reject({ message: err }) : strMobile.replace(/ /g, '');
    }

    requireAndValidCode = async (strCode) => {
        let err;
        if (!strCode) err = '短信验证码必填。';
        else if (!/\d{4}/g.test(strCode)) err = '短信验证码格式错误。';

        return err ? Promise.reject({ message: err }) : +strCode; //alias of parseInt
    }

    handleSms = () => this.props.form.validateFields((_, values) => {
        const { strMobile } = values;
        this.requireAndValidMobile(strMobile)
            .then(mobile =>
                this.props.dispatch({
                    type: 'login/sms',
                    payload: { mobile },
                })
            )
            .catch(this.handleError);
    })

    handleLogin = () => this.props.form.validateFields((_, values) => {
        const { strMobile, strCode } = values;
        this.requireAndValidMobile(strMobile)
            .then(mobile => this.requireAndValidCode(strCode)
                .then(code => Promise.resolve({ mobile, code })))
            .then(({ mobile, code }) => {
                this.props.dispatch({
                    type: 'login/smsAuth',
                    payload: { mobile, code },
                })
            })
            .catch(this.handleError);
    })

    handleMobileChange = (strMobile) => {
        this.requireAndValidMobile(strMobile)
            .then(_ => {
                if (!this.props.login.countdown) return Promise.reject();
                this.props.dispatch({
                    type: 'login/updateState',
                    payload: { disabled: false },
                });
            })
            .catch(_ => this.handleError())
    }

    handleCodeChange = (strCode) => {
        this.requireAndValidCode(strCode)
            .then(_ => {
                if (!this.props.login.countdown) return Promise.reject();
                this.props.dispatch({
                    type: 'login/updateState',
                    payload: { disabled: false },
                });
            })
            .catch(_ => this.handleError())
    }

    componentDidMount(){
        console.log('Login did mount');
    }

    render() {
        const { login, loading } = this.props;

        return (
            <div className={styles.fullScreen}>
                <Helmet>
                    <title>You need login!</title>
                </Helmet>
                <Result
                    img={<img src="images/yield.png" style={{ width: 60, height: 60 }} className="am-icon" alt="" />}
                    title="请先登录"
                />
                <List>
                    <List.Item>
                        {this.props.form.getFieldDecorator('strMobile')(
                            <InputItem type="phone" onChange={this.handleMobileChange} placeholder="手机号码" />
                        )}
                    </List.Item>
                    <List.Item>
                        <Flex>
                            <Flex.Item>
                                {this.props.form.getFieldDecorator('strCode')(
                                    <InputItem type="number" onChange={this.handleCodeChange} placeholder="短信验证码" />
                                )}
                            </Flex.Item>
                            <Flex.Item>
                                <CountdownButton type="primary" size="small" label="发送" interval={login.interval}
                                    onClick={this.handleSms} loading={loading.effects['login/sms']} />
                            </Flex.Item>
                        </Flex>

                    </List.Item>
                    <List.Item>
                        <Button disabled={login.disabled} type="primary" onClick={this.handleLogin} loading={loading.effects['login/smsAuth']}>
                            登录
                    </Button>
                    </List.Item>
                </List>
            </div>
        )
    }
}

export default connect(({ login, loading }) => ({ login, loading }))(createForm()(Login));