(function() {

// start of field-range change

  var elements = document.querySelectorAll(".field-range__inner");

  for (var i = 0; i < elements.length; i++) {
    initNumberField(elements[i]);
  }

  function initNumberField(parent) {
    var input = parent.querySelector("input");
    var minus = parent.querySelector(".field-range__minus");
    var plus = parent.querySelector(".field-range__plus");

    minus.addEventListener("click", function() {
      changeNumber(false);
    });

    plus.addEventListener("click", function() {
      changeNumber(true);
    });

    function changeNumber(operation) {
      var value = Number(input.value);

      if (isNaN(value)) {
        value = 0;
      }

      if (operation) {
        input.value = value + 1;
      } else {
        input.value = value - 1;
      }
    }
  }

// end of field-range change

})();