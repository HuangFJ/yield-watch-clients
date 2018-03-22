// http://cng.seas.rochester.edu/CNG/docs/x11color.html
// https://www.w3cplus.com/html5/svg-transformations.html
// https://codesandbox.io/s/github/tibotiber/rfd-animate-example/tree/master/
// https://codesandbox.io/s/JqYGAqlEJ
// d3 text overlap
// https://www.safaribooksonline.com/blog/2014/03/11/solving-d3-label-placement-constraint-relaxing/
// https://www.visualcinnamon.com/2015/07/voronoi.html
// https://walkingtree.tech/d3-quadrant-chart-collision-in-angular2-application/

import React from 'react';
import * as d3 from 'd3';
import { array } from 'prop-types';
import { withFauxDOM } from 'react-faux-dom'
import { compactInteger } from '../../../utils/common';
import * as chroma from 'chroma-js';

function collide(arr) {
    const alpha = 3;
    const spacing = 12;
    let again;

    do {
        again = false;
        for (const i in arr) {
            const a = arr[i];
            for (const j in arr) {
                const b = arr[j];
                // a & b are the same element and don't collide.
                if (i === j) continue;
                // a & b are on opposite sides of the chart and
                // don't collide
                if (a.anchor !== b.anchor) continue;

                // Now let's calculate the distance between
                // these elements. 
                const deltaY = a.y - b.y;

                // Our spacing is greater than our specified spacing,
                // so they don't collide.
                if (Math.abs(deltaY) > spacing) continue;

                // If the labels collide, we'll push each 
                // of the two labels up and down a little bit.
                again = true;
                const sign = deltaY > 0 ? 1 : -1;
                const adjust = sign * alpha;
                a.y = a.y + adjust;
                b.y = b.y - adjust;
            }
        }
    } while (again);
}

class ValueDistribution extends React.Component {

    // Store our chart dimensions
    cDim = {
        height: 450,
        width: 500,
        innerRadius: 100,
        outerRadius: 130,
        labelRadius: 160
    }

    static propTypes = {
        data: array.isRequired,
    }

    componentDidMount() {
        // This will create a faux div and store its virtual DOM in state.chart
        const faux = this.props.connectFauxDOM('div', 'chart');

        /*
           D3 code below by Alan Smith, http://bl.ocks.org/alansmithy/e984477a741bc56db5a5
           The only changes made for this example are...
           1) feeding D3 the faux node created above
           2) calling this.animateFauxDOM(duration) after each animation kickoff
           3) move data generation and button code to parent component
           4) data and title provided as props by parent component
           5) reattach to faux dom for updates
           6) move rejoining of data and chart updates to updateD3()
        */

        // Set the size of our SVG element
        const canvas = d3.select(faux)
            .append('svg')
            .attr('viewBox', `0 0 ${this.cDim.width} ${this.cDim.height}`)
            .append('g')
            .attr('id', 'canvas');

        // This translate property moves the origin of the group's coordinate
        // space to the center of the SVG element, saving us translating every
        // coordinate individually. 
        canvas.attr('transform', `translate(${this.cDim.width * 0.5},${this.cDim.height * 0.57})`);

        this.art = canvas.append('g').attr('id', 'art');
        this.labels = canvas.append('g').attr('id', 'labels');

        this.updateD3();
    }

    componentDidUpdate(prevProps, prevState) {
        // do not compare props.chart as it gets updated in updateD3()
        if (this.props.data !== prevProps.data) {
            this.updateD3();
        }
    }

    updateD3() {
        // Create the pie layout function.
        // This function will add convenience
        // data to our existing data, like 
        // the start angle and end angle
        // for each data element.
        const jhw_pie = d3.pie();
        jhw_pie.value((d, i) => {
            // Tells the layout function what
            // property of our data object to
            // use as the value.
            return d.value_cny;
        });

        const pied_data = jhw_pie(this.props.data);

        // The pied_arc function we make here will calculate the path
        // information for each wedge based on the data set. This is 
        // used in the "d" attribute.
        const pied_arc = d3.arc()
            .innerRadius(this.cDim.innerRadius)
            .outerRadius(this.cDim.outerRadius);

        // This is an ordinal scale that returns 10 predefined colors.
        const pied_colors = d3.scaleOrdinal(chroma.scale([
            'rgb(255, 204, 77)',
            'rgb(84, 163, 242)',
        ]).mode('lch').colors(pied_data.length));

        // Let's start drawing the arcs.
        const enteringArcs = this.art.selectAll(".wedge").data(pied_data).enter();
        enteringArcs.append("path")
            .attr("class", "wedge")
            .attr("d", pied_arc)
            .style("fill", (d, i) => {
                return pied_colors(i);
            });

        // Now we'll draw our label circles, lines and texts.
        const enteringLabels = this.labels.selectAll(".label").data(pied_data).enter();
        const labelGroups = enteringLabels.append("g").attr("class", "label");
        labelGroups.append("circle")
            .attr('class', "label-circle")
            .attr('r', 1)
            .attr('transform', (d, i) => {
                return "translate(" + pied_arc.centroid(d) + ")";
            });

        const textLines = labelGroups.append("line")
            .attr('class', 'label-line')
            .attr('x1', (d, i) => {
                return pied_arc.centroid(d)[0];
            })
            .attr('y1', (d, i) => {
                return pied_arc.centroid(d)[1];
            });

        const labelRadius = this.cDim.labelRadius;
        const labelSimulation = [];

        const textLabels = labelGroups.append("text")
            .attr('class', 'label-text')
            .text((d, i) => {
                const centroid = pied_arc.centroid(d);
                const midAngle = Math.atan2(centroid[1], centroid[0]);
                const x = Math.cos(midAngle) * labelRadius;
                const y = Math.sin(midAngle) * labelRadius;

                const anchor = (x > 0) ? "start" : "end";

                labelSimulation.push({
                    x,
                    y,
                    anchor,
                });

                // Label field of data.
                return `${d.data.coin.symbol}￥${compactInteger(d.data.value_cny, 2)}`;
            });

        collide(labelSimulation);

        textLabels
            .attr('x', (d, i) => {
                const x = labelSimulation[i].x;
                return x + (x > 0 ? +5 : -5);
            }).attr('y', (d, i) => {
                return labelSimulation[i].y;
            }).attr('text-anchor', (d, i) => {
                return labelSimulation[i].anchor;
            });

        textLines
            .attr('x2', (d, i) => {
                return labelSimulation[i].x;
            }).attr('y2', (d, i) => {
                return labelSimulation[i].y;
            });

        this.props.drawFauxDOM()

        // const ticked = () => {
        //     textLabels.attr("x", function (d, i) {
        //         return label_array[i].x;
        //     })
        //         .attr("y", function (d, i) { return label_array[i].y; });
        //     this.props.drawFauxDOM()
        // }
        // const repelForce = d3.forceManyBody().strength(-140).distanceMax(80).distanceMin(20);
        // const attractForce = d3.forceManyBody().strength(100).distanceMax(100).distanceMin(100);
        // const simulation = d3.forceSimulation(label_array)
        //     .velocityDecay(0.5)
        //     .force("attractForce", attractForce)
        //     .force("repelForce", repelForce)
        //     .force('collide', d3.forceCollide().radius(() => 30))
        //     .on("tick", ticked)
        //     .on('end', () => {
        //     })

    }

    render() {
        return (
            <div>
                {this.props.chart}
            </div>
        )
    }
}

export default withFauxDOM(ValueDistribution);