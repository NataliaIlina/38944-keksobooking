'use strict';

(function () {
  var form = document.querySelector('.notice__form');
  var formInputs = form.querySelectorAll('input');
  var timein = form.querySelector('#timein');
  var timeout = form.querySelector('#timeout');
  var type = form.querySelector('#type');
  var price = form.querySelector('#price');
  var roomsNumber = form.querySelector('#room_number');
  var guestsNumber = form.querySelector('#capacity');
  var title = form.querySelector('#title');
  var minLength = parseInt(title.getAttribute('minlength'), 10);
  var types = [
    'bungalo',
    'flat',
    'house',
    'palace'
  ];
  var minPrices = [0, 1000, 5000, 10000];
  var rooms = ['1', '2', '3', '100'];
  var guests = ['1', '2', '3', '0'];
  var inputError = {
    tooShort: 'Заголовок должен содержать минимум 30 символов',
    tooLong: 'Заголовок не должен содержать более 100 символов',
    noValue: 'Поле обязательно для заполнения',
    lowPrice: 'Указанная цена меньше минимальной',
    highPrice: 'Указанная цена не может быть больше ' + price.max,
    style: '2px solid red'
  };

  // при обновлении страницы синхронизируются поля комнаты/гости и тип/минимальная цена
  window.synchronizeFields(roomsNumber, guestsNumber, rooms, guests, syncGuestsWithRooms);
  window.synchronizeFields(type, price, types, minPrices, syncPriceWithType);

  if (!form.classList.contains('.notice__form--disabled')) {
    // синхронизируем время заезда/выезда
    timein.addEventListener('change', function () {
      window.synchronizeFields(timein, timeout, window.data.times, window.data.times, syncSelects);
    });

    timeout.addEventListener('change', function () {
      window.synchronizeFields(timeout, timein, window.data.times, window.data.times, syncSelects);
    });

    // выставляем минимальную цену в зависимости от выбранного типа жилья
    type.addEventListener('change', function () {
      window.synchronizeFields(type, price, types, minPrices, syncPriceWithType);
    });

    // количество гостей по количеству комнат
    roomsNumber.addEventListener('change', function () {
      window.synchronizeFields(roomsNumber, guestsNumber, rooms, guests, syncGuestsWithRooms);
    });

    // ставим сообщения для поля заголовка
    title.addEventListener('input', onTitleInput);
    price.addEventListener('input', onPriceInput);

    // проверяем форму при отправке
    form.addEventListener('submit', function (evt) {
      evt.preventDefault();
      for (var i = 0; i < formInputs.length; i++) {
        setErrorStyle(formInputs[i], true);
      }
      if (!title.validity.valid) {
        setErrorStyle(title);
      } else if (!price.validity.valid) {
        setErrorStyle(price);
      } else {
        window.backend.save(new FormData(form), window.util.renderSuccessPopup, window.util.renderErrorPopup);
      }
    });
  }

  /**
   * syncSelects - задает полю указанное значение value
   *
   * @param {Node} element
   * @param {string} value
   */
  function syncSelects(element, value) {
    element.value = value;
  }

  /**
   * syncPriceWithType - задает полю указанное значение min
   *
   * @param {Node} element
   * @param {number} value
   */
  function syncPriceWithType(element, value) {
    element.min = value;
  }

  /**
   * syncGuestsWithRooms - синхронизирует кол-во гостей с кол-вом комнат
   *
   * @param {Node} guestsElement
   * @param {string} guestsValue
   */
  function syncGuestsWithRooms(guestsElement, guestsValue) {
    guestsElement.value = guestsValue;
    // получаем текущее значение кол-ва гостей
    var currentValue = guestsElement.value;

    for (var i = 0; i < guestsElement.options.length; i++) {
      // дизейблим все
      guestsElement.options[i].disabled = true;
      // если текущее значение 0, оставляем доступным только его
      if (currentValue === '0') {
        if (guestsElement.options[i].value === currentValue) {
          guestsElement.options[i].disabled = false;
        }
      } else {
        // в противном случае делаем доступными все значения меньше текущего и не равные 0
        if (guestsElement.options[i].value <= currentValue && guestsElement.options[i].value !== '0') {
          guestsElement.options[i].disabled = false;
        }
      }
    }
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

  /**
   * onTitleInput - показывает пользователю сообщения при невалидном значении поля title
   *
   */
  function onTitleInput() {
    var error = '';

    if (!title.validity.valid) {
      setErrorStyle(title);
    }

    if (title.validity.tooShort || (title.value.length !== 0 && title.value.length < minLength)) {
      error = inputError.tooShort;
    } else if (title.validity.tooLong) {
      error = inputError.tooLong;
    } else if (title.validity.valueMissing) {
      error = inputError.noValue;
    } else {
      error = '';
      setErrorStyle(title, true);
    }

    title.setCustomValidity(error);
  }

  /**
   * onPriceInput - показывает пользователю сообщения при невалидном значении поля price
   *
   */
  function onPriceInput() {
    var error = '';

    if (!price.validity.valid) {
      setErrorStyle(price);
    }

    if (price.validity.rangeUnderflow) {
      error = inputError.lowPrice;
    } else if (price.validity.rangeOverflow) {
      error = inputError.highPrice;
    } else if (price.validity.valueMissing) {
      error = inputError.noValue;
    } else {
      error = '';
      setErrorStyle(price, true);
    }

    price.setCustomValidity(error);
  }
})();
