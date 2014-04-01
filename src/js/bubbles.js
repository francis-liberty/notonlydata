nod.bubbles = function () {
  'use strict';

  var maxRadius = 20
  	, lineHeight = 60
  	, margin = {top: 40, bottom: maxRadius, left: 80, right: maxRadius}
  	, xStep = 50
  	, height = 400
  	, width = 960
  	, fontSize = 10
    , max = null
    , n_Y = 0          // number of lines
    , x = []
    , n_X = 0         // number of cricles per line
    , header = []
    , colors = d3.scale.category20()
    , markers = []
  	;

  function preprocess (data) {
    var res = [];
    for (var i in data) {
      n_Y = n_Y + 1;

      var d = data[i];
      var line = {word: d.word};
      delete d.word;
      var count = [];
      for (var i in d) {
        var c = +d[i]
        count.push(c);
        max = !max ? c : max > c ? max : c;
      }
      line.count = count;
      res.push(line);
    }

    // xDomain
    for (var i in data[0]) {
      header.push(i);
    }
    n_X = header.length;
    x = d3.scale.ordinal()
      .domain(header)
      .rangePoints([0, width]);

    return res;
  }

  // the whole chart is a plot
  // board is the actual drawing area
  // each count is drawn in one line
  function chart (selection) {
  	selection.each(function (data) {
      var d = preprocess(data);

  		var plot = d3.select(this).append('g')

      // draw the actual content
  		var board = plot.append('g')
  				.attr('transform', function (d, i) { return 'translate(' + margin.left + ',' + margin.top + ')'; });

  		var line = board.selectAll('g')
  			  .data(d)
  			.enter().append('g')
  				.attr('transform', function (d, i) { return "translate(0," + i*lineHeight + ")" ; })

  		line.append('text')
  				.text(function (d) { return d.word; })
  				.attr('y', fontSize/2)
          .attr('x', -margin.left)

      var padding = width/n_X;
  		var count = line.selectAll('.count')
  			  .data(function (d) {
  			  	return d.count;
  			  })
  			.enter().append('circle')
  				.attr('cx', function (d, i) { return i*padding; })
  				.attr('r', function (d) { return d/max * maxRadius; })
          .style('fill', function (d, i) { return colors(i); })
          .style('opacity', 0.8)

      // draw x-axis
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom')
          .tickValues(markers)

      plot.append('g')
          .attr('class', 'x axis')
          .attr('transform', function (d, i) { return 'translate(' + margin.left + ', 0)';})
          .call(xAxis)
        .selectAll('.tick text')
          .style('text-anchor', 'start')
          .attr('x', 6)
          .attr('y', 6)
  	});
    
    return chart;
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

  chart.markers = function (_) {
    if (!arguments.length) return markers;
    markers = _;
    return chart;
  }

  return chart;
};