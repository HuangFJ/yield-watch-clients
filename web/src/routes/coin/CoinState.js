import React from 'react';
import { connect } from 'dva';
import { NavBar, List, Flex, InputItem, DatePicker, Button, Toast, Icon } from 'antd-mobile';
import { timeFormat } from 'd3';
import styles from '../app.less';

class CoinState extends React.Component {
    state = {}

    handle = () => {
        let { id, coin_id, amount, date } = this._calc(this.props);
        amount = +amount;

        if (!amount) {
            Toast.fail("请输入持有数量！");
            return;
        }

        this.props.dispatch({
            type: 'coin/setCoinState',
            payload: {
                id,
                coin_id,
                amount,
                created: Math.floor(date.getTime() / 1000),
            },
        }).then(() => this.props.history.goBack());
    }

    _calc = (props) => {
        const { match, coin } = props;
        const id = +match.params.id;
        const coin_id = coin.detail.id;
        const data = coin.coinState.find((item) => item.id === id) || {};
        const amount = this.state.amount !== undefined ?
            this.state.amount
            : data.amount ?
                '' + data.amount
                : null;
        const date = this.state.date !== undefined ?
            this.state.date
            : data.created ?
                new Date(data.created * 1000)
                : new Date();

        return { id, coin_id, amount, date }
    }

    render() {
        const { history, coin, loading } = this.props;
        const { amount, date } = this._calc(this.props);

        return (
            <div className={styles.flexPage}>
                <div className={styles.nav}>
                    <NavBar mode="dark"
                        leftContent={<Flex><Icon type="left" />返回</Flex>}
                        onLeftClick={history.goBack}>盘点{coin.detail.symbol}</NavBar>
                </div>
                <div className={styles.body}>
                    <List>
                        <InputItem
                            placeholder="选择日期"
                            value={timeFormat('%Y-%m-%d')(date)}
                            editable={false}
                            extra={
                                <DatePicker
                                    maxDate={new Date()}
                                    mode="date"
                                    title="选择日期"
                                    value={date}
                                    onChange={date => this.setState({ date })}
                                >
                                    <div className={styles.iconCalender} />
                                </DatePicker>
                            }
                        >日期</InputItem>
                        <InputItem
                            type="digit"
                            placeholder="持币数量"
                            value={amount}
                            onChange={amount => this.setState({ amount })}
                        >{coin.detail.symbol}</InputItem>
                        <List.Item>
                            <Button type="ghost" size="small" onClick={this.handle} loading={loading.effects['coin/setCoinState']}>保存</Button>
                        </List.Item>
                    </List>
                </div>
            </div>
        )
    }
}

export default connect(({ coin, loading }) => ({ coin, loading }))(CoinState);