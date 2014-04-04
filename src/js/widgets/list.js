nod.widgets.list = function (container) {
  'use strict';

  var margin = {top: 0, bottom: 0, left: 0, right: 0}
    , height = 1600
    , width = 900
    , colors = d3.scale.category20()
    , container = container || 'body'

    , data_list
  ;

  var chart = chart || {};

  function preprocess (data) {
    return data;
  }

  chart.draw = function (data) {
    var d = preprocess(data);

    var ul = nod_ul(data);

    $(container).append(ul);
  }

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = $.extend(margin, _);
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
  
  // var properties = ['width', 'height'];
  // for (var i in properties) { (function () {
  //   var property = properties[i];
  //   chart[property] = function (_) {
  //     if (!arguments.length) return eval(property);
  //     property = _;
  //     return chart;
  //   }
  // })();
  // }

  return chart;
};