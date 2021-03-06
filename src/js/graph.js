nod.graph = function (container) {
  'use strict';

  var margin = {top: 0, bottom: 0, left: 0, right: 0}
	  , directed = false
	  , height = 1600
	  , width = 900
	  , colors = d3.scale.category20()
	  , maxRadius = 50
	  , maxLinkWeight = 20
    , container = container || 'body'

	  // force
	  , force_layout = {linkDistance: 200, charge: -200}

	  // these are implicitly, automatically inferred
	  , autoR = true
	  , rDistr = []
	  , deg = []
	  , lineWeight = []

    // internal variables
    , gr
  ;

  var chart = chart || {};

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

  chart.draw = function (graph) {
    gr = graph;
  	var d = preprocess(gr);

  	// auto infer
    var rDomain = autoR ? deg : rDistr
    var r = d3.scale.linear()
        .domain(d3.extent(rDomain))
        .range([1, maxRadius])

    var lw = d3.scale.linear()
        .domain(d3.extent(lineWeight))
        .range([1, maxLinkWeight])

    var force = d3.layout.force()
        .nodes(gr.nodes)
        .links(gr.links)
        .linkDistance(force_layout.linkDistance)
        .size([width, height])
        .charge(force_layout.charge)
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

    var plot = d3.select(container).append('svg')
        .append('g')
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
        .attr("target", '_blank')
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
  }

  chart.highlightNode = function (node_id) {
    $(container).find('text').hide();
    $(container).find('circle').css('fill', 'white');

    var nd = gr.nodes[node_id];
    for (var _ in nd.links) {
      var i = nd.links[_];
      $('#text-'+gr.links[i].target.index).show();
      $('#node-'+gr.links[i].target.index).css('fill', 'gray')

      $('#text-'+gr.links[i].source.index).show();
    }
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

  chart.maxLinkWeight = function (_) {
    if (!arguments.length) return maxLinkWeight;
    maxLinkWeight = _;
    return chart;
  }

  chart.force_layout = function (_) {
    if (!arguments.length) return force_layout;
    force_layout = $.extend(force_layout, _);
    return chart;
  }

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = $.extend(margin, _);
    return chart;
  }

  return chart;
};