$(window).scroll(function() {

  var wScroll = $(this).scrollTop();

  $('.fg-img-1').css({
    'background-position' : (50 + wScroll / 25) + '% ' + (100 - wScroll / 5.5) + '%'
  });
});
