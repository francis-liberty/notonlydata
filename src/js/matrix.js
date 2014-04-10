nod.matrix = function (container) {
  'use strict';

  var margin = {top: 60, bottom: 0, left: 60, right: 0}
  	, height = 720
  	, width = 720
    , colors = d3.scale.category20()

    , container = container || 'body'
    , x = d3.scale.ordinal().rangeBands([0, width])
    , z = d3.scale.linear().domain([0, 4]).clamp(true)
  	;

  var chart = chart || {};

  function preprocess (data) {
    return data;
  }

  chart.draw = function (data) {
    var d = preprocess(data);

    var matrix = [],
        nodes = data.nodes,
        n = nodes.length;

    // Compute index per node.
    var groups = d3.set();
    nodes.forEach(function(node, i) {
      node.index = i;
      node.count = 0;
      matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
      groups.add(node.group);
    });
    colors.domain(groups);

    // Convert links to matrix; count character occurrences.
    data.links.forEach(function(link) {
      matrix[link.source][link.target].z += link.value;
      matrix[link.target][link.source].z += link.value;
      matrix[link.source][link.source].z += link.value;
      matrix[link.target][link.target].z += link.value;
      nodes[link.source].count += link.value;
      nodes[link.target].count += link.value;
    });

    // Precompute the orders.
    var orders = {
      name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
      count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
      group: d3.range(n).sort(function(a, b) { return nodes[b].group - nodes[a].group; })
    };

    // The default sort order.
    x.domain(orders.name);

    var plot = d3.select(container).append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        // .style("margin-left", -margin.left + "px");
    
    // draw the actual content
    var board = plot.append('g')
        .attr("class", "matrix")
        .attr('transform', function (d, i) { return 'translate(' + margin.left + ',' + margin.top + ')'; });

    board.append("rect")
        .attr("width", width)
        .style('fill', '#B7B7B7')
        .attr("height", height);

    var row = board.selectAll(".row")
        .data(matrix)
      .enter().append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
        .each(row);

    row.append("line")
        .attr("x2", width);

    row.append("text")
      .attr("x", -6)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function(d, i) { return nodes[i].name; });

    var column = board.selectAll(".column")
        .data(matrix)
      .enter().append("g")
        .attr("class", "column")
        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

    column.append("line")
        .attr("x1", -width);

    column.append("text")
        .attr("x", 6)
        .attr("y", x.rangeBand() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .text(function(d, i) { return nodes[i].name; });

    function row(row) {
      var cell = d3.select(this).selectAll(".cell")
          .data(row.filter(function(d) { return d.z > 10; }))
        .enter().append("rect")
          .attr("class", "cell")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", x.rangeBand())
          .attr("height", x.rangeBand())
          .style("fill-opacity", function(d) { return z(d.z); })
          .style("fill", function(d) { return nodes[d.x].group == nodes[d.y].group ? colors(nodes[d.x].group) : null; })
          .on("mouseover", mouseover)
          .on("mouseout", mouseout);
    }

    function mouseover(p) {
      d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
      d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
    }

    function mouseout() {
      d3.selectAll("text").classed("active", false);
    }

    d3.select("#order").on("change", function() {
      clearTimeout(timeout);
      order(this.value);
    });

    function order(value) {
      x.domain(orders[value]);

      var t = board.transition().duration(2500);

      t.selectAll(".row")
          .delay(function(d, i) { return x(i) * 4; })
          .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
        .selectAll(".cell")
          .delay(function(d) { return x(d.x) * 4; })
          .attr("x", function(d) { return x(d.x); });

      t.selectAll(".column")
          .delay(function(d, i) { return x(i) * 4; })
          .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
    }

    var timeout = setTimeout(function() {
      order("group");
      d3.select("#order").property("selectedIndex", 2).node().focus();
    }, 5000);
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