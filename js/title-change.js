$(() => {
  const setTimeout = function setTimeout() {
    var pageTitle = $('title').text();
    $(window).blur(function () {
      $('title').text(`WAIT! COME BACK! ${pageTitle}`);
    });
    $(window).focus(function() {
      $('title').text(pageTitle);
    });
  };

  setTimeout();
});
