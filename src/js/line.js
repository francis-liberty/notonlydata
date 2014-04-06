nod.line = function (container) {
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
  	;

  var chart = chart || {};

  function preprocess (data) {
    data.forEach(function (d) {
      xDomain.push(d.x);
    });
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

    var line = d3.svg.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

    var plot = d3.select(container).append('svg');
    
    // draw the actual content
    var board = plot.append('g')
        .attr('transform', function (d, i) { return 'translate(' + margin.left + ',' + margin.top + ')'; });

    board.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    board.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yLabel);

    board.append("path")
        .datum(d)
        .attr("class", "line")
        .attr("d", line);
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

  chart.markers = function (_) {
    if (!arguments.length) return markers;
    markers = _;
    return chart;
  }

  return chart;
};