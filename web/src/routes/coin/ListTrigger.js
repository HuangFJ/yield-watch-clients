import React from 'react';
import { routerRedux } from 'dva/router';
import { List, Flex, Icon, Button, Switch as AMSwitch, Popover } from 'antd-mobile';
import styles from '../app.less';
import classNames from 'classnames';

const IconHelp = () => (
    <svg width="14px" height="14px" viewBox="0 0 40 40" version="1.1">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="help" transform="translate(-2.000000, -2.000000)" fill="#4A4A4A">
                <rect id="bg" opacity="0" x="0" y="0" width="44" height="44"></rect>
                <g id="icon" transform="translate(2.000000, 2.000000)">
                    <path d="M20,0 C8.954,0 0,8.954 0,20 C0,31.046 8.954,40 20,40 C31.044,40 40,31.046 40,20 C40,8.954 31.044,0 20,0 M20,3 C29.3726667,3 37,10.6254444 37,20 C37,29.3745556 29.3726667,37 20,37 C10.6254444,37 3,29.3745556 3,20 C3,10.6254444 10.6254444,3 20,3" id="Fill-1"></path>
                    <path d="M22,30 C22,31.1037594 21.1067669,32 20.0030075,32 C18.8962406,32 18,31.1037594 18,30 C18,28.8962406 18.8962406,28 20.0030075,28 C21.1067669,28 22,28.8962406 22,30" id="Fill-3"></path>
                    <path d="M26,14.3346535 C26,15.350495 25.7787206,16.2693069 25.3342037,17.0891089 C24.8681462,17.9306931 24.116188,18.8019802 23.0724543,19.6990099 C22.1266319,20.4792079 21.4882507,21.2237624 21.1592689,21.9267327 C20.8302872,22.6693069 20.6657963,23.7247525 20.6657963,25.0910891 C20.6657963,25.3663366 20.5698433,25.590099 20.3759791,25.7663366 C20.2016971,25.9227723 20,26 19.7669713,26 C19.5163185,26 19.3048303,25.9227723 19.1305483,25.7663366 C18.9562663,25.590099 18.8681462,25.3663366 18.8681462,25.0910891 C18.8681462,23.7049505 19.0522193,22.5623762 19.4203655,21.6633663 C19.7865535,20.7247525 20.4347258,19.8752475 21.3609661,19.1128713 C22.4634465,18.1742574 23.227154,17.3148515 23.6520888,16.5326733 C24.020235,15.8475248 24.2023499,15.0673267 24.2023499,14.1861386 C24.1827676,13.1920792 23.8753264,12.380198 23.2741514,11.7544554 C22.5613577,10.9920792 21.5078329,10.6118812 20.1155352,10.6118812 C18.4725849,10.6118812 17.2839426,11.180198 16.5496084,12.3108911 C16.0483029,13.1128713 15.7976501,14.0594059 15.7976501,15.1564356 C15.7976501,15.429703 15.6997389,15.6633663 15.5078329,15.8574257 C15.3335509,16.0356436 15.1298956,16.1227723 14.8988251,16.1227723 C14.6462141,16.1425743 14.4347258,16.0752475 14.2604439,15.9168317 C14.0861619,15.7425743 14,15.4990099 14,15.1841584 C14,13.2514851 14.636423,11.7069307 15.9131854,10.5544554 C17.0724543,9.51683168 18.4725849,9 20.1155352,9 L20.4347258,9 C22.0189295,9 23.3133159,9.43960396 24.3198433,10.3188119 C25.4399478,11.2772277 26,12.6158416 26,14.3346535 Z" id="Fill-2" stroke="#4A4A4A"></path>
                </g>
            </g>
        </g>
    </svg>
)

export default class TriggerList extends React.Component {
    state = {
        visible: false
    }

    _fixNumber(val, precision) {
        const power = 10 ** precision;
        return Math.floor(val * power) / power;
    }

    render() {
        const { loading, trigger, match, dispatch } = this.props;

        return <List renderHeader={() => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: '0 0 auto', minWidth: 65 }}>价格提醒</span>
                <div style={{ flex: 1 }}>
                    <Popover mask
                        placement="topLeft"
                        align={{
                            overflow: { adjustY: 0, adjustX: 0 },
                            offset: [-5, -7],
                        }}
                        visible={this.state.visible}
                        overlay={[
                            <Popover.Item key="1">
                                <span className={styles.triggerTooltip}>实验功能，你可以设置一个最低值和最高值，当价格不在这个区间时触发提醒。</span>
                            </Popover.Item>
                        ]}
                        onVisibleChange={(visible) => {
                            this.setState({
                                visible,
                            })
                        }}
                    >
                        <div style={{ width: 16, height: 16 }} onClick={() => {
                            this.setState({
                                visible: true,
                            })
                        }}>
                            <IconHelp />
                        </div>
                    </Popover>
                </div>
                <Icon className={classNames({
                    [styles.hidden]: !loading.effects['trigger/switchTrigger']
                })} type="loading" size="xxs" />
            </div>
        )} className={styles.trigger}>
            {trigger.coin_id ?
                <div>
                    <Flex className={styles.group} onClick={() => dispatch(routerRedux.push({
                        pathname: `${match.url}/trigger`,
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
                                    type: 'trigger/switchTrigger',
                                    payload: { coin_id: trigger.coin_id, status: val },
                                })
                            }} />
                        </Flex.Item>
                    </Flex>
                </div> 
                :
                    <List.Item>
                        <Button type="ghost" size="small" onClick={() => dispatch(routerRedux.push({
                            pathname: `${match.url}/trigger`,
                        }))}>设置</Button>
                    </List.Item>
            }
        </List>
    }
}