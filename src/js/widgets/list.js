nod.widgets.list = function () {
  'use strict';

  var margin = {top: 0, bottom: 0, left: 0, right: 0}
    , height = 1600
    , width = 900
    , colors = d3.scale.category20()
  ;

  function preprocess (data) {
    return data;
  }

  function chart (selection) {
  	selection.each(function (data) {
      var d = preprocess(data);

      var ul = document.createElement('ul');
      var $ul = $(ul);
      for (var i in data) {
        var li = document.createElement('li');
        $(li).append(document.createTextNode(data[i]))
             .attr('id', 'list-' + i);
        $ul.append(li);
      }
      $(this).append(ul);
		});
    return chart;
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

  return chart;
};