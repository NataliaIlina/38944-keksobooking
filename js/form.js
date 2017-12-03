'use strict';

(function () {
  var form = document.querySelector('.notice__form');
  var timein = form.querySelector('#timein');
  var timeout = form.querySelector('#timeout');
  var type = form.querySelector('#type');
  var price = form.querySelector('#price');
  var rooms = form.querySelector('#room_number');
  var guests = form.querySelector('#capacity');
  var title = form.querySelector('#title');

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
  rooms.addEventListener('change', function () {
    switch (rooms.value) {
      case '1':
        guests.value = 1;
        break;
      case '2':
        guests.value = 2;
        break;
      case '3':
        guests.value = 3;
        break;
      case '100':
        guests.value = 0;
        break;
      default:
        guests.value = 1;
    }
  });

  title.addEventListener('input', function () {
    if (title.value.length === 0) {
      title.setCustomValidity('Поле заголовка обязательно для заполнения');
    } else if (title.value.length < 30) {
      title.setCustomValidity('Заголовок должен содержать минимум 30 символов');
    } else {
      title.setCustomValidity('');
    }
  });
})();
