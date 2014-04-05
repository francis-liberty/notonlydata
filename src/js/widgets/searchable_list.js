nod.widgets.searchable_list = function (container) {
  'use strict';

  var margin = {top: 0, bottom: 0, left: 0, right: 0}
    , height = 1600
    , width = 900
    , colors = d3.scale.category20()
    , container = container || 'body'

    , box = $(document.createElement('div'))
    , data_list = []
  ;

  var chart = chart || {};

  function preprocess (data) {
    return data;
  }

  chart.draw = function (data) {
    var d = preprocess(data);
    data_list = d;

    $(box).attr('class', 'list');
    var searchBox = nod_search_box()
		$(searchBox).css('width', width);
    var ul = nod_ul(data);
    $(ul).css('height', height)
    		 .css('width', width);

    $(box).append(searchBox)
    		  .append(ul);
    $(container).append(box);

  //   // animation
		$(searchBox).on('keyup', 'input[type=text]', function () {
			search($(this).val().toLowerCase());
		});
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

	function search(query) {
		$(box).find('li').hide();
		for (var i in data_list) {
			if (data_list[i]['name'].toLowerCase().search(query) != -1) {
				$(box).find('#list-'+i).show();
			}
		}
	}

  return chart;
};