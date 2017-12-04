'use strict';

(function () {
  var form = document.querySelector('.notice__form');
  var timein = form.querySelector('#timein');
  var timeout = form.querySelector('#timeout');
  var type = form.querySelector('#type');
  var price = form.querySelector('#price');
  var roomsNumber = form.querySelector('#room_number');
  var guestsNumber = form.querySelector('#capacity');
  var title = form.querySelector('#title');
  var minLength = parseInt(title.getAttribute('minlength'), 10);
  var inputError = {
    tooShort: 'Заголовок должен содержать минимум 30 символов',
    tooLong: 'Заголовок не должен содержать более 100 символов',
    noValue: 'Поле заголовка обязательно для заполнения'
  };

  if (!form.classList.contains('.notice__form--disabled')) {
    // синхронизируем время заезда/выезда
    timein.addEventListener('change', function () {
      timeout.value = timein.value;
    });

    timeout.addEventListener('change', function () {
      timein.value = timeout.value;
    });

    // выставляем минимальную цену в зависимости от выбранного типажилья
    type.addEventListener('change', function () {
      switch (type.value) {
        case 'flat':
          price.min = 1000;
          break;
        case 'bungalo':
          price.min = 0;
          break;
        case 'house':
          price.min = 5000;
          break;
        case 'palace':
          price.min = 10000;
          break;
        default:
          price.min = 0;
      }
    });
    // количество гостей по количеству комнат
    roomsNumber.addEventListener('change', function () {
      switch (roomsNumber.value) {
        case '1':
          guestsNumber.value = 1;
          break;
        case '2':
          guestsNumber.value = 2;
          break;
        case '3':
          guestsNumber.value = 3;
          break;
        case '100':
          guestsNumber.value = 0;
          break;
        default:
          guestsNumber.value = 1;
      }
    });

    title.addEventListener('invalid', function () {
      var validity = title.validity;
      if (validity.tooShort) {
        title.setCustomValidity(inputError.tooShort);
      } else if (validity.tooLong) {
        title.setCustomValidity(inputError.tooLong);
      } else if (validity.valueMissing) {
        title.setCustomValidity(inputError.noValue);
      } else {
        title.setCustomValidity('');
      }
    });

    title.addEventListener('input', function (evt) {
      var target = evt.target;
      if (target.value.length < minLength) {
        target.setCustomValidity(inputError.tooShort);
      } else {
        target.setCustomValidity('');
      }
    });
  }
})();
