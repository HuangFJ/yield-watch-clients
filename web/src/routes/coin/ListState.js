import React from 'react';
import { routerRedux } from 'dva/router';
import { List, SwipeAction, Icon, Button } from 'antd-mobile';
import styles from '../app.less';
import classNames from 'classnames';
import { timeFormat } from 'd3';

export default class ListState extends React.Component {

    render() {
        const { loading, coinState, detail, dispatch, match } = this.props;

        return <List renderHeader={() => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: 1 }}>持币变化</span>
                <Icon className={classNames({
                    [styles.hidden]: !loading.effects['coin/delCoinState']
                })} type="loading" size="xxs" />
            </div>
        )}>
            {!coinState.length ? 
                null 
                :
                    coinState.map((row) => (
                        <SwipeAction
                            key={row.id}
                            autoClose
                            right={[{
                                text: '删除',
                                onPress: () => {
                                    this.props.dispatch({
                                        type: 'coin/delCoinState',
                                        payload: row,
                                    })
                                },
                                style: { backgroundColor: 'red', color: 'white' },
                            }]}>
                            <List.Item key={row.id} extra={`${row.amount} ${detail.symbol}`}
                                onClick={() => dispatch(routerRedux.push({
                                    pathname: `${match.url}/state/${row.id}`,
                                }))}
                            >
                                {timeFormat("%Y-%m-%d")(new Date(row.created * 1000))}
                            </List.Item>
                        </SwipeAction>
                    ))
            }
            <List.Item>
                <Button type="ghost" size="small" onClick={() => dispatch(routerRedux.push({
                    pathname: `${match.url}/state/0`,
                }))}>录入</Button>
            </List.Item>
        </List>
    }
}