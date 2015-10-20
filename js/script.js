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

// start send form

  if (!("FormData" in window) || !("FileReader" in window)) {
    return;
  }

  var form = document.querySelector(".form");
  var area = form.querySelector(".form__gallery-list");

  var template = document.querySelector("#image-template").innerHTML;
  var queue = [];

  var modal_success = document.querySelector(".modal--success");
  var modal_failure = document.querySelector(".modal--failure");

  var modal_success_close = modal_success.querySelector(".btn");
  var modal_failure_close = modal_failure.querySelector(".btn");

  var user_name = form.querySelector("[name='user_name']");
  var user_surname = form.querySelector("[name='user_surname']");
  var app = form.querySelector("[name='app']");
  var travel_start = form.querySelector("[name='travel_start']");
  var travel_duration = form.querySelector("[name='travel_duration']");
  var travellers_number = form.querySelector("[name='travellers_number']");
  var traveller_name1 = form.querySelector("[name='traveller_name1']");
  //var images = form.querySelector("[name='images']");


  form.addEventListener("submit", function(event) {
    event.preventDefault();

    var data = new FormData(form);

    queue.forEach(function(element) {
      data.append("images", element.file);
    });

    if (user_name.value && user_surname.value && app.value && travel_start.value && travel_duration.value && travellers_number.value && traveller_name1.value ) {
      modal_success.classList.remove("modal--show");
      modal_success.classList.add("modal--show");

      request(data, function(response) {
        console.log(response);
      });
    } else {
      modal_failure.classList.remove("modal--show");
      modal_failure.classList.add("modal--show");
    }

  });

  modal_success_close.addEventListener("click", function(event) {
    event.preventDefault();
    modal_success.classList.remove("modal--show");
  });

  modal_failure_close.addEventListener("click", function(event) {
    event.preventDefault();
    modal_failure.classList.remove("modal--show");
  });

  window.addEventListener("keydown", function(event) {
    if (event.keyCode == 27) {
      if (modal_success.classList.contains("modal--show")) {
        modal_success.classList.remove("modal--show");
      }
      if (modal_failure.classList.contains("modal--show")) {
        modal_failure.classList.remove("modal--show");
      }
    }
  });

  function request(data, fn) {
    var xhr = new XMLHttpRequest();
    var time = (new Date()).getTime();

    xhr.open("post", "https://echo.htmlacademy.ru/adaptive?" + time);
    xhr.addEventListener("readystatechange", function() {
      if (xhr.readyState == 4) {
        fn(xhr.responseText);
      }
    });
    xhr.send(data);
  }

  form.querySelector("#upload_photo").addEventListener("change", function() {

    var files = this.files;

    for (var i = 0; i < files.length; i++) {
      preview(files[i]);
    }
    this.value = "";
  });

  function preview(file) {
    if (file.type.match(/image.*/)) {
      var reader = new FileReader();

      reader.addEventListener("load", function(event) {
        var html = template.replace("{{image}}", event.target.result);
        html = html.replace("{{name}}", file.name);
        html = html.replace("{{name}}", file.name);
        html = html.replace("{{name}}", file.name);

        var li = document.createElement("li");
        li.classList.add("form__photo");
        li.innerHTML = html;
        area.appendChild(li);

        li.querySelector(".form__delete-photo").addEventListener("click", function(event) {
            event.preventDefault();
            removePreview(li);
          });

        queue.push({
          "file": file,
          "li": li
        });
      });
      reader.readAsDataURL(file);
    }
  }

  function removePreview(li) {
    queue = queue.filter(function(element) {
      return element.li != li;
    });
    li.parentNode.removeChild(li);
  }

// end send form

})();