'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var form = document.querySelector('.notice__form');
  var formFieldsets = form.querySelectorAll('fieldset');
  var popupElement = document.querySelector('.popup');
  var popupClose = popupElement.querySelector('.popup__close');
  var currentPin = null;

  // скрываем указатели по умолчанию
  window.pin.pins.forEach(function (item) {
    if (item !== mainPin) {
      item.classList.add('hidden');
    }
  });
  // скрываем попап по умолчанию
  popupElement.classList.add('hidden');

  // дизейблим филдсеты
  for (var i = 0; i < formFieldsets.length; i++) {
    formFieldsets[i].disabled = true;
  }

  // события на главном указателе
  mainPin.addEventListener('mouseup', function () {
    showMap();
  });

  mainPin.addEventListener('keydown', function (evt) {
    window.handlers.isEnterPressed(evt, showMap);
  });

  /**
   * showMap - показывает карту с указателями
   *
   */
  function showMap() {
    // активируем карту и разблокируем форму
    map.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');
    for (i = 0; i < formFieldsets.length; i++) {
      formFieldsets[i].disabled = false;
    }
    // показываем указатели и ставим на них обработчик клика
    window.pin.pins.forEach(function (item) {
      item.classList.remove('hidden');
    });
    map.addEventListener('click', onMapClick);
  }

  /**
   * onPinClick - обработчик события клика мыши на указателях
   *
   * @param  {Event} evt event
   */
  function onMapClick(evt) {
    // если уже есть активный пин -удаляем у него класс активности
    // если клик попал на потомков пина, помещаем его в переменную и добавляем класс
    var pin = evt.target.closest('.map__pin');
    if (pin) {
      if (currentPin) {
        currentPin.classList.remove('map__pin--active');
      }
      currentPin = pin;
      currentPin.classList.add('map__pin--active');
    }
    // по атрибуту src в картинке находим нужный нам объект объявления и заполняем попап
    var src = currentPin.children[0].getAttribute('src');
    window.data.ads.forEach(function (item) {
      if (item.author.avatar === src.toString()) {
        window.card.fillCard(item, popupElement);
      }
    });
    // показываем попап, задаем обработчики на события попапа
    popupElement.classList.remove('hidden');
    // кликаем на главный пин или крестик -закрываем поппап
    if (currentPin === mainPin || event.target === popupClose) {
      closePopup();
    }
    // закрываем попап по esc
    document.addEventListener('keydown', onPopupEscPress);
  }

  /**
   * closePopup - закрывает попап и убирает активный класс с указателя
   *
   */
  function closePopup() {
    if (currentPin !== mainPin) {
      currentPin.classList.remove('map__pin--active');
    }
    popupElement.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  }

  /**
   * onPopupEscPress - обработчик события нажатия клавиши при открытом попапе
   *
   * @param  {Event} evt event
   */
  function onPopupEscPress(evt) {
    window.handlers.isEscPressed(evt, closePopup);
  }
})();
