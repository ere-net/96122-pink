(function() {

// start menu show

  var menuList = document.querySelector(".main-nav__list");
  var toggler = document.querySelector(".main-nav__toggle");

  toggler.addEventListener("click", function(event) {
    event.preventDefault();
    toggler.classList.toggle("main-nav__toggle--close");
    menuList.classList.toggle("main-nav__list--show");
  });

// end menu show

})();