/* global d3 */

function buttonControl(selection) {
    var
        margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 200,
        height = 100,
        innerWidth = width - margin.left - margin.right,
        innerHeight = height - margin.top - margin.bottom,
        xValue = function (d) { return d[0]; },
        xScale = d3.scaleBand().padding(0.1),
        onMouseOver = function () { },
        onMouseOut = function () { },
        onMouseDown = function () { },
        onMouseClick = function(){ };

    function chart(selection) {
        selection.each(function (data) {
            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            svgEnter = svg.enter()
                .append('svg')
                .attr("class", "buttonControl")
                .attr("width", width)
                .attr("height", height)
                .append("g").attr("class", "content text")
                .attr("width", innerWidth)
                .attr("height", innerHeight)
                .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
                .merge(svg);
            svg.exit().remove();

            xScale.rangeRound([0, innerWidth])
                .domain(data.map(function (d) { return xValue(d); }));

            g_text = svgEnter.selectAll("text")
                .data(data);
            g_text.enter()
                .append("text")
                .attr('class', 'btn')
                .merge(g_text)
                .attr('x', function (d) { return X(d) + 5; })
                .text(function (d) { return xValue(d) })
                .attr('style', 'font-size:10px;')
                .on("mouseover", onMouseOver)
                .on("mouseout", onMouseOut)
                .on("click", onMouseClick);
            
            g_text.exit().remove();
        });
    }

    // The x-accessor for the path generator; xScale o xValue.
    function X(d) {
        return xScale(xValue(d));
    }

    chart.margin = function (_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function (_) {
        if (!arguments.length) return width;
        width = _;
        innerWidth = width - margin.left - margin.right;
        return chart;
    };

    chart.height = function (_) {
        if (!arguments.length) return height;
        height = _;
        innerHeight = height - margin.top - margin.bottom;
        return chart;
    };

    chart.x = function (_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.onMouseOver = function (_) {
        if (!arguments.length) return onMouseOver;
        onMouseOver = _;
        return chart;
    };

    chart.onMouseOut = function (_) {
        if (!arguments.length) return onMouseOut;
        onMouseOut = _;
        return chart;
    };

    chart.onMouseDown = function (_) {
        if (!arguments.length) return onMouseDown;
        onMouseDown = _;
        return chart;
    };
    
    chart.onMouseClick = function (_) {
        if (!arguments.length) return onMouseClick;
        onMouseClick = _;
        return chart;
    };

    return chart;
}