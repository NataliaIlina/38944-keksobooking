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
  var minPrices = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var inputError = {
    tooShort: 'Заголовок должен содержать минимум 30 символов',
    tooLong: 'Заголовок не должен содержать более 100 символов',
    noValue: 'Поле обязательно для заполнения',
    lowPrice: 'Минимально возможная цена для выбранного типа жилья: ' + minPrices[type.value],
    highPrice: 'Указанная цена не может быть больше ' + price.max,
    style: '2px solid red'
  };

  // при обновлении страницы синхронизируются поля комнаты/гости и тип/минимальная цена
  syncGuestsWithRooms();
  syncPriceWithType();

  if (!form.classList.contains('.notice__form--disabled')) {
    // синхронизируем время заезда/выезда
    timein.addEventListener('change', function () {
      syncTimes(timein, timeout);
    });
    timeout.addEventListener('change', function () {
      syncTimes(timeout, timein);
    });
    // выставляем минимальную цену в зависимости от выбранного типа жилья
    type.addEventListener('change', function () {
      syncPriceWithType();
    });
    // количество гостей по количеству комнат
    roomsNumber.addEventListener('change', function () {
      syncGuestsWithRooms();
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
      if (!title.value) {
        setErrorStyle(title);
      } else if (!address.value) {
        setErrorStyle(address);
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

  /**
   * syncTimes - синхронизирует значение второго элемента с первым
   *
   * @param {Node} firstTime первый элемент
   * @param {Node} secondTime второй элемент
   */
  function syncTimes(firstTime, secondTime) {
    secondTime.value = firstTime.value;
  }

  /**
   * syncPriceWithType - синхронизирует значение минимальной цены с типом жилья
   *
   */
  function syncPriceWithType() {
    price.min = minPrices[type.value];
  }

  /**
   * syncGuestsWithRooms - синхронизирует кол-во гостей с кол-вом комнат
   *
   */
  function syncGuestsWithRooms() {
    for (var i = 0; i < guestsNumber.options.length; i++) {
      guestsNumber.options[i].disabled = true;
    }

    if (roomsNumber.value === '100') {
      guestsNumber.options[3].disabled = false;
    } else if (roomsNumber.value === '1') {
      guestsNumber.options[2].disabled = false;
    } else if (roomsNumber.value === '2') {
      guestsNumber.options[1].disabled = false;
      guestsNumber.options[2].disabled = false;
    } else if (roomsNumber.value === '3') {
      guestsNumber.options[0].disabled = false;
      guestsNumber.options[1].disabled = false;
      guestsNumber.options[2].disabled = false;
    }

    guestsNumber.value = roomsNumber.value === '100' ? '0' : roomsNumber.value;
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
