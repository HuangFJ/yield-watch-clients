import React from 'react'
import { connect } from 'dva';
import { NavBar, List, Flex, InputItem, Button, Toast, Icon } from 'antd-mobile';
import styles from '../app.less';

class CoinTrigger extends React.Component {
    state = {}

    componentDidMount(){
        console.log('Trigger did mount');
    }

    handleDel = () => {
        const coin_id = this.props.trigger.coin_id
        this.props.dispatch({
            type: 'trigger/delTrigger',
            payload: { coin_id }
        }).then(() => this.props.history.goBack());
    }
    handleSave = () => {
        const trigger = this.props.trigger

        let floor = this.state.floor !== undefined ?
            this.state.floor
            : trigger.floor > 0 ?
                '' + trigger.floor
                : null;

        let ceil = this.state.ceil !== undefined ?
            this.state.ceil
            : trigger.ceil > 0 ?
                '' + trigger.ceil
                : null;

        floor = +floor;
        ceil = +ceil;

        if (!floor > 0) {
            Toast.fail("请输入最低价格！");
            return;
        }
        if (!ceil > 0) {
            Toast.fail("请输入最高价格！");
            return;
        }
        if (ceil <= floor) {
            Toast.fail("最高价格必须大于最低价格！");
            return;
        }

        let coin_id = this.props.trigger.coin_id
        if (!coin_id) {
            coin_id = this.props.trigger.coin.id
        }

        this.props.dispatch({
            type: 'trigger/setTrigger',
            payload: {
                coin_id,
                floor,
                ceil
            },
        }).then(() => this.props.history.goBack());
    }
    render() {
        const { history, trigger, loading } = this.props;
        const coin = trigger.coin
        const floor = this.state.floor !== undefined ?
            this.state.floor
            : trigger.floor > 0 ?
                '' + trigger.floor
                : null;

        const ceil = this.state.ceil !== undefined ?
            this.state.ceil
            : trigger.ceil > 0 ?
                '' + trigger.ceil
                : null;

        return <div className={styles.flexPage}>
            <div className={styles.nav}>
                <NavBar mode="dark"
                    leftContent={<Flex><Icon type="left" />返回</Flex>}
                    onLeftClick={history.goBack}>设置价格提醒</NavBar>
            </div>
            <div className={styles.body}>
                <List renderHeader={() => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>当{coin.symbol}价格（当前￥{coin.price_cny}）满足以下任一条件时触发。</span>
                    </div>
                )}>
                    <InputItem
                        type="digit"
                        placeholder="最低价格"
                        value={floor}
                        onChange={floor => this.setState({ floor })}
                    >低于￥</InputItem>
                    <InputItem
                        type="digit"
                        placeholder="最高价格"
                        value={ceil}
                        onChange={ceil => this.setState({ ceil })}
                    >高于￥</InputItem>
                    <List.Item>
                        <Flex>
                            <Flex.Item><Button disabled={!trigger.coin_id} type="ghost" size="small" onClick={this.handleDel} loading={loading.effects['trigger/delTrigger']}>删除</Button></Flex.Item>
                            <Flex.Item><Button type="ghost" size="small" onClick={this.handleSave} loading={loading.effects['trigger/setTrigger']}>保存</Button></Flex.Item>
                        </Flex>
                    </List.Item>
                </List>

            </div>
        </div>
    }
}

export default connect(({ trigger, loading }) => ({ trigger: trigger.trigger, loading }))(CoinTrigger);