$.ajax({
  url: 'http://johndomingo.com/webdevchallenge/feed.xml',
  dataType: 'xml',
  success: function(data) {
    console.log('success!');
    $(data).find('channel item').each(function (i) {
      var title = $(this).find('title').text();
      var description = $(this).find('description').text();
      var link = $(this).find('link').text();
      var challenge = $(this).attr('challenge');
      var project = $(this).attr('project');
      var theme = $(this).attr('theme');
      var labels = [];
      var sources = [];

      $('#webdevchallenge .challenge' + challenge).append(
          '<div class=\'project\'>' +
          '<a href=\'' + link + '\'><h3>' + title + '</h3></a>' +
          '<h6>Challenge ' + challenge + ' - Project ' + project + ' | <a href=\'http://johndomingo.com/webdevchallenge\'>' + theme + '</a></h6>' +
          '<p>' + description + '</p>' +
          '</div>'
        ); //append link element
      }); // each channel item
  },
  error: function() {
    console.log("Error in xml feed from webdevchallenge");
  }
});
