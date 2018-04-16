import React from 'react';
import { connect } from 'dva';
import { NavBar, List, Flex, InputItem, DatePicker, Button, Toast, Icon } from 'antd-mobile';
import styles from '../app.less';

class Detail extends React.Component {
    state = {}

    handle = () => {
        let { id, amount, date } = this._calc(this.props);
        amount = +amount;

        if (!amount) {
            Toast.fail("请输入金额！");
            return;
        }

        this.props.dispatch({
            type: 'app/setBalance',
            payload: {
                id,
                amount,
                created: Math.floor(date.getTime() / 1000),
            },
        }).then(() => this.props.history.goBack());
    }

    _calc = (props) => {
        const { match, invest } = props;
        const id = +match.params.id;
        const data = invest.find((item) => item[2] === id) || {};
        const amount = this.state.amount !== undefined ?
            this.state.amount
            : data[1] ?
                '' + data[1]
                : null;
        const date = this.state.date !== undefined ?
            this.state.date
            : data[0] ?
                new Date(data[0])
                : new Date();

        return { id, amount, date }
    }

    render() {
        const { history, loading } = this.props;
        const { amount, date } = this._calc(this.props);

        return (
            <div className={styles.flexPage}>
                <div className={styles.nav}>
                    <NavBar mode="dark"
                        leftContent={<Flex><Icon type="left" />返回</Flex>}
                        onLeftClick={history.goBack}>净入金结算</NavBar>
                </div>
                <div className={styles.body}>
                    <List>
                        <DatePicker
                            maxDate={new Date()}
                            mode="date"
                            title="选择日期"
                            value={date}
                            onChange={date => this.setState({ date })}
                        >
                            <List.Item>日期</List.Item>
                        </DatePicker>
                        <InputItem
                            type="money"
                            placeholder="净入金"
                            value={amount}
                            onChange={amount => this.setState({ amount })}
                        >金额(元)</InputItem>
                        <List.Item>
                            <Button type="ghost" size="small" onClick={this.handle} loading={loading.effects['app/setBalance']}>保存</Button>
                        </List.Item>
                    </List>
                </div>
            </div>
        )
    }
}

export default connect(({ app, loading }) => ({ invest: app.dashboard.invest, loading }))(Detail);