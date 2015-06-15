$(window).scroll(function() {

  var wScroll = $(this).scrollTop();
  var wHeight = $(this).height(),
      aboutHeight = $('#about-text.container').height();
      //
      // aboutTop = $('#about-text.container').position().top,
      // blurMin = headerHeight - 2.5 * aboutHeight + aboutTop,
      // blurMax = blurMin / 2 + headerHeight - $('.profile-img').position().top;

  // console.log('header height: ' + headerHeight);
  // console.log('about height: ' + aboutHeight);
  // console.log('profile top: ' + (headerHeight - $('.profile-img').position().top));
  // console.log('blurMin: ' + blurMin);
  // console.log('blurMax: ' + blurMax);
  // console.log(wScroll);

  // $('.fg-img-1').css({
  //   'background-position' : (50 + wScroll / 25) + '% ' + (100 - wScroll / 5.5) + '%'
  // });

  if (wScroll > wHeight) {
    $('header').css({'filter': 'blur(' + (wScroll / 100) + 'px)'});
    $('header').css({'-webkit-filter': 'blur(' + (wScroll / 250) + 'px)'});
    $('header').css({'-moz-filter': 'blur(' + (wScroll / 100) + 'px)'});
    $('header').css({'-ms-filter': 'blur(' + (wScroll / 100) + 'px)'});
    $('header').css({'-o-filter': 'blur(' + (wScroll / 100) + 'px)'});
  } else {
    $('header').css({'filter': 'blur(0px)'});
    $('header').css({'-webkit-filter': 'blur(0px)'});
    $('header').css({'-moz-filter': 'blur(0px)'});
    $('header').css({'-ms-filter': 'blur(0px)'});
    $('header').css({'-o-filter': 'blur(0px)'});
  }
});
