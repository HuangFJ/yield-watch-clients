// http://cng.seas.rochester.edu/CNG/docs/x11color.html
// https://www.w3cplus.com/html5/svg-transformations.html
// https://codesandbox.io/s/github/tibotiber/rfd-animate-example/tree/master/
// https://codesandbox.io/s/JqYGAqlEJ
// d3 text overlap
// https://www.safaribooksonline.com/blog/2014/03/11/solving-d3-label-placement-constraint-relaxing/

import React from 'react';
import * as d3 from 'd3';
import { array } from 'prop-types';
import { withFauxDOM } from 'react-faux-dom'
import 'd3-selection-multi';
import './ValueDistribution.css';

class ValueDistribution extends React.Component {

    cDim = {
        height: 500,
        width: 500,
        innerRadius: 50,
        outerRadius: 150,
        labelRadius: 175
    }

    static propTypes = {
        data: array.isRequired,
    }

    componentDidMount() {
        var faux = this.props.connectFauxDOM('div', 'chart');

        var svg = d3.select(faux).append('svg');
        var canvas = svg.append('g').attr('id', 'canvas')

        // Store our chart dimensions
        var cDim = this.cDim;

        // Set the size of our SVG element
        svg.attrs({
            height: cDim.height,
            width: cDim.width
        });

        // This translate property moves the origin of the group's coordinate
        // space to the center of the SVG element, saving us translating every
        // coordinate individually. 
        canvas.attr("transform", "translate(" + (cDim.width / 2) + "," + (cDim.width / 2) + ")");

        canvas.append('g').attr('id', 'art');
        canvas.append('g').attr('id', 'labels');

        this.props.drawFauxDOM()
    }

    componentDidUpdate(prevProps, prevState) {
        // do not compare props.chart as it gets updated in updateD3()
        if (this.props.data !== prevProps.data) {
            this.updateD3()
        }
    }

    updateD3() {
        var data = this.props.data;

        // This will create a faux div and store its virtual DOM in state.chart
        var faux = this.props.connectFauxDOM('div', 'chart');

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

        var svg = d3.select(faux).select('svg');
        var canvas = svg.select('#canvas')

        var art = canvas.select('#art');
        var labels = canvas.select('#labels');

        // Create the pie layout function.
        // This function will add convenience
        // data to our existing data, like 
        // the start angle and end angle
        // for each data element.
        var jhw_pie = d3.pie()
        jhw_pie.value(function (d, i) {
            // Tells the layout function what
            // property of our data object to
            // use as the value.
            return d.value_cny;
        });

        var pied_data = jhw_pie(data);

        // The pied_arc function we make here will calculate the path
        // information for each wedge based on the data set. This is 
        // used in the "d" attribute.
        var pied_arc = d3.arc()
            .innerRadius(50)
            .outerRadius(150);

        // This is an ordinal scale that returns 10 predefined colors.
        // It is part of d3 core.
        var pied_colors = d3.scaleOrdinal(d3.schemeCategory10);

        // Let's start drawing the arcs.
        var enteringArcs = art.selectAll(".wedge").data(pied_data).enter();

        enteringArcs.append("path")
            .attr("class", "wedge")
            .attr("d", pied_arc)
            .style("fill", function (d, i) {
                return pied_colors(i);
            });

        // Now we'll draw our label lines, etc.
        var enteringLabels = labels.selectAll(".label").data(pied_data).enter();
        var labelGroups = enteringLabels.append("g").attr("class", "label");
        labelGroups.append("circle").attrs({
            x: 0,
            y: 0,
            r: 2,
            fill: "#000",
            transform: function (d, i) {
                return "translate(" + pied_arc.centroid(d) + ")";
            },
            'class': "label-circle"
        });

        var cDim = this.cDim;

        // "When am I ever going to use this?" I said in 
        // 10th grade trig.
        var textLines = labelGroups.append("line").attrs({
            x1: function (d, i) {
                return pied_arc.centroid(d)[0];
            },
            y1: function (d, i) {
                return pied_arc.centroid(d)[1];
            },
            x2: function (d, i) {
                var centroid = pied_arc.centroid(d);
                var midAngle = Math.atan2(centroid[1], centroid[0]);
                var x = Math.cos(midAngle) * cDim.labelRadius;
                return x;
            },
            y2: function (d, i) {
                var centroid = pied_arc.centroid(d);
                var midAngle = Math.atan2(centroid[1], centroid[0]);
                var y = Math.sin(midAngle) * cDim.labelRadius;
                return y;
            },
            'class': "label-line"
        });

        var textLabels = labelGroups.append("text").attrs({
            x: function (d, i) {
                var centroid = pied_arc.centroid(d);
                var midAngle = Math.atan2(centroid[1], centroid[0]);
                var x = Math.cos(midAngle) * cDim.labelRadius;
                var sign = (x > 0) ? 1 : -1
                var labelX = x + (5 * sign)
                return labelX;
            },
            y: function (d, i) {
                var centroid = pied_arc.centroid(d);
                var midAngle = Math.atan2(centroid[1], centroid[0]);
                var y = Math.sin(midAngle) * cDim.labelRadius;
                return y;
            },
            'text-anchor': function (d, i) {
                var centroid = pied_arc.centroid(d);
                var midAngle = Math.atan2(centroid[1], centroid[0]);
                var x = Math.cos(midAngle) * cDim.labelRadius;
                return (x > 0) ? "start" : "end";
            },
            'class': 'label-text'
        }).text(function (d) {
            return d.data.coin.name
        });

        var alpha = 0.5;
        var spacing = 12;

        function relax() {
            var again = false;
            textLabels.each(function (d, i) {
                var a = this;
                var da = d3.select(a);
                var y1 = da.attr("y");
                textLabels.each(function (d, j) {
                    var b = this;
                    // a & b are the same element and don't collide.
                    if (a === b) return;
                    var db = d3.select(b);
                    // a & b are on opposite sides of the chart and
                    // don't collide
                    if (da.attr("text-anchor") !== db.attr("text-anchor")) return;
                    // Now let's calculate the distance between
                    // these elements. 
                    var y2 = db.attr("y");
                    var deltaY = y1 - y2;

                    // Our spacing is greater than our specified spacing,
                    // so they don't collide.
                    if (Math.abs(deltaY) > spacing) return;

                    // If the labels collide, we'll push each 
                    // of the two labels up and down a little bit.
                    again = true;
                    var sign = deltaY > 0 ? 1 : -1;
                    var adjust = sign * alpha;
                    da.attr("y", +y1 + adjust);
                    db.attr("y", +y2 - adjust);
                });
            });
            // Adjust our line leaders here
            // so that they follow the labels. 
            if (again) {
                var labelElements = textLabels.nodes();
                textLines.attr("y2", function (d, i) {
                    var labelForLine = d3.select(labelElements[i]);
                    return labelForLine.attr("y");
                });

                relax();
            }
        }

        relax();

        this.props.drawFauxDOM()
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