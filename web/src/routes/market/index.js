import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Immutable from 'immutable';
import styles from './index.less';
import { WindowScroller, List, AutoSizer, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import cn from 'classnames';
import { StickyContainer, Sticky } from 'react-sticky';
import { compactInteger } from '../../utils/common';
import { List as AMList, SearchBar } from 'antd-mobile';
const ListItem = AMList.Item;

const Market = ({ market, dispatch }) => {
    const _cache = new CellMeasurerCache({
        fixedWidth: true,
    });

    const _percentColor = (val) => {
        if (val > 0) {
            return styles.percentColorUp;
        } else if (val < 0) {
            return styles.percentColorDown;
        }
    }

    const scrollEl = market.scrollEl ? market.scrollEl.parentNode : window;
    const list = Immutable.List(market.coins);

    const _rowRenderer = ({ index, isScrolling, isVisible, key, style, parent }) => {
        const row = list.get(index);
        const className = cn({
            isVisible: isVisible,
        });
        // https://bvaughn.github.io/react-virtualized/#/components/CellMeasurer

        return (
            <CellMeasurer
                cache={_cache}
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
                                <span className={_percentColor(row.percent_change_24h)}>{`${row.percent_change_24h}%`}</span>
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

    const _onSearch = (input) => {
        const inputUpperCase = input.toUpperCase();
        // exact match user input
        let coins = market.coinsRaw.filter(item => {
            return item.symbol === inputUpperCase;
        });
        // if not, match whose name containing user input
        if (!coins.length) {
            coins = market.coinsRaw.filter(item => {
                return item.name.toUpperCase().includes(inputUpperCase);
            });
        }
        dispatch({
            type: 'market/updateState',
            payload: { coins, scrollToIndex: 0 }
        });
    }

    return (
        <StickyContainer>
            <Sticky>
                {
                    ({ style }) => {
                        return (
                            <header style={{ ...style, zIndex: 99 }}>
                                <SearchBar placeholder="Search" maxLength={8} className={styles.SearchBar} onChange={_onSearch} />
                            </header>
                        )
                    }
                }
            </Sticky>
            <div>
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
                                                deferredMeasurementCache={_cache}
                                                height={height}
                                                isScrolling={isScrolling}
                                                onScroll={onChildScroll}
                                                overscanRowCount={2}
                                                rowCount={list.size}
                                                rowHeight={_cache.rowHeight}
                                                rowRenderer={_rowRenderer}
                                                scrollTop={scrollTop}
                                                scrollToIndex={market.scrollToIndex}
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
        </StickyContainer>
    )
}

Market.propTypes = {
    market: PropTypes.object,
    dispatch: PropTypes.func,
}

export default connect(({ market }) => ({ market }))(Market);