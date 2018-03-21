import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Immutable from 'immutable';
import styles from './index.less';
import { WindowScroller, List, AutoSizer } from 'react-virtualized';
import cn from 'classnames';
import { compactInteger } from '../../utils/common';
import { List as AMList, SearchBar } from 'antd-mobile';
const ListItem = AMList.Item;

const Market = ({ market }) => {
    const scrollEl = market.scrollEl ? market.scrollEl.parentNode : window;
    const list = Immutable.List(market.coins);
    const scrollToIndex = -1;

    const _rowRenderer = ({ index, isScrolling, isVisible, key, style }) => {
        const row = list.get(index);
        const className = cn(styles.row, {
            [styles.rowScrolling]: isScrolling,
            isVisible: isVisible,
        });

        return (
            <ListItem key={key} className={className} style={style} extra={`$${row.price_usd}`} align="top"
                thumb={`https://s2.coinmarketcap.com/static/img/coins/32x32/${row.no}.png`} multipleLine>
                {row.name}
                <ListItem.Brief>24H成交${compactInteger(row.volume_usd, 2)}</ListItem.Brief>
            </ListItem>
        );
    };

    const _getRowHeight = ({ index }) => {
        const row = list.get(index % list.size);
        return row.size || 80;
    }

    return (
        <div>
            <SearchBar placeholder="Search" maxLength={8} />
            <WindowScroller
                scrollElement={scrollEl}>
                {({ height = 1, isScrolling, registerChild, onChildScroll, scrollTop }) => (
                    <div className={styles.WindowScrollerWrapper}>
                        <AutoSizer disableHeight>
                            {({ width }) => (
                                <div ref={registerChild}>
                                    <AMList>
                                        <List
                                            ref={el => {
                                                window.listEl = el;
                                            }}
                                            autoHeight
                                            className={styles.List}
                                            height={height}
                                            isScrolling={isScrolling}
                                            onScroll={onChildScroll}
                                            overscanRowCount={2}
                                            rowCount={list.size}
                                            rowHeight={_getRowHeight}
                                            rowRenderer={_rowRenderer}
                                            scrollToIndex={scrollToIndex}
                                            scrollTop={scrollTop}
                                            width={width}
                                        />
                                    </AMList>
                                </div>
                            )}
                        </AutoSizer>
                    </div>
                )}
            </WindowScroller>
        </div>
    )
}

Market.propTypes = {
    market: PropTypes.object,
    loading: PropTypes.object,
}

export default connect(({ market }) => ({ market }))(Market);