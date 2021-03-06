$.ajax({
  url: 'https://johndomingo.com/webdevchallenge/feed.xml',
  dataType: 'xml',
  success: function(data) {
    $(data).find('channel item').each(function (i) {
      var title = $(this).find('title').text();
      var description = $(this).find('description').text();
      var link = $(this).find('link').text();
      var thumb = $(this).find('thumb').text();
      var challenge = $(this).attr('challenge');
      var project = $(this).attr('project');
      var theme = $(this).attr('theme');
      var labels = [];
      var sources = [];

      $('#webdevchallenge .challenge' + challenge + ' .slider ul').append(
        '<li ' +
            'class=\'project\' ' +
            'style=\"background-image: ' +
              'url(\'http://johndomingo.com/webdevchallenge/assets/' + thumb + '/thumb.jpg\');\">' +

          '<div class=\'content\'>' +
            '<a href=\'' + link + '\'><h3>' + title + '</h3></a>' +

            '<h6>Challenge ' + challenge + ' - Project ' + project +
              ' | <a href=\'http://johndomingo.com/webdevchallenge\'>' + theme + '</a>' +
            '</h6>' +

            '<p>' + description + '</p>' +
          '</div>' +
        '</li>'
      ); //append link element
    }); // each channel item
  },
  error: function() {
    console.log("Error loading XML feed from webdevchallenge");
  }
});
