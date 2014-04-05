nod.pie = function (container) {
  'use strict';

  var margin = {top: 0, bottom: 0, left: 0, right: 0}
  	, height = 400
  	, width = 960
    , colors = d3.scale.category20()
    , container = container || 'body'

    // inferred
    , radius = Math.min(width, height) / 2;
  	;

  function preprocess (data) {
    return data;
  }

  var chart = chart || {};

  chart.draw = function (data) {
		var d = preprocess(data);

    var arc = d3.svg.arc()
		    .outerRadius(radius - 10)
		    .innerRadius(0);

		var pie = d3.layout.pie()
		    .sort(null)
		    .value(function(d) { return +d.value; });

		var plot = d3.select(container).append('svg')
				.attr('heigth', height)
				.attr('width', width)
        .append('g')
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	  var g = plot.selectAll(".arc")
	      .data(pie(d))
	    .enter().append("g")
	      .attr("class", "arc");

	  g.append("path")
	      .attr("d", arc)
	      .style("fill", function(d, i) { return colors(i); });

	  g.append("text")
	      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	      .attr("dy", ".35em")
	      .style("text-anchor", "middle")
	      .text(function(d) { return d.data.name; });
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