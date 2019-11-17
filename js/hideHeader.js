$(document).ready(function() {
  // Hide Header on on scroll down
  var didScroll;
  var lastScrollTop = 0;
  var delta = 1;
  var navbarHeight = $('header').outerHeight();

  $('body').scroll(function(event) {
    didScroll = true;
  });

  setInterval(function() {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    var st = $('body').scrollTop();

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
      return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
      // Scroll Down
      $('header').fadeOut()
    } else {
      // Scroll Up
      if(st + $(window).height() < $(document).height()) {
        $('header').fadeIn()
      }
    }

    lastScrollTop = st;
  }
})
