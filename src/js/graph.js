nod.graph = function () {
  'use strict';

  var margin = {top: 0, bottom: 0, left: 0, right: 0}
    , directed = false
    , height = 1600
    , width = 900
    , colors = d3.scale.category20()
    , defaultR = 15
    , maxRadius = 50
    , maxLinkWeight = 20
    , rDistr = []
    , deg = []
    , lineWeight = []

    , autoR = true
  ;

  function preprocess (graph) {
    for (var i in graph.nodes) {
      var nd = graph.nodes[i];
      nd.links = [];
      autoR = nd.r ? false: true;
    }

    for (var i in graph.links) {
      var link = graph.links[i];
      graph.nodes[link.source].links.push(i);
      graph.nodes[link.target].links.push(i);
      lineWeight[i] = link.value;
    }

    for (var i in graph.nodes) {
      deg[i] = graph.nodes[i].links.length;
    }

    if (!autoR) {
      for (var i in graph.nodes) {
        rDistr[i] = graph.nodes[i].r;
      }
    }

    return graph;
  }

  function chart (selection) {
  	selection.each(function (graph) {
      var d = preprocess(graph);

      var rDomain = autoR ? deg : rDistr
      var r = d3.scale.linear()
          .domain(d3.extent(rDomain))
          .range([1, maxRadius])

      var lw = d3.scale.linear()
          .domain(d3.extent(lineWeight))
          .range([1, maxLinkWeight])

      var force = d3.layout.force()
          .nodes(graph.nodes)
          .links(graph.links)
          .linkDistance(200)
          .size([width, height])
          .charge(-200)
          .on("tick", tick)
          .start();

      // var marker = d3.select(this).append('defs').selectAll('.marker')
      //     .data(['killed', 'attempted'])
      //   .enter().append("marker")
      //     .attr('id', function(d) { return d; })
      //     .attr('refX', radius+10)
      //     .attr('refY', 5)
      //     .attr('markerWidth', 15)
      //     .attr('markerHeight', 15)
      //     .attr('orient', 'auto')
      //   .append('path')
      //     .attr('d', 'M0,0L10,5L0,10L3,5')

      // Not showing up
      // var icon = d3.select(this).select('defs').selectAll('.icon')
      //     .data(force.nodes())
      //   .enter().append('pattern')
      //     .attr('id', function (d) { return d.idty; })
      //     .attr('patternUnits', 'userSpaceOnUse')
      //     .append('image')
      //     .attr('xlink:href', function(d) { return d.img })
      //     .attr('x', 0)
      //     .attr('y', 0)
      //     .attr('width', radius)
      //     .attr('height', radius)

      var plot = d3.select(this).append('g')
          .attr('class', 'graph')
          .attr('transform', function (d, i) { return 'translate(' + margin.left + ',' + margin.top + ')'; });
   
      var link = plot.selectAll(".link")
          .data(force.links())
        .enter().append("line")
          .attr("class", "link")
          .style("stroke-width", function (d) { 
            return lw(Math.sqrt(d.value));
          })
          // .attr("marker-end", function (d) { return "url(#" + d.type + ")"; })

      var node = plot.selectAll(".node")
          .data(force.nodes())
        .enter().append("circle")
          .style('stroke', function (d, i) { return colors(d.color); })
          .style('stroke-width', 2)
          .style('fill', 'white')
          .attr("r", function (d) { 
            return d.r ? r(d.r) : r(d.links.length); 
          })
          .attr('id', function (d, i) { return 'node-' + i; })
          .attr('class', 'node')
          .attr('data-idty', function (d) { return d.idty;})
          .call(force.drag);

      var text = plot.selectAll("text")
          .data(force.nodes())
        .enter().append('a')
          .attr("xlink:href", function(d) { return d.url; })
          .append("text")
          .attr("x", function (d) { return r(d.links.length)+2;})
          .attr("y", ".31em")
          .style('display', 'none')
          .attr('id', function (d, i) { return 'text-' + i; })
          .attr('data-idty', function (d) { return d.idty;})
          .text(function(d) { return d.name; });

      function tick() {
        node.attr("transform", transform);
        text.attr("transform", transform);
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        force.stop();
        setTimeout(function () {
          force.start();
        }, 100);
      }

      function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
      }

      // animation
      var that = this;
      $(this).on('mouseenter', '.node', function (e) {
        // hide all
        $(that).find('text').hide();
        $(that).find('circle')
          .css('fill', 'white');

        var idx = $(this).attr('id').split('-')[1];
        var node = graph.nodes[idx];
        for (var _ in node.links) {
          var i = node.links[_];
          $('#text-'+graph.links[i].target.index).show();
          $('#node-'+graph.links[i].target.index)
            .css('fill', 'gray')

          $('#text-'+graph.links[i].source.index).show();
        }
      })
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

  chart.maxRadius = function (_) {
    if (!arguments.length) return maxRadius;
    maxRadius = _;
    return chart;
  }

  return chart;
};