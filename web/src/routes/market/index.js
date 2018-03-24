import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Immutable from 'immutable';
import styles from './index.less';
import { List, AutoSizer, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import cn from 'classnames';
import { compactInteger } from '../../utils/common';
import { List as AMList, SearchBar, Flex } from 'antd-mobile';
const ListItem = AMList.Item;

class Market extends React.Component {

    _cache = new CellMeasurerCache({
        fixedWidth: true,
    });

    list = Immutable.List(this.props.market.coins);
    scrollToIndex = -1;

    _percentColor = (val) => {
        if (val > 0) {
            return styles.percentColorUp;
        } else if (val < 0) {
            return styles.percentColorDown;
        }
    };

    _rowRenderer = ({ index, isScrolling, isVisible, key, style, parent }) => {
        const row = this.list.get(index);
        const className = cn({
            isVisible: isVisible,
        });
        // https://bvaughn.github.io/react-virtualized/#/components/CellMeasurer

        return (
            <CellMeasurer
                cache={this._cache}
                columnIndex={0}
                key={key}
                rowIndex={index}
                parent={parent}>
                {({ measure }) => (
                    // <div className={classNames} style={style}>
                    //     <img
                    //         onLoad={measure}
                    //         src={source}
                    //         style={{
                    //             width: imageWidth,
                    //         }}
                    //     />
                    // </div>
                    <ListItem key={key} className={className} style={style}
                        extra={
                            <div>
                                {`$${row.price_usd}`}<br />
                                <span className={this._percentColor(row.percent_change_24h)}>{`${row.percent_change_24h}%`}</span>
                            </div>
                        }
                        align="top"
                        thumb={`https://s2.coinmarketcap.com/static/img/coins/32x32/${row.no}.png`} multipleLine>
                        {row.rank}. {row.name}
                        <ListItem.Brief>
                            市值 ${compactInteger(row.market_cap_usd, 3)}<br />
                            24H成交 ${compactInteger(row.volume_usd, 3)}
                        </ListItem.Brief>
                    </ListItem>
                )}
            </CellMeasurer>

        );
    };

    _onSearch = (input) => {
        let coins;
        if (input) {
            const inputUpperCase = input.toUpperCase();
            // exact match user input
            coins = this.props.market.coinsRaw.filter(item => {
                return item.symbol === inputUpperCase;
            });
            // if not, match whose name containing user input
            if (!coins.length) {
                coins = this.props.market.coinsRaw.filter(item => {
                    return item.name.toUpperCase().includes(inputUpperCase);
                });
            }
        } else {
            coins = this.props.market.coinsRaw;
        }
        this.scrollToIndex = 0;
        this.props.dispatch({
            type: 'market/updateState',
            payload: { coins }
        });
    };

    componentWillUpdate(nextProps) {
        this.list = Immutable.List(nextProps.market.coins);
    }

    render() {
        return (
            <Flex direction="column" style={{ width: '100%', height: '100%' }}>
                <Flex.Item style={{ flex: 0, width: '100%' }}>
                    <SearchBar placeholder="Search" maxLength={8} className={styles.SearchBar} onChange={this._onSearch} />
                </Flex.Item>
                <Flex.Item style={{ width: '100%', height: '100%' }}>
                    <AutoSizer>
                        {({ width, height }) => (
                            <AMList className={styles.ScrollList}>
                                <List
                                    deferredMeasurementCache={this._cache}
                                    height={height}
                                    overscanRowCount={2}
                                    rowCount={this.list.size}
                                    rowHeight={this._cache.rowHeight}
                                    rowRenderer={this._rowRenderer}
                                    scrollToIndex={this.scrollToIndex}
                                    width={width}
                                />
                            </AMList>
                        )}
                    </AutoSizer>
                </Flex.Item>
            </Flex>
        );
    }
}

Market.propTypes = {
    market: PropTypes.object,
    dispatch: PropTypes.func,
};

export default connect(({ market }) => ({ market }))(Market);