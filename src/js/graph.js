nod.graph = function () {
  'use strict';

  var margin = {top: 40, bottom: maxRadius, left: 80, right: maxRadius}
    , directed = false
  ;

  function preprocess (data) {
    var res = [];
    for (var i in data) {
      
    }

    return res;
  }

  function chart (selection) {
  	selection.each(function (data) {
      var d = preprocess(data);

  		var plot = d3.select(this).append('g')

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