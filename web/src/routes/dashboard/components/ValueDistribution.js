// http://cng.seas.rochester.edu/CNG/docs/x11color.html

import React from 'react';
import * as d3 from 'd3';
import { object } from 'prop-types';
import * as chroma from 'chroma-js';

export default class ValueDistribution extends React.Component {
    margin = { top: 20, right: 20, bottom: 30, left: 50 };
    width = 450 - this.margin.left - this.margin.right;
    height = 350 - this.margin.top - this.margin.bottom;

    static propTypes = {
        data: object.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {};
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

        const yTitle = d3.select(yAxisNode).select('.title');
        if (!yTitle.nodes().length) {
            d3.select(yAxisNode)
                .append("text")
                .attr('class', 'title')
                .attr('fill', chroma('Black'))
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .text("市值（￥）");
        }

        d3.select(xAxisNode)
            .call(xAxis);
    }

    updateD3(props) {
        const data = props.data;

        if (!Object.keys(data).length) {
            return;
        }

        const xDomain = d3.extent(data, datum => datum[0]);
        const yDomain = d3.extent(data, datum => datum[1]);

        const xScale = d3.scaleTime()
            .domain(xDomain)
            .range([0, this.width]);

        const yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([this.height, 0]);

        const xAxis = d3.axisBottom(xScale);

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
        if (!dataValue.length) {
            return null;
        }
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
                        <clipPath id="potentialValueSpace">
                            <path d={potentialValueSpace(dataValue)} />
                        </clipPath>
                        {dataInvest && dataInvest.length ?
                            <clipPath id="potentialInvestSpace">
                                <path d={potentialInvestSpace(dataInvest)} />
                            </clipPath>
                            : null
                        }
                    </defs>
                    <path style={{ 'fill': chroma('SeaGreen') }} clipPath="url(#potentialInvestSpace)" d={valueSpace(dataValue)} />
                    {dataInvest && dataInvest.length ?
                        <path style={{ 'fill': chroma('IndianRed') }} clipPath="url(#potentialValueSpace)" d={investSpace(dataInvest)} />
                        : null
                    }

                    <g className="xAxis" transform={`translate(0,${this.height})`} ref="xAxis" />
                    <g className="yAxis" ref="yAxis" />
                </g>
            </svg>
        );
    }
}