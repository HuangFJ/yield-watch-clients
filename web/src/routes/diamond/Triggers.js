import React from 'react';
import { connect } from 'dva';
import { Switch, Route } from 'dva/router';
import { NavBar, List, Flex, Icon, Switch as AMSwitch } from 'antd-mobile';
import styles from '../app.less';
import classNames from 'classnames';
import CoinTrigger from '../coin/CoinTrigger';

class Triggers extends React.Component {

    componentWillMount() {
        this.props.dispatch({
            type: 'trigger/queryTriggers',
        });
    }

    componentDidMount() {
        console.log('Triggers did mount');
    }

    _fixNumber(val, precision) {
        const power = 10 ** precision;
        return Math.floor(val * power) / power;
    }

    render() {
        const { triggers, history, dispatch, loading, match, user } = this.props;

        return (
            <div>
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
                                <span style={{ flex: 1 }}>实验功能，你可以给资产设置一个范围，当价格超出这个范围时触发提醒。本月可使用提醒 {user.trigger_credit-user.trigger_used}/{user.trigger_credit} 条。</span>
                            </div>
                        )} />

                        {!triggers.length ? null :
                            triggers.map((trigger) =>
                                <List
                                    className={styles.trigger}
                                    key={trigger.coin_id}
                                    renderHeader={() => <Flex>
                                        <Flex.Item>{trigger.coin.symbol}</Flex.Item>
                                        <Flex.Item style={{flex: '0 0 auto', minHeight: 20}}>
                                            <Icon className={classNames({
                                                [styles.hidden]: !loading.effects['trigger/switchTrigger'] || trigger.coin_id !== this._switch_coin_id
                                            })} type="loading" size="xxs" />
                                        </Flex.Item>
                                    </Flex>}
                                >
                                    <div>
                                        <Flex className={styles.group} onClick={() => dispatch({
                                            type: 'trigger/triggerDetail',
                                            payload: { trigger }
                                        })}>
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
                                                    this._switch_coin_id = trigger.coin_id
                                                    this.props.dispatch({
                                                        type: 'trigger/switchTrigger',
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
                <Switch>
                    <Route path={`${match.url}/:coin_id`} component={CoinTrigger} />
                </Switch>
            </div>
        )
    }
}

export default connect(({ trigger, loading, app }) => ({ triggers: trigger.triggers, loading, user: app.user }))(Triggers);