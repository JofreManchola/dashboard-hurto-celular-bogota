/* global d3 */

function radialLineChart() {

    // document.body.style.zoom = 0.80
    var margin = { top: 0, bottom: 0, right: 0, left: 0 },
        modo = 0,
        width = 100,
        height = 100,
        innerRadius = 100,
        outerRadius = Math.min((width - margin.right - margin.left), (height - margin.top - margin.bottom)) / 2 - 6,
        fullCircle = 2 * Math.PI;

    var xValue = function (d) { return d.Date2; };
    var yValue = function (d) { return d.Close; };

    var yValue_2016 = function (d) { return d.Serie_2016; };
    var yValue_2015 = function (d) { return d.Serie_2015; };
    var yValue_2014 = function (d) { return d.Serie_2014; };
    var yValue_2013 = function (d) { return d.Serie_2013; };
    var yValue_2012 = function (d) { return d.Serie_2012; };
    var yValue_2011 = function (d) { return d.Serie_2011; };
    var yValue_2010 = function (d) { return d.Serie_2010; };

    var xScale = d3.scaleTime();
    var yScale = d3.scaleRadial();

    var opacity = 0.3;

    var colours = ["#0077ff", "#ff7600", "#ff00d8", "#157420", "#24b6bc", "#fae80b", "#000000"];
    //var colours = ["#034e7b","#0570b0","#3690c0","#74a9cf","#a6bddb","#d0d1e6","#f1eef6"];

    function chart(selection) {
        selection.each(function (data) {

            var svg = d3.select(this).selectAll("svg").data([data])
            var svgEnter = svg.enter().append("svg");

            svgEnter
                .attr("width", width)
                .attr("height", height)
                .append("g");

            outerRadius = Math.min((width - margin.right - margin.left), (height - margin.top - margin.bottom)) / 2 - 6;
            innerRadius = outerRadius / 2.5;

            // Update the outer dimensions.
            svg.merge(svgEnter)
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom);

            // Update the inner dimensions.
            var g = svg.merge(svgEnter).select("g")
                .attr("transform", "translate(" + ((width - margin.left - margin.right) / 2) + "," + ((height - margin.top - margin.bottom) / 2) + ")");

            xScale
                .range([0, fullCircle])
                //.domain(d3.extent(data, function(d) { return d.Date2; }));
                .domain(d3.extent(data, xValue));

            yScale
                .range([innerRadius, outerRadius])
                //.domain(d3.extent(data, function(d) { return d.Close; }));
                .domain(d3.extent(data, yValue));

            var format = ["%b", "%I %p", "%I %p", "%I %p"];
            var title = ["Mes", "Hora", "Hora", "Hora"];
            var subtitle = ["Día", "15 min", "30 min", "60 min"];
            var title_ = title[modo];
            var subtitle_ = subtitle[modo];
            var labelFormat = d3.timeFormat(format[modo]);

            var line1 = d3.lineRadial().angle(X).radius(Y_2016);
            var line2 = d3.lineRadial().angle(X).radius(Y_2015);
            var line3 = d3.lineRadial().angle(X).radius(Y_2014);
            var line4 = d3.lineRadial().angle(X).radius(Y_2013);
            var line5 = d3.lineRadial().angle(X).radius(Y_2012);
            var line6 = d3.lineRadial().angle(X).radius(Y_2011);
            var line7 = d3.lineRadial().angle(X).radius(Y_2010);

            var linePlot1 = g.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colours[0])
                .attr("stroke-width", 1.5)
                .attr("opacity", opacity)
                .attr("d", line1);

            var linePlot2 = g.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colours[1])
                .attr("stroke-width", 1.5)
                .attr("opacity", opacity)
                .attr("d", line2);

            var linePlot3 = g.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colours[2])
                .attr("stroke-width", 1.5)
                .attr("opacity", opacity)
                .attr("d", line3);

            var linePlot4 = g.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colours[3])
                .attr("stroke-width", 1.5)
                .attr("opacity", opacity)
                .attr("d", line4);

            var linePlot5 = g.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colours[4])
                .attr("stroke-width", 1.5)
                .attr("opacity", opacity)
                .attr("d", line5);

            var linePlot6 = g.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colours[5])
                .attr("stroke-width", 1.5)
                .attr("opacity", opacity)
                .attr("d", line6);

            var linePlot7 = g.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colours[6])
                .attr("stroke-width", 1.5)
                .attr("opacity", opacity)
                .attr("d", line7);

            /*
            */

            var yAxis = g.append("g")
                .attr("text-anchor", "middle");

            var yTick = yAxis
                .selectAll("g")
                .data(yScale.ticks(5))
                .enter().append("g");

            yTick.append("circle")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("opacity", 0.2)
                .attr("r", yScale);

            yAxis.append("circle")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("opacity", 0.2)
                .attr("r", function () { return yScale(yScale.domain()[0]) });

            var labels = yTick.append("text")
                .attr("y", function (d) { return -yScale(d); })
                .attr("dy", "0.35em")
                .attr("fill", "none")
                //.attr("stroke", "#fff")
                .attr("stroke-width", 5)
                .attr("stroke-linejoin", "round")
                .text(function (d) { return "$x" + d; });

            yTick.append("text")
                .attr("y", function (d) { return -yScale(d); })
                .attr("dy", "0.35em")
                .text(function (d) { return "" + d; });

            var xAxis = g.append("g");

            var xTick = xAxis
                .selectAll("g")
                .data(xScale.ticks(12))
                .enter().append("g")
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "rotate(" + ((xScale(d)) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
                });

            xTick.append("line")
                .attr("x2", -10)
                .attr("stroke", "#000");

            xTick.append("text")
                .attr("transform", function (d) {
                    var angle = xScale(d);
                    return ((angle < Math.PI / 2) || (angle > (Math.PI * 3 / 2))) ? "rotate(90)translate(0,22)" : "rotate(-90)translate(0, -15)";
                })
                .text(function (d) {
                    return labelFormat(d);
                })
                .style("font-size", 10)
                .attr("opacity", 0.6);

            var title = g.append("g")
                .attr("class", "title")
                .append("text")
                .attr("dy", "-0.2em")
                .attr("text-anchor", "middle")
                .text(title_); //Title

            var subtitle = g.append("text")
                .attr("dy", "1em")
                .attr("text-anchor", "middle")
                .attr("opacity", 0.6)
                .text(subtitle_);  //Subtitle
        });
    }

    function X(d) { return xScale(xValue(d)); }
    function Y_2016(d) { return yScale(yValue_2016(d)); }
    function Y_2015(d) { return yScale(yValue_2015(d)); }
    function Y_2014(d) { return yScale(yValue_2014(d)); }
    function Y_2013(d) { return yScale(yValue_2013(d)); }
    function Y_2012(d) { return yScale(yValue_2012(d)); }
    function Y_2011(d) { return yScale(yValue_2011(d)); }
    function Y_2010(d) { return yScale(yValue_2010(d)); }

    chart.innerRadius = function (_) {
        if (!arguments.length) return innerRadius;
        innerRadius = _;
        return chart;
    };

    chart.modo = function (_) {
        if (!arguments.length) return modo;
        modo = _;
        return chart;
    };

    chart.width = function (_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function (_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    return chart;
}