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

      // $('#webdevchallenge .container ul').append(
      //   $('<li />', {
      //     text: title
      //   })
      // );

      $('#webdevchallenge .challenge' + (i + 1)).append(
          "<a href='" + link + "'><h3>" + title + '</h3></a>',
          '<h6> Challenge ' + challenge + ' - Project ' + project + " | <a href='http://johndomingo.com/webdevchallenge'>" + theme + '</a>',
          '<p>' + description + '</p>'
        ); //append link element
      }); // each channel item
  },
  error: function() {
    console.log("Error in xml feed from webdevchallenge");
  }
});


// $(function(){
//     url = 'http://www.thetutlage.com/rss.xml';
//     $.ajax({
//       type: "GET",
//       url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=?&q=' + encodeURIComponent(url),
//       dataType: 'json',
//       error: function(){
//           alert('Unable to load feed, Incorrect path or invalid feed');
//       },
//       success: function(xml){
//           values = xml.responseData.feed.entries;
//           console.log(values);
//       }
//     });
// });
