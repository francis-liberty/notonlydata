nod.scatter = function (container) {
  'use strict';

  var margin = {top: 50, bottom: 0, left: 50, right: 0}
  	, height = 400
  	, width = 960
  	, fontSize = 10
    , colors = d3.scale.category20()
    , markers = []
    , yLabel = 'y'
    , xLabel = 'x'

    , container = container || 'body'
    , xDomain = []
    , wordMap = {}
  	;

  var chart = chart || {};

  function preprocess (data) {
    var words = d3.set();
    data.forEach(function(d) {
      words.add(d.word);
    });
    var i = 0;
    words.forEach(function (w) {
      wordMap[w] = i;
      i = i+1;
    })
    return data;
  }

  chart.draw = function (data) {
    var d = preprocess(data);

    var x = d3.scale.ordinal()
        .domain(xDomain)
        .rangePoints([0, width]);

    var y = d3.scale.linear()
        .domain(d3.extent(data, function (d){ return d.y; }))
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickValues(markers);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var plot = d3.select(container).append('svg');
    
    // draw the actual content
    var board = plot.append('g')
        .attr('transform', function (d, i) { return 'translate(' + margin.left + ',' + margin.top + ')'; });

    board.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 16)
        .style("text-anchor", "end")
        .text(xLabel);

    board.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yLabel);

    board.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
        .style("fill", function(d) { return colors(d.word); });

    var legend = plot.selectAll(".legend")
        .data(colors.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colors);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

  }

  chart.width = function (_) {
		if (!arguments.length) return width;
		width = _;  
		return chart;
	}

  chart.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	}

  chart.yLabel = function (_) {
    if (!arguments.length) return yLabel;
    yLabel = _;
    return chart;
  }

  chart.xLabel = function (_) {
    if (!arguments.length) return xLabel;
    xLabel = _;
    return chart;
  }

  chart.xDomain = function (_) {
    if (!arguments.length) return xDomain;
    xDomain = _;
    return chart;
  }

  chart.markers = function (_) {
    if (!arguments.length) return markers;
    markers = _;
    return chart;
  }
  
  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = $.extend(margin, _);
    return chart;
  }

  return chart;
};