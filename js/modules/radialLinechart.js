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

    var xValue = function (d) { return d[0]; };
    var yValue = function (d) { return d[1]; };

    xScale = d3.scaleTime();
    yScale = d3.scaleRadial();

    var opacity = 0.7;

    var colours = d3.scaleOrdinal(d3.schemeCategory10);

    function chart(selection) {
        selection.each(function (data) {

            dataSeries = data.reduce(function (valorAnterior, valorActual, indice, vector) {
                var tempYear = valorActual.key.getFullYear();
                var retorno;
                if (valorAnterior[tempYear]) {
                    valorAnterior[tempYear].push(valorActual);
                } else {
                    valorAnterior[tempYear] = [valorActual];
                }
                return valorAnterior;
            }, {});
            anhos = Object.keys(dataSeries);

            // console.log("radialLineChart data: ", data);
            // console.log("dataSeries: ", dataSeries);
            outerRadius = Math.min((width - margin.right - margin.left), (height - margin.top - margin.bottom)) / 2 - 6;
            innerRadius = outerRadius / 2.5;

            xScale
                .range([0, fullCircle * anhos.length])
                .domain(d3.extent(data, xValue));

            yScale
                .range([innerRadius, outerRadius])
                .domain([0, d3.extent(data, yValue)[1] * 1.2])
                .nice();

            var format = ["%b", "%I %p", "%I %p", "%I %p"];
            var title = ["Mes", "Hora", "Hora", "Hora"];
            var subtitle = ["Día", "15 min", "30 min", "60 min"];
            var title_ = title[modo];
            var subtitle_ = subtitle[modo];
            var labelFormat = d3.timeFormat(format[modo]);
            var line = d3.lineRadial().angle(X).radius(Y);

            var svg = d3.select(this).selectAll("svg").data([data])
            var svgEnter = svg.enter()
                .append("svg")
                .attr("class", "radialLineChart");

            svgEnter.append("g").attr("class", "series");
            svgEnter.append("g").attr("class", "x axis");
            svgEnter.append("g").attr("class", "y axis");
            svgEnter.append("g").attr("class", "title").append("text");
            svgEnter.append("g").attr("class", "subtitle").append("text");

            svgEnter.selectAll('g')
                .attr("transform", "translate(" + ((width - margin.left - margin.right) / 2) + "," + ((height - margin.top - margin.bottom) / 2) + ")");

            g = svg.merge(svgEnter)
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

            // Make Y axis
            var yAxis_data = [yScale.domain()[0]]
            yAxis_data = yAxis_data.concat(yScale.ticks(4))
            // yAxis_data.push(yScale.domain()[1]);

            var yAxis = g.select(".y.axis")
                .attr("text-anchor", "middle");

            var yTick_circle = yAxis
                .selectAll("circle")
                .data(yAxis_data);
            yTick_circle.enter().append("circle")
                .merge(yTick_circle)
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("opacity", 0.2)
                .attr("r", yScale);
            yTick_circle.exit().remove();

            var yTick_text = yAxis
                .selectAll("text")
                .data(yAxis_data);
            yTick_text.enter().append("text")
                .merge(yTick_text)
                .style("font-size", 10)
                .attr("y", function (d) { return -yScale(d); })
                .attr("dy", "0.35em")
                .text(function (d) { return "" + d; });
            yTick_text.exit().remove();
            // End make Y axis

            series = g.selectAll(".series");
            ss = series.selectAll("path")
                .data(anhos);
            ss.enter()
                .append("path")
                .merge(ss)
                .attr("class", function (d) { return "serie" + d; })
                .attr("fill", "none")
                .attr("stroke", function (d) { return colours(d); })
                .attr("stroke-width", 1.5)
                .attr("opacity", opacity)
                .datum(function (d) { return dataSeries[d]; })
                .attr("d", line);
            ss.exit().remove();

            // Make X axis
            var xAxis = g.select(".x.axis")
                .attr("text-anchor", "middle");

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
                    return (((angle < Math.PI / 2) || ((Math.PI * 3 / 2) < angle)) ? "rotate(90)translate(0,22)" : "rotate(-90)translate(0, -15)");
                })
                .text(function (d) {
                    return labelFormat(d);
                })
                .style("font-size", 10)
                .attr("opacity", 0.6);
            // End make X axis

            var title = g.select(".title").select("text")
                .attr("dy", "-0.2em")
                .attr("text-anchor", "middle")
                .text(title_); //Title

            var subtitle = g.select(".subtitle").select("text")
                .attr("dy", "1em")
                .attr("text-anchor", "middle")
                .attr("opacity", 0.6)
                .text(subtitle_);  //Subtitle
        });
    }

    function X(d) { return xScale(xValue(d)); }
    function Y(d) { return yScale(yValue(d)); }

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

    chart.x = function (_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y = function (_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };

    return chart;
}