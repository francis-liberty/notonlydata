nod.bubbles = function () {
  'use strict';

  var maxRadius = 20
  	, minRadius = 2
  	, lineHeight = 60
  	, padding = 4
  	, margin = {top: maxRadius, bottom: maxRadius, left: maxRadius, right: maxRadius}
  	, xStep = 50
  	, height = 400
  	, width = 960
  	, fontSize = 10
  	;

  function chart (selection) {
  	selection.each(function (data) {
  		var plot = d3.select(this).append('g')

  		var board = plot.append('g')
  				.attr('transform', function (d, i) { return 'translate(' + margin.left + ',' + margin.top + ')'; });

  		var line = board.selectAll('g')
  			  .data(data)
  			.enter().append('g')
  				.attr('transform', function (d, i) { return "translate(0," + i*lineHeight + ")" ; })

  		line.append('text')
  				.text(function (d) { return d.word; })
  				.attr('y', fontSize/2)

  		var count = line.selectAll('.count')
  			  .data(function (d) {
  			  	return d.count;
  			  })
  			.enter().append('circle')
  				.attr('cx', function (d, i) { return i*padding; })
  				.attr('r', function (d) { return d; })
  	})
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

  return chart;
};