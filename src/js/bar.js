nod.bar = function (container) {
  'use strict';

  var margin = {top: 0, bottom: 0, left: 0, right: 0}
  	, height = 400
  	, width = 960
    , colors = d3.scale.category20()
    , container = container || 'body'

    // inferred
  	;

  function preprocess (data) {
    return data;
  }

  var chart = chart || {};

  chart.draw = function (data) {
		var d = preprocess(data);

		var x = d3.scale.ordinal()
		    .rangeRoundBands([0, width-margin.left], .1);
    var y = d3.scale.linear()
		    .range([height, 0]);

    var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		    .ticks(10, "%");

		var plot = d3.select(container).append('svg')
				.attr('heigth', height)
				.attr('width', width)
        .append('g')
        .attr('transform', function (d, i) { return 'translate(' + margin.left + ',' + margin.top + ')'; });

    x.domain(data.map(function(d) { return d.x.split(' ')[0]; }));
	  y.domain([0, d3.max(data, function(d) { return +d.y; })]);

	  plot.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  plot.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", -margin.left+15)
	      // .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Frequency");

	  plot.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.x.split(' ')[0]); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.y); })
	      .attr("height", function(d) { return height - y(d.y); });
  }

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = $.extend(margin, _);
    return chart;
  }

  chart.width = function (_) {
		if (!arguments.length) return width;
		width = _;  
		radius = Math.min(width, height) / 2;
		return chart;
	}

  chart.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		radius = Math.min(width, height) / 2;
		return chart;
	}

  return chart;
}