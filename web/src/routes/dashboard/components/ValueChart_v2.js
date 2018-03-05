// more victorified, react motion, axis supported
// but functional limited, like custom VictoryPie label, it's hell
import React from 'react';
import { extent } from 'd3-array';
import PropTypes from 'prop-types';
import styles from './ValueChart.less';
import { timeFormat } from 'd3-time-format';
import { VictoryArea, VictoryAxis } from 'victory';
import { Motion, spring } from 'react-motion';
import { area, curveBasis } from 'd3-shape';

export class AreaClipContainer extends React.Component {

    render() {
        const {
            data = [],
            selectX = datum => datum.x,
            selectY0 = datum => datum.y0,
            selectY = datum => datum.y,
            interpolation = curveBasis,
            children
        } = this.props;

        if (!children[0].props.data) return;
        if (!data.length) return (
            <g>
                {children}
            </g>
        );

        const rndId = Math.random().toString().replace('.', '');

        const { scale } = children[0].props
        const clipAreaPath = area()
            .x(datum => scale.x(selectX(datum)))
            .y0(datum => scale.y(selectY0(datum)))
            .y1(datum => scale.y(selectY(datum)))
            .curve(interpolation)(data);

        return (
            <g>
                <defs>
                    <clipPath id={`area-clip-${rndId}`}>
                        <path d={clipAreaPath} />
                    </clipPath>
                </defs>

                <g clipPath={`url(#area-clip-${rndId})`}>
                    {children}
                </g>
            </g>
        )
    }
}

AreaClipContainer.propTypes = {
    data: PropTypes.array,
    selectX: PropTypes.func,
    selectY: PropTypes.func,
    selectY0: PropTypes.func,
    interpolation: PropTypes.any,
}

class ValueChart extends React.Component {

    render() {
        const { dataValue = [], dataInvest } = this.props;

        if (!dataValue.length) return (
            <svg style={styles.parent} viewBox="0 0 450 350">

            </svg>
        );

        const xDomain = extent(dataValue, datum => datum[0]);
        const yDomain = extent(dataValue, datum => datum[1]);

        return (
            <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: spring(1) }}>
                {value =>
                    <svg style={{ opacity: value.opacity }} viewBox="0 0 450 350">
                        <g>
                            <VictoryAxis
                                scale={{ x: "time" }}
                                domain={xDomain}
                                standalone={false}
                                tickFormat={x => {
                                    return timeFormat("%Y/%m/%d")(x);
                                }}
                                style={{
                                    grid: { stroke: (t) => "grey" },
                                    axis: { strokeWidth: 0 },
                                    tickLabels: { angle: 45, padding: 20 },
                                }}
                            />
                            <VictoryAxis dependentAxis
                                domain={yDomain}
                                orientation="left"
                                standalone={false}
                                tickFormat={y => {
                                    return `${Math.floor(y / 10000)}万`;
                                }}
                                style={{
                                    axis: { strokeWidth: 0 },
                                }}
                            />
                            <VictoryArea
                                style={{ data: { 'fill': '#ffde28' } }}
                                groupComponent={<AreaClipContainer data={dataInvest} />}
                                data={dataValue}
                                x={0}
                                y={1}
                                scale={{ x: "time", y: "linear" }}
                                standalone={false}
                            />
                        </g>
                    </svg>
                }
            </Motion>
        )
    }
}

ValueChart.propTypes = {
    dataValue: PropTypes.array,
    dataInvest: PropTypes.array,
}

export default ValueChart;