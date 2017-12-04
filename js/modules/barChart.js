/* global d3 */

function barChart(selection) {
  var
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 400,
    height = 400,
    innerWidth = width - margin.left - margin.right,
    innerHeight = height - margin.top - margin.bottom,
    xValue = function (d) { return d[0]; },
    yValue = function (d) { return d[1]; },
    xScale = d3.scaleBand().padding(0.1),
    yScale = d3.scaleLinear(),   
    onMouseOver = function () { },
    onMouseOut = function () { },
    onMouseClick = function(){ };
    
  function chart(selection) {
    selection.each(function (data) {
      // console.log("data barChartModule", data);
      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var svgEnter = svg.enter().append("svg")
        .attr("class", "barchart");

      var gEnter = svgEnter.append("g");
      gEnter.append("g").attr("class", "x axis");
      gEnter.append("g").attr("class", "y axis");

      // Update the outer dimensions.
      svg.merge(svgEnter)
        .attr("width", width)
        .attr("height", height);

      // Update the inner dimensions.
      var g = svg.merge(svgEnter).select("g")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      xScale.rangeRound([0, innerWidth])
        .domain(data.map(function (d) { return xValue(d); }));
      yScale.rangeRound([innerHeight, 0])
        .domain([0, d3.max(data, function (d) { return yValue(d); })]);

      g.select(".x.axis")
        .attr("transform", "translate(0," + innerHeight + ")")
        .call(d3.axisBottom(xScale));

      g.select(".y.axis")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

      var bars = g.selectAll(".bar")
        .data(function (d) { return d; });

      bars.enter().append("rect")
        .attr("class", "bar")
        .merge(bars)
        .attr("x", X)
        .attr("y", Y)
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return innerHeight - Y(d); })
        //.attr("class","clicked")       
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut)
        .on("click", onMouseClick);
        
      bars.exit().remove();
    });

  }

  // The x-accessor for the path generator; xScale o xValue.
  function X(d) {
    return xScale(xValue(d));
  }

  // The y-accessor for the path generator; yScale o yValue.
  function Y(d) {
    return yScale(yValue(d));
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

  chart.y = function (_) {
    if (!arguments.length) return yValue;
    yValue = _;
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
    
  chart.onMouseClick = function (_) {
    if (!arguments.length) return onMouseClick;
    onMouseClick = _;
    return chart;
  };

  return chart;
}