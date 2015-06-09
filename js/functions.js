$(window).scroll(function() {

  var wScroll = $(this).scrollTop();

  $('.fg-img-1').css({
    'background-position' : (50 + wScroll / 20) + '% ' + (100 - wScroll / 4) + '%'
  });
});
