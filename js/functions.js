$(window).scroll(function() {

  var wScroll = $(this).scrollTop();
      wHeight = $(this).height(),
      sectionTop = wHeight + $('section h1').position().top;

  console.log(wScroll);

  $('.fg-img-1').css({
    'background-position' : (50 + wScroll / 25) + '% ' + (100 - wScroll / 5.5) + '%'
  });

  if (wScroll > sectionTop) {
    $('header').css({'filter': 'blur(' + (wScroll / 250) + 'px)'});
    $('header').css({'-webkit-filter': 'blur(' + (wScroll / 250) + 'px)'});
    $('header').css({'-moz-filter': 'blur(' + (wScroll / 250) + 'px)'});
    $('header').css({'-ms-filter': 'blur(' + (wScroll / 250) + 'px)'});
    $('header').css({'-o-filter': 'blur(' + (wScroll / 250) + 'px)'});
  } else {
    $('header').css({'filter': 'blur(0px)'});
    $('header').css({'-webkit-filter': 'blur(0px)'});
    $('header').css({'-moz-filter': 'blur(0px)'});
    $('header').css({'-ms-filter': 'blur(0px)'});
    $('header').css({'-o-filter': 'blur(0px)'});
  }
});
