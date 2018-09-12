import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { NavBar, List, Flex, Icon, Switch as AMSwitch } from 'antd-mobile';
import styles from '../app.less';

class Triggers extends React.Component {

    componentDidMount() {
        console.log('Triggers did mount');
        this.props.dispatch({
            type: 'app/queryTriggers',
        });
    }

    _fixNumber(val, precision) {
        const power = 10 ** precision;
        return Math.floor(val * power) / power;
    }

    render() {
        const { app: { triggers }, history, dispatch } = this.props;
        return (
            <div className={styles.flexPage}>
                <div className={styles.nav}>
                    <NavBar mode="dark"
                        leftContent={<Flex><Icon type="left" />返回</Flex>}
                        onLeftClick={history.goBack}>
                        价格提醒
                    </NavBar>
                </div>
                <div className={styles.body}>
                    <List renderHeader={() => (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ flex: 1 }}>实验功能，你可以给每个资产设置一个最低值和最高值，当价格不在这个区间时触发提醒。</span>
                        </div>
                    )} />

                    {!triggers.length ? null :
                        triggers.map((trigger) =>
                            <List
                                className={styles.trigger}
                                key={trigger.coin_id}
                                renderHeader={trigger.coin.symbol}
                            >
                                <div>
                                    <Flex className={styles.group} onClick={() => dispatch(routerRedux.push({
                                        pathname: `/coins/${trigger.coin_id}/trigger`,
                                    }))}>
                                        <Flex.Item style={{ flex: '0 0 0%' }} />
                                        {trigger.floor > 0 ?
                                            <Flex.Item className={styles.cell}>
                                                <header>低于(￥)</header>
                                                <p>{this._fixNumber(trigger.floor, 6)}</p>
                                            </Flex.Item>
                                            : ""
                                        }
                                        {trigger.floor > 0 && trigger.ceil > 0 ?
                                            <Flex.Item style={{ flex: '0 0 auto' }}>或</Flex.Item>
                                            : ""
                                        }
                                        {trigger.ceil > 0 ?
                                            <Flex.Item className={styles.cell}>
                                                <header>高于(￥)</header>
                                                <p>{this._fixNumber(trigger.ceil, 6)}</p>
                                            </Flex.Item>
                                            : ""
                                        }
                                        <Flex.Item style={{ flex: '0 0 auto', minWidth: 30 }}>
                                            <Icon type="right" size="xs" />
                                        </Flex.Item>
                                    </Flex>
                                    <Flex style={{ backgroundColor: '#fffad8', padding: 5 }}>
                                        <Flex.Item style={{ textAlign: 'right', color: '#908474' }}>
                                            {trigger.status ? "已开启，触发后自动关闭" : "已关闭"}
                                        </Flex.Item>
                                        <Flex.Item style={{ flex: '0 0 auto', minWidth: 60 }}>
                                            <AMSwitch name="hi" checked={trigger.status} onClick={(val) => {
                                                this.props.dispatch({
                                                    type: 'coin/switchTrigger',
                                                    payload: { coin_id: trigger.coin_id, status: val },
                                                })
                                            }} />
                                        </Flex.Item>
                                    </Flex>
                                </div>
                            </List>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default connect(({ app, loading }) => ({ app, loading }))(Triggers);