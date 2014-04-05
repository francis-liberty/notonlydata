function nod_ul(d) {
  'use strict';

  var ul = document.createElement('ul');
  var $ul = $(ul);
  for (var i in d) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    $(a).attr('href', d[i].url ? d[i].url : '#')
        .attr('target', '_blank')
        .append(document.createTextNode(d[i].name))
    $(li).attr('id', 'list-' + i)
         .append(a);
    $ul.append(li);
  }

  return ul;
}

function nod_search_box() {
  'use strict';


  var form = document.createElement('form');
  $(form)
  		.attr('class', 'search-box')
      .append('<input type="text" name="query">')
      .append('<input type="button" value="Search">');
  return form;
}