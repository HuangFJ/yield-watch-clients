import React from 'react';
import { connect } from 'dva';
import { NavBar, List } from 'antd-mobile';
import { ValueChart } from '../dashboard/components';
import styles from '../app.less';

class Coin extends React.Component {

    componentWillMount(){
        const params = this.props.match.params;
        this.props.dispatch({
            type: 'coin/query',
            payload: params,
        });
    }

    componentDidMount() {
        console.log('Coin did mount');
    }

    render() {
        const { coin, history } = this.props;
        
        return (
            <div className={styles.fullScreen}>
                <NavBar mode="dark" leftContent="< 返回" onLeftClick={history.goBack}>{coin.detail.name}</NavBar>
                <List renderHeader={() => '价格变化'} className={styles.values}>
                    {coin.detail.history ?
                        <List.Item>
                            <ValueChart dataValue={coin.detail.history} dataInvest={[]} />
                        </List.Item>
                        : null
                    }
                </List>
            </div>
        )
    }
}

export default connect(({ coin }) => ({ coin }))(Coin);