/* global d3 */

function radialLineChart() {

    // document.body.style.zoom = 0.80
    var margin = { top: 0, bottom: 0, right: 0, left: 0 },
        modo = 0,
        width = 100,
        height = 100,
        innerRadius = 100,
        title = "T",
        subtitle = "S",
        outerRadius = Math.min((width - margin.right - margin.left), (height - margin.top - margin.bottom)) / 2 - 6,
        fullCircle = 2 * Math.PI;

    var xValue = function (d) { return d[0]; };
    var yValue = function (d) { return d[1]; };

    xScale = d3.scaleTime();
    yScale = d3.scaleRadial();

    var opacity = 0.5;

    var colours = d3.scaleOrdinal(d3.schemeCategory10);
    var parseDate = d3.timeParse("%Y-%m-%d");

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

            xScale_domain = [];
            switch (modo) {
                case 0: // Año
                    xScale_domain = [
                        parseDate("" + anhos[0] + "-01-01"),
                        parseDate("" + anhos[anhos.length - 1] + "-12-31")
                    ];
                    break;
                case 1: // Día
                    xScale_domain = [
                        parseDate("" + anhos[0] + "-01-01"),
                        parseDate("" + anhos[0] + "-01-02")
                        // parseDate("" + anhos[anhos.length - 1] + "-01-02")
                    ];
                    break;
                default:
                    ;
            }

            // xScale_domain = [
            //     parseDate("" + anhos[0] + "-01-01"),
            //     parseDate("" + anhos[anhos.length - 1] + "-12-31")
            // ];

            xScale
                .range([0, fullCircle * anhos.length])
                .domain(xScale_domain);
            // .domain(d3.extent(data, xValue));

            yScale
                .range([innerRadius, outerRadius])
                .domain([0, d3.extent(data, yValue)[1] * 1.2])
                .nice();

            var format = ["%b", "%I %p", "%I %p", "%I %p"];
            // var title = ["Mes", "Hora", "Hora", "Hora"];
            // var subtitle = ["Día", "15 min", "30 min", "60 min"];
            var xScale_tick_data = [
                [
                    parseDate("" + anhos[0] + "-01-01"),
                    parseDate("" + anhos[0] + "-02-01"),
                    parseDate("" + anhos[0] + "-03-01"),
                    parseDate("" + anhos[0] + "-04-01"),
                    parseDate("" + anhos[0] + "-05-01"),
                    parseDate("" + anhos[0] + "-06-01"),
                    parseDate("" + anhos[0] + "-07-01"),
                    parseDate("" + anhos[0] + "-08-01"),
                    parseDate("" + anhos[0] + "-09-01"),
                    parseDate("" + anhos[0] + "-10-01"),
                    parseDate("" + anhos[0] + "-11-01"),
                    parseDate("" + anhos[0] + "-12-01")
                ],
                [
                    parseDate("" + anhos[0] + "-01-01"),
                    parseDate("" + anhos[0] + "-02-01"),
                    parseDate("" + anhos[0] + "-03-01"),
                    parseDate("" + anhos[0] + "-04-01"),
                    parseDate("" + anhos[0] + "-05-01"),
                    parseDate("" + anhos[0] + "-06-01"),
                    parseDate("" + anhos[0] + "-07-01"),
                    parseDate("" + anhos[0] + "-08-01"),
                    parseDate("" + anhos[0] + "-09-01"),
                    parseDate("" + anhos[0] + "-10-01"),
                    parseDate("" + anhos[0] + "-11-01"),
                    parseDate("" + anhos[0] + "-12-01")
                ],
                []
            ];

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
            // xScale_data = xScale.ticks(1);
            xScale_data = xScale_tick_data[modo];
            var xAxis = g.select(".x.axis")
                .attr("text-anchor", "middle");

            var xTick1 = xAxis
                .selectAll("g")
                .data(xScale_data);
            var xTick = xTick1.enter().append("g")
                .merge(xTick1)
                .attr("text-anchor", "middle")
                // .attr("transform", function (d) {
                //     return "rotate(" + ((xScale(d)) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
                // });
                .attr("transform", function (d) {
                    return "rotate(" + ((xScale(d)) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
                });
            xTick1.exit().remove();

            var xTick_line = xAxis
                .selectAll("line")
                .data(xScale_data);
            xTick_line.enter().append("line")
                .merge(xTick_line)
                .attr("x2", -10)
                .attr("stroke", "#000")
                .attr("transform", function (d) {
                    return "rotate(" + ((xScale(d)) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
                });
            xTick_line.exit().remove();

            var xTick_text = xAxis
                .selectAll("text")
                .data(xScale_data);
            xTick_text.enter().append("text")
                .merge(xTick_text)
                .attr("transform", function (d) {
                    var angle = xScale(d);
                    return (((angle < Math.PI / 2) || ((Math.PI * 3 / 2) < angle)) ? "rotate(90)translate(0,22)" : "rotate(-90)translate(0, -15)");
                })
                .text(function (d) {
                    return labelFormat(d);
                })
                .style("font-size", 10)
                .attr("opacity", 0.6)
                .attr("text-anchor", "end")
                .attr("transform", function (d) {
                    return "rotate(" + ((xScale(d)) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
                });

            // .attr("transform", function (d) {
            // var angle = xScale(d);
            // return ((angle < Math.PI / 2) || (angle > (Math.PI * 3 / 2))) ? "rotate(90)translate(0,22)" : "rotate(-90)translate(0, -15)";
            // });
            xTick_text.exit().remove();
            // End make X axis

            var _title = g.select(".title").select("text")
                .attr("dy", "-0.2em")
                .attr("text-anchor", "middle")
                .text(title); //Title

            var _subtitle = g.select(".subtitle").select("text")
                .attr("dy", "1em")
                .attr("text-anchor", "middle")
                .attr("opacity", 0.6)
                .text(subtitle);  //Subtitle
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

    chart.title = function (_) {
        if (!arguments.length) return title;
        title = _;
        return chart;
    };

    chart.subtitle = function (_) {
        if (!arguments.length) return subtitle;
        subtitle = _;
        return chart;
    };

    return chart;
}