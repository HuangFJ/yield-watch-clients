// http://formidable.com/open-source/victory/guides/custom-charts/
// https://bl.ocks.org/mbostock/3894205
// https://bl.ocks.org/herrstucki/27dc76b6f8411b4725bb

import React from 'react';
import { extent } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { area, curveBasis, curveStepAfter } from 'd3-shape';
import { VictoryLine, VictoryTheme } from 'victory';
import PropTypes from 'prop-types';
import styles from './ValueChart.less';
import { timeFormat } from 'd3-time-format';
import AreaClipContainer from './AreaClipContainer';
import { VictoryArea, VictoryAxis } from 'victory';
import { Motion, spring } from 'react-motion';

const _ValueChart = ({
    dataValue = [],
    dataInvest = [],
    width = 600,
    height = 400,
}) => {
    if (!dataValue.length) return (
        <svg viewBox={`0 0 ${width} ${height}`}></svg>
    );

    const xDomain = extent(dataValue, datum => datum[0]);
    const valueDomain = extent(dataValue, datum => datum[1]);

    if (!dataInvest.length) {
        dataInvest.push([xDomain[0], valueDomain[0]]);
        dataInvest.push([xDomain[1], valueDomain[0]]);
    }

    const investDomain = extent(dataInvest, datum => datum[1]);

    const yDomain = [
        Math.min(valueDomain[0], investDomain[0]),
        Math.max(valueDomain[1], investDomain[1]),
    ];

    const xScale = scaleTime()
        .domain(xDomain)
        .range([0, width]);

    const yScale = scaleLinear()
        .domain(yDomain)
        .range([height, 0]);

    const valueSpace = area()
        .x(datum => xScale(datum[0]))
        .y0(datum => yScale(datum[1]))
        .y1(height)
        .curve(curveBasis)(dataValue);

    const investSpace = area()
        .x(datum => xScale(datum[0]))
        .y0(datum => yScale(datum[1]))
        .y1(height)
        .curve(curveStepAfter)(dataInvest);

    const potentialValueSpace = area()
        .x(datum => xScale(datum[0]))
        .y0(0)
        .y1(datum => yScale(datum[1]))
        .curve(curveBasis)(dataValue);

    const potentialInvestSpace = area()
        .x(datum => xScale(datum[0]))
        .y0(0)
        .y1(datum => yScale(datum[1]))
        .curve(curveStepAfter)(dataInvest);

    return (
        <svg viewBox={`0 0 ${width} ${height}`}>
            <g transform={"translate(0, 0)"}>
                <VictoryLine width={width} height={height} padding={0} theme={VictoryTheme.material}
                    style={{
                        data: { stroke: "#333333", strokeWidth: 2 }
                    }}
                    animate={{
                        duration: 1000,
                    }}
                    standalone={false}
                    interpolation="basis"
                    data={dataValue}
                    x={0} y={1}
                    domain={{
                        x: xDomain,
                        y: yDomain,
                    }}
                    scale={{ x: "time", y: "linear" }}
                />

                <g>
                    <defs>
                        <clipPath id="potentialValueSpace">
                            <path d={potentialValueSpace} />
                        </clipPath>
                        <clipPath id="potentialInvestSpace">
                            <path d={potentialInvestSpace} />
                        </clipPath>
                    </defs>
                    <path style={{ 'fill': '#ffde28' }} clipPath="url(#potentialInvestSpace)" d={valueSpace} />
                    <path style={{ 'fill': '#c85bff' }} clipPath="url(#potentialValueSpace)" d={investSpace} />
                </g>
            </g>
        </svg>
    );
};

_ValueChart.propTypes = {
    dataValue: PropTypes.array,
    dataInvest: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
}

class ValueChart extends React.Component {
    componentDidMount() {
        console.log('chart ok');
    }
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