'use strict';

(function () {
  var form = document.querySelector('.notice__form');
  var formInputs = form.querySelectorAll('input');
  var address = form.querySelector('#address');
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
    noValue: 'Поле заголовка обязательно для заполнения',
    style: '2px solid red'
  };

  if (!form.classList.contains('.notice__form--disabled')) {
    // синхронизируем время заезда/выезда
    timein.addEventListener('change', onTimeinChange);
    timeout.addEventListener('change', onTimeoutChange);

    // выставляем минимальную цену в зависимости от выбранного типажилья
    type.addEventListener('change', onTypeChange);
    // количество гостей по количеству комнат
    roomsNumber.addEventListener('change', onRoomsNumberChange);
    // ставим сообщения для поля заголовка
    title.addEventListener('invalid', onTitleInvalid);
    // проверяем форму при отправке
    form.addEventListener('submit', function (evt) {
      evt.preventDefault();
      for (var i = 0; i < formInputs.length; i++) {
        setErrorStyle(formInputs[i], true);
      }
      if (!title.value) {
        setErrorStyle(title);
      } else if (!address.value) {
        setErrorStyle(address);
      } else if (guestsNumber.value > roomsNumber.value) {
        setErrorStyle(guestsNumber);
      } else if (price.value < price.min) {
        setErrorStyle(price);
      } else {
        form.submit();
      }
    });
  }

  /**
   * setErrorStyle - устанавливает/обнуляет стиль для поля с ошибкой
   *
   * @param  {Object} field  поле, с которым работаем
   * @param  {boolean} [remove] если указано - обнуляем стиль
   */
  function setErrorStyle(field, remove) {
    if (remove) {
      field.style.outline = '';
    } else {
      field.style.outline = inputError.style;
    }
  }

  // обработчики событий изменения полей формы
  function onTimeinChange() {
    timeout.value = timein.value;
  }

  function onTimeoutChange() {
    timein.value = timeout.value;
  }

  function onTypeChange() {
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
  }

  function onRoomsNumberChange() {
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
  }

  function onTitleInvalid() {
    var validity = title.validity;
    var error = '';
    if (validity.tooShort || (title.value.length !== 0 && title.value.length < minLength)) {
      error = inputError.tooShort;
      setErrorStyle(title);
    } else if (validity.tooLong) {
      error = inputError.tooLong;
      setErrorStyle(title);
    } else if (validity.valueMissing) {
      error = inputError.noValue;
      setErrorStyle(title);
    } else {
      error = '';
      title.style.outline = '';
    }
    title.setCustomValidity(error);
  }
})();
