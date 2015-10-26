(function() {

  if (document.querySelector(".form")) {

    var maxValueDays = 365;
    var maxValueTravellers = 10;


    // start change dates

    var form = document.querySelector(".form");

    var travelStart = document.getElementById("travel_start");
    var travelEnd = document.getElementById("travel_end");
    var travelDuration = document.getElementById("travel_duration");

    moment.locale("ru");

    function changeTravelEnd() {
      var start = picker.getMoment();
      var days = parseInt(travelDuration.value);
      travelEnd.value = start.add(days, "d").format("LL");
    }

    var picker = new Pikaday({
      field: travelStart,
      format: "LL",
      onSelect: changeTravelEnd
    });

    // end change dates


    // start field-range change

    function initNumberField(inputParent, wordForms, maxValue) {

      var input = inputParent.querySelector("input");
      var minus = inputParent.querySelector(".field-range__minus");
      var plus = inputParent.querySelector(".field-range__plus");

      // при фокусе оставляем только цифры
      input.addEventListener("focusin", function () {
        input.value = parseInt(input.value);
      });

      // возвращаем текстовое описание при focusout
      input.addEventListener("focusout", function () {
        var value = parseInt(input.value);

        if ((isNaN(value)) || (value <= 0)) {
          input.value = 1 + " " + wordForms[CheckNumber(1)];
          changeTravelEnd();
        }
        else {
          if (value > maxValue) {
            input.value = maxValue + " " + wordForms[CheckNumber(maxValue)];
            changeTravelEnd();
          }
          else {
            input.value = value + " " + wordForms[CheckNumber(value)];
            changeTravelEnd();
          }
        }
      });

      minus.addEventListener("click", function () {
        changeNumber(false);
      });

      plus.addEventListener("click", function () {
        changeNumber(true);
      });

      // выбор нужной формы слова
      function CheckNumber(number) {
        var b = number % 10;
        var a = (number % 100 - b) / 10;

        if (a == 0 || a >= 2) {
          if (b == 0 || (b > 4 && b <= 9)) {
            return 2;
          }
          else {
            if (b != 1) {
              return 1;
            }
            else {
              return 0;
            }
          }
        }
        else {
          return 2;
        }
      }

      // изменение числа при нажатии на кнопки + и -
      function changeNumber(operation) {
        var value = parseInt(input.value);

        if (isNaN(value)) {
          value = 0;
        }

        if (operation) {
          if (value >= maxValue) {
            input.value = maxValue + " " + wordForms[CheckNumber(maxValue)];
          }
          else {
            value = value + 1;
            input.value = value + " " + wordForms[CheckNumber(value)];
            changeTravelEnd();
          }
        }
        else {
          if (value > 1) {
            value = value - 1;
            input.value = value + " " + wordForms[CheckNumber(value)];
            changeTravelEnd();
          }
          else {
            input.value = 1 + " " + wordForms[CheckNumber(1)];
            changeTravelEnd();
          }
        }
      }
    }

    initNumberField(document.querySelector(".field-range--duration"), ["день", "дня", "дней"], maxValueDays);
    initNumberField(document.querySelector(".field-range--people"), ["чел", "чел", "чел"], maxValueTravellers);

    // end field-range change


    // start add and delete travellers

    var travellersArea = form.querySelector(".form__traveller");
    var travellersRange = form.querySelector(".field-range--people");
    var travellersTemplate = form.querySelector("#traveller-template").innerHTML;
    var travellersAmount = travellersRange.querySelector("input");
    var travellersCounter = parseInt(travellersAmount.value);
    var minus = travellersRange.querySelector(".field-range__minus");
    var plus = travellersRange.querySelector(".field-range__plus");

    // функция добавления
    function addTraveller(id){
      var counter = travellersArea.querySelectorAll(".form__traveller-info").length;
      var time = (new Date()).getTime();

      if (counter < maxValueTravellers) {
        var html = Mustache.render(travellersTemplate, {"id": time});
        var li = document.createElement("li");
        li.innerHTML = html;
        travellersArea.appendChild(li);

        // нажатие кнопки "удалить"
          li.querySelector(".form__traveller-delete").addEventListener("click", function (event) {
            event.preventDefault();
            deleteTraveller(li);
          });
      }
    }

    // функция удаления
    function deleteTraveller(li){
      var counter = travellersArea.querySelectorAll(".form__traveller-info").length;

      if (counter > 1) {
        queue = queue.filter(function (element) {
          return element.li != li;
        });
        li.parentNode.removeChild(li);
        travellersAmount.value = (parseInt(travellersAmount.value) - 1) + " чел";
      }
    }

    // начальное заполнение
    for (var i = 1; i <= travellersCounter; i++) {
      addTraveller(i);
    }

    // нажатие кнопки плюс
    plus.addEventListener("click", function (event) {
      event.preventDefault();
      var counter = parseInt(travellersAmount.value);
      addTraveller(counter);
    });

    // нажатие кнопки минус
    minus.addEventListener("click", function (event) {
      event.preventDefault();
      var counter = travellersArea.querySelectorAll(".form__traveller-info").length;

      if (counter > 1) {
        var li = travellersArea.lastChild;
        li.parentNode.removeChild(li);
      }
    });

    // end add and delete travellers


    // start send form

    if (!("FormData" in window) || !("FileReader" in window)) {
      return;
    }

    var area = form.querySelector(".form__gallery-list");

    var imageTemplate = document.querySelector("#image-template").innerHTML;
    var queue = [];

    var modalSuccess = document.querySelector(".modal--success");
    var modalFailure = document.querySelector(".modal--failure");
    var modalSuccessClose = modalSuccess.querySelector(".btn--send");
    var modalFailureClose = modalFailure.querySelector(".btn--failure");

    var userName = form.querySelector("[name='user_name']");
    var userSurname = form.querySelector("[name='user_surname']");
    var app = form.querySelector("[name='app']");
    var travellersNumber = form.querySelector("[name='travellers_number']");
    var images = form.querySelector("[name='images']");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var data = new FormData(form);

      queue.forEach(function (element) {
        data.append("images", element.file);
      });

      if (userName.value && userSurname.value && app.value && travelStart.value && travelDuration.value && travellersNumber.value) {
        modalSuccess.classList.remove("modal--show");
        modalSuccess.classList.add("modal--show");

        request(data, function (response) {
          console.log(response);
        });
      } else {
        modalFailure.classList.remove("modal--show");
        modalFailure.classList.add("modal--show");
      }
    });

    modalSuccessClose.addEventListener("click", function (event) {
      event.preventDefault();
      modalSuccess.classList.remove("modal--show");
    });

    modalFailureClose.addEventListener("click", function (event) {
      event.preventDefault();
      modalFailure.classList.remove("modal--show");
    });

    window.addEventListener("keydown", function (event) {
      if (event.keyCode == 27) {
        if (modalSuccess.classList.contains("modal--show")) {
          modalSuccess.classList.remove("modal--show");
        }
        if (modalFailure.classList.contains("modal--show")) {
          modalFailure.classList.remove("modal--show");
        }
      }
    });

    function request(data, fn) {
      var xhr = new XMLHttpRequest();
      var time = (new Date()).getTime();

      xhr.open("post", "https://echo.htmlacademy.ru/adaptive?" + time);
      xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState == 4) {
          fn(xhr.responseText);
        }
      });
      xhr.send(data);
    }

    form.querySelector("#upload_photo").addEventListener("change", function () {

      var files = this.files;

      for (var i = 0; i < files.length; i++) {
        preview(files[i]);
      }
      this.value = "";
    });

    function preview(file) {
      if (file.type.match(/image.*/)) {
        var reader = new FileReader();

        reader.addEventListener("load", function (event) {
          var html = Mustache.render(imageTemplate, {
            "image": event.target.result,
            "name": file.name
          });

          var li = document.createElement("li");
          li.classList.add("form__photo");
          li.innerHTML = html;
          area.appendChild(li);

          li.querySelector(".form__delete-photo").addEventListener("click", function (event) {
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
      queue = queue.filter(function (element) {
        return element.li != li;
      });
      li.parentNode.removeChild(li);
    }

    // end send form

  }
})();