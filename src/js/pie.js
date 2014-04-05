nod.pie = function (container) {
  'use strict';

  var margin = 10
  	, height = 400
  	, width = 960
    , colors = d3.scale.category20()
    , container = container || 'body'
    , showText = true

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
		    .outerRadius(radius - margin)
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
	      .attr("class", "arc")
	      .attr('id', function (d, i) { return 'bar-'+i; });

	  g.append("path")
	      .attr("d", arc)
	      .style("fill", function(d, i) { return colors(i); });

	  g.append("text")
	  		.attr('id', function (d, i) { return 'text-'+i; })
	      .attr("transform", function(d) {
	      	return "translate(" + arc.centroid(d).map(function (d) { return d*2; }) + ")"; 
	      })
	      .attr("dy", ".35em")
	      .style('display', function () { return showText ? 'block' : 'none'; })
	      .style("text-anchor", "middle")
	      .text(function(d) { return d.data.name; });
  }

  chart.highlightBar = function (bar_id) {
  	$(container).find('.arc').css('opacity', 0.3);
  	$(container).find('#bar-'+bar_id).css('opacity', 1);
  	$(container).find('#text-'+bar_id).show();
  }

  chart.restore = function (bar_id) {
  	// $(container).find('.arc').show();
  	$(container).find('.arc').css('opacity', 1);
  	$(container).find('text').hide();
  }

  chart.margin = function (_) {
		if (!arguments.length) return margin;
		margin = _;
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

  chart.showText = function (_) {
		if (!arguments.length) return showText;
		showText = _;
		return chart;
	}

  return chart;
}