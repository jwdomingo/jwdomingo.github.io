$(window).scroll(function() {

  var wScroll = $(this).scrollTop();

  $('.fg-img-1').css({
    'transform' : 'translate(0px, ' + wScroll / 10 + '%)'
  });

  console.log(wScroll);
});

$( document ).ready(function() {

  //

});
