nod.bundle = function (container) {
  'use strict';

	var margin = 120
	  , height = 1600
	  , width = 900
    , container = container || 'body'

    // inferred
    , diameter = Math.min(width, height)
    , radius =  diameter / 2
		, innerRadius = radius - margin
		, map
	  ;

  var chart = chart || {};


  function preprocess (data) {
		map = {};
  	data.groups.forEach(function (g) {
  		g.group = g.name;
  		map[g.name] = data.nodes.length;
  		data.nodes.push(g);
  	});

    return data;
  }

	chart.draw = function (data) {
		var gr = preprocess(data);

		var cluster = d3.layout.cluster()
		    .size([360, innerRadius])
		    .sort(null)
		    // .value(function(d) { return d.size; });

		var nodes =  cluster.nodes(clusterNodes(gr.nodes)),
				links = clusterLinks(gr.links, nodes);

		var bundle = d3.layout.bundle();

		var line = d3.svg.line.radial()
		    .interpolate("bundle")
		    .tension(.85)
		    .radius(function(d) { return d.y; })
		    .angle(function(d) { return d.x / 180 * Math.PI; });

		var plot = d3.select(container).append("svg")
		    .attr("width", diameter)
		    .attr("height", diameter)
		  .append("g")
		    .attr("transform", "translate(" + radius + "," + radius + ")");

		var link = plot.append("g").selectAll(".link")
				.data(bundle(links))
	    .enter().append("path")
	      .attr("class", "link")
	      .attr("d", line);

    var	node = plot.append("g").selectAll(".node")
	      .data(nodes.filter(function(n) { return !n.children; }))
	    .enter().append("text")
	      .attr("class", "node")
	      .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
	      .attr("dy", ".31em")
	      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")" + (d.x < 180 ? "" : "rotate(180)"); })
	      .style("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
	      .text(function(d) { return d.name; })
      // .on("mouseover", mouseovered)
      // .on("mouseout", mouseouted);
	}

	function clusterNodes (nodes) {		
  	nodes.forEach(function (nd) {
  	  nd.parent = nodes[map[nd.group]];
  		if (!nd.parent) { 
  			nd.parent = nd; 
  		}
  		if (!nd.parent.children) { 
  			nd.parent.children = []; 
  		}
  		nd.parent.children.push(nd);
  	});
	}

	function clusterLinks (links, nodes) {
  	links.forEach(function (l) {
  		l.target = nodes[l.target];
  		l.source = nodes[l.source];
  	});
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