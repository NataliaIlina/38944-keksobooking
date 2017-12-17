'use strict';

(function () {
  var DEFAULT_SRC = 'img/muffin.png';
  var TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];
  var TYPES = [
    'bungalo',
    'flat',
    'house',
    'palace'
  ];
  var MIN_PRICES = [0, 1000, 5000, 10000];
  var ROOMS = ['1', '2', '3', '100'];
  var GUESTS = ['1', '2', '3', '0'];

  var form = document.querySelector('.notice__form');
  var formInputs = form.querySelectorAll('input');
  var timein = form.querySelector('#timein');
  var timeout = form.querySelector('#timeout');
  var type = form.querySelector('#type');
  var price = form.querySelector('#price');
  var roomsNumber = form.querySelector('#room_number');
  var guestsNumber = form.querySelector('#capacity');
  var formAddress = form.querySelector('#address');
  var title = form.querySelector('#title');
  var minLength = parseInt(title.getAttribute('minlength'), 10);
  var inputError = {
    tooShort: 'Заголовок должен содержать минимум 30 символов',
    tooLong: 'Заголовок не должен содержать более 100 символов',
    noValue: 'Поле обязательно для заполнения',
    lowPrice: 'Указанная цена меньше минимальной',
    highPrice: 'Указанная цена не может быть больше ' + price.max,
    style: '2px solid red'
  };
  // переменные для drag'n'drop upload
  var avatarInput = form.querySelector('#avatar');
  var photoInput = form.querySelector('#images');
  var dropZoneAvatar = form.querySelector('.drop-zone');
  var dropZonePhoto = form.querySelector('.drop-zone:nth-child(2)');
  var avatarPreview = form.querySelector('.notice__preview img');
  var container = form.querySelector('.form__photo-container');
  var formImages = [];
  // задаем контейнеру стили для отображения загруженных фото
  container.style.width = 'auto';
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.querySelector('.upload').style.width = '140px';

  // при обновлении страницы синхронизируются поля комнаты/гости и тип/минимальная цена
  window.synchronizeFields(roomsNumber, guestsNumber, ROOMS, GUESTS, syncGuestsWithRooms);
  window.synchronizeFields(type, price, TYPES, MIN_PRICES, syncPriceWithType);

  if (!form.classList.contains('.notice__form--disabled')) {
    // синхронизируем время заезда/выезда
    timein.addEventListener('change', function () {
      window.synchronizeFields(timein, timeout, TIMES, TIMES, syncSelects);
    });

    timeout.addEventListener('change', function () {
      window.synchronizeFields(timeout, timein, TIMES, TIMES, syncSelects);
    });

    // выставляем минимальную цену в зависимости от выбранного типа жилья
    type.addEventListener('change', function () {
      window.synchronizeFields(type, price, TYPES, MIN_PRICES, syncPriceWithType);
    });

    // количество гостей по количеству комнат
    roomsNumber.addEventListener('change', function () {
      window.synchronizeFields(roomsNumber, guestsNumber, ROOMS, GUESTS, syncGuestsWithRooms);
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
        window.backend.save(new FormData(form), renderSuccessPopup, window.util.renderErrorPopup);
      }
    });
  }

  window.makeDroppable(dropZoneAvatar, avatarInput, function (files) {
    for (var i = 0; i < files.length; i++) {
      avatarPreview.setAttribute('src', URL.createObjectURL(files[i]));
    }
  });

  window.makeDroppable(dropZonePhoto, photoInput, function (files) {
    for (var i = 0; i < files.length; i++) {
      var image = document.createElement('img');
      image.style.width = '60px';
      image.style.height = '60px';
      image.style.margin = '5px';
      image.setAttribute('src', URL.createObjectURL(files[i]));
      container.appendChild(image);
      formImages.push(image);
    }
  });


  // ---------------- функции ----------------
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

  /**
   * renderSuccessPopup - отрисовывает попап с сообщением об успешной отправке данных
   *
   */
  function renderSuccessPopup() {
    window.util.createPopup('Данные успешно отправлены', '#1cb34d');
    form.reset();
    // после сброса формы выполняем синхронизацию и заполняем поле адреса
    window.synchronizeFields(roomsNumber, guestsNumber, ROOMS, GUESTS, syncGuestsWithRooms);
    window.synchronizeFields(type, price, TYPES, MIN_PRICES, syncPriceWithType);
    // картинки возвращаем в исходное состояние
    avatarPreview.setAttribute('src', DEFAULT_SRC);
    formImages.forEach(function (item) {
      item.remove();
    });
  }


  /**
   * setAddress - заносит значения координат главного пина в поле адреса
   *
   * @param {number} coordX
   * @param {number} coordY
   */
  function setAddress(coordX, coordY) {
    formAddress.setAttribute('value', 'x: ' + coordX + ', y: ' + coordY);
  }

  window.form = {
    setAddress: setAddress
  };
})();
