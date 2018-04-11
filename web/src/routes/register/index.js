import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { InputItem, Button, Result, List } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Helmet } from 'react-helmet';
import styles from '../app.less';

class Register extends React.Component {

    static propTypes = {
        register: PropTypes.object,
        loading: PropTypes.object,
        form: PropTypes.object,
        dispatch: PropTypes.func,
    }

    handleSubmit = () => this.props.form.validateFields((errors, values) => {
        if (errors) return;
        this.props.dispatch({
            type: 'register/submit',
            payload: {
                name: values.strName
            }
        })
    });

    componentDidMount(){
        console.log('Register did mount');
    }

    render() {
        let errors;
        return (
            <div className={styles.fullScreen}>
                <Helmet>
                    <title>You need register!</title>
                </Helmet>
                <Result
                    img={<img src="images/yield.png" style={{ width: 60, height: 60 }} className="am-icon" alt="" />}
                    title="请先注册"
                    message={<div>{(errors = this.props.form.getFieldError('strName')) ? errors.join(',') : null}</div>}
                />
                <List>
                    <List.Item>
                        {this.props.form.getFieldDecorator('strName', {
                            rules: [
                                {
                                    required: true,
                                    message: '键入你的姓名或昵称'
                                },
                            ],
                        })(<InputItem placeholder="名称" />)}
                    </List.Item>
                    <List.Item>
                        <Button type="primary" onClick={this.handleSubmit} loading={this.props.loading.effects['register/submit']}>
                            注册
                    </Button>
                    </List.Item>
                </List>
            </div>
        )
    }
}

export default connect(({ loading }) => ({ loading }))(createForm()(Register));