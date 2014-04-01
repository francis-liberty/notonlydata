nod.graph = function () {
  'use strict';

  var margin = {top: 40, bottom: 20, left: 80, right: 20}
    , directed = false
    , height = 1600
    , width = 900
    , colors = d3.scale.category20()
    , radius = 15
  ;

  function preprocess (data) {
    // var res = [];
    // for (var i in data) {
    // }

    return data;
  }

  function chart (selection) {
  	selection.each(function (data) {
      var d = preprocess(data);

      var force = d3.layout.force()
          .nodes(data.nodes)
          .links(data.links)
          .linkDistance(200)
          .size([800, 600])
          .charge(-100)
          .on("tick", tick)
          .start();

      var marker = d3.select(this).append('defs').selectAll('.marker')
          .data(['killed', 'attempted'])
        .enter().append("marker")
          .attr('id', function(d) { return d; })
          .attr('refX', radius+10)
          .attr('refY', 5)
          .attr('markerWidth', 15)
          .attr('markerHeight', 15)
          .attr('orient', 'auto')
        .append('path')
          .attr('d', 'M0,0L10,5L0,10L3,5')

      var plot = d3.select(this).append('g')
          .attr('transform', function (d, i) { return 'translate(' + margin.left + ',' + margin.top + ')'; });
   
      var link = plot.selectAll(".link")
          .data(force.links())
        .enter().append("line")
          .attr("class", "link")
          .style("stroke-width", function (d) { return Math.sqrt(d.value); })
          .attr("marker-end", function (d) { return "url(#" + d.type + ")"; })

      var node = plot.selectAll(".node")
          .data(force.nodes())
        .enter().append("circle")
          .style('stroke', function (d, i) { return colors(d.color); })
          .style('fill', 'white')
          .attr("r", radius)
          .attr('id', function (d) { return 'node-' + d.idty; })
          .attr('class', 'node')
          .call(force.drag);

      var text = plot.selectAll(".text")
          .data(force.nodes())
        .enter().append("text")
          .attr("x", 8)
          .attr("y", ".31em")
          .attr('class', 'text hide')
          .attr('id', function (d) { return 'text-' + d.idty; })
          .text(function(d) { return d.name; });

      function tick() {
        node.attr("transform", transform);
        text.attr("transform", transform);
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
      }

      function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
      }

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

  return chart;
};