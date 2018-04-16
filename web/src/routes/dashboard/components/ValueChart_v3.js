// http://formidable.com/open-source/victory/guides/custom-charts/
// https://bl.ocks.org/mbostock/3894205
// https://bl.ocks.org/herrstucki/27dc76b6f8411b4725bb
// https://github.com/Swizec/react-d3-pie
// https://bl.ocks.org/mbostock/8d2112a115ad95f4a6848001389182fb
// https://codepen.io/swizec/pen/oYNvpQ
// https://oli.me.uk/2015/09/09/d3-within-react-the-right-way/
// https://mikewilliamson.wordpress.com/2016/06/03/d3-and-react-3-ways/
// https://hackernoon.com/how-and-why-to-use-d3-with-react-d239eb1ea274
// https://hackernoon.com/refs-in-react-all-you-need-to-know-fb9c9e2aeb81
// remove victory, use d3 and more reactfied
// but axis must use react `ref` to achieve dom,
// but you should avoid using d3 append 
// next version try react-faux-dom

import React from 'react';
import * as d3 from 'd3';
import { array } from 'prop-types';
import styles from '../index.less';
import lodash from 'lodash';

export default class ValueChart extends React.Component {
    margin = { top: 20, right: 20, bottom: 40, left: 50 };
    width = 450 - this.margin.left - this.margin.right;
    height = 350 - this.margin.top - this.margin.bottom;

    static propTypes = {
        dataValue: array.isRequired,
        dataInvest: array,
    }

    constructor(props) {
        super(props);
        this.id = lodash.random(0, 10000);
        this.state = {};
    }

    componentWillMount(){
        this.updateD3(this.props);
    }

    componentDidMount() {
        this.renderAxis();
    }

    componentWillReceiveProps(newProps) {
        this.updateD3(newProps);
    }

    componentDidUpdate() {
        this.renderAxis();
    }

    renderAxis() {
        const yAxisNode = this.refs.yAxis;
        const xAxisNode = this.refs.xAxis;
        if (!yAxisNode || !xAxisNode) return;

        const { xAxis, yAxis } = this.state;
        d3.select(yAxisNode)
            .call(yAxis);

        const yTitle = d3.select(yAxisNode).select(`.${styles.yTitle}`);
        if (!yTitle.nodes().length) {
            d3.select(yAxisNode)
                .append("text")
                .attr('class', styles.yTitle)
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .text("单位（￥）");
        }

        d3.select(xAxisNode)
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");
    }

    updateD3(props) {
        const { dataValue, dataInvest } = props;

        if (!dataValue.length) {
            return;
        }

        const xDomain = d3.extent(dataValue, datum => datum[0]);
        const valueDomain = d3.extent(dataValue, datum => datum[1]);

        let yDomain;
        if (dataInvest && dataInvest.length) {
            const investDomain = d3.extent(dataInvest, datum => datum[1]);

            yDomain = [
                d3.min([valueDomain[0], investDomain[0]]),
                d3.max([valueDomain[1], investDomain[1]]),
            ];
        } else {
            yDomain = valueDomain;
        }

        const xScale = d3.scaleTime()
            .domain(xDomain)
            .range([0, this.width]);

        const yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([this.height, 0]);

        const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %d'));

        const yAxis = d3.axisLeft(yScale).ticks(10, 's');

        const valueSpace = d3.area()
            .x(datum => xScale(datum[0]))
            .y0(this.height)
            .y1(datum => yScale(datum[1]))
            .curve(d3.curveBasis);

        const investSpace = d3.area()
            .x(datum => xScale(datum[0]))
            .y0(this.height)
            .y1(datum => yScale(datum[1]))
            .curve(d3.curveBasis);

        const potentialValueSpace = d3.area()
            .x(datum => xScale(datum[0]))
            .y0(datum => yScale(datum[1]))
            .y1(0)
            .curve(d3.curveBasis);

        const potentialInvestSpace = d3.area()
            .x(datum => xScale(datum[0]))
            .y0(datum => yScale(datum[1]))
            .y1(0)
            .curve(d3.curveBasis);

        this.setState({
            valueSpace,
            investSpace,
            potentialValueSpace,
            potentialInvestSpace,
            xAxis,
            yAxis,
        });
    }

    render() {
        const { dataValue, dataInvest } = this.props;
        const {
            valueSpace,
            investSpace,
            potentialValueSpace,
            potentialInvestSpace,
        } = this.state;

        const svgHeight = this.height + this.margin.top + this.margin.bottom;
        const svgWidth = this.width + this.margin.left + this.margin.right;

        return (
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                <g transform={`translate(${this.margin.left},${this.margin.top})`}>
                    <defs>
                        <clipPath id={`potentialValueSpace-${this.id}`}>
                            <path d={potentialValueSpace(dataValue)} />
                        </clipPath>
                        {dataInvest && dataInvest.length ?
                            <clipPath id={`potentialInvestSpace-${this.id}`}>
                                <path d={potentialInvestSpace(dataInvest)} />
                            </clipPath>
                            : null
                        }
                    </defs>
                    <path className={styles.valueArea} clipPath={`url(#potentialInvestSpace-${this.id})`} d={valueSpace(dataValue)} />
                    {dataInvest && dataInvest.length ?
                        <path className={styles.investArea} clipPath={`url(#potentialValueSpace-${this.id})`} d={investSpace(dataInvest)} />
                        : null
                    }

                    <g className="xAxis" transform={`translate(0,${this.height})`} ref="xAxis" />
                    <g className="yAxis" ref="yAxis" />
                </g>
            </svg>
        );
    }
}