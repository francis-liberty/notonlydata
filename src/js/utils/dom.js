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