'use strict';

(function () {
  var ARROW_HEIGHT = 10;
  var LOCATION = {
    x: {
      min: 100,
      max: 1100
    },
    y: {
      min: 100,
      max: 500
    }
  };
  var PIN_ACTIVE_CLASSNAME = 'map__pin--active';
  var map = document.querySelector('.map');
  var pinsWrapper = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var form = document.querySelector('.notice__form');
  var formFieldsets = form.querySelectorAll('fieldset');
  var popup = document.querySelector('.popup');
  // переменные для drag'n'drop
  var pinHeight = mainPin.offsetHeight;

  var activePin;

  // дизейблим филдсеты
  changeFormAccessibility();
  // события на главном указателе (показываем карту)
  mainPin.addEventListener('mousedown', onMainPinClick);
  mainPin.addEventListener('keydown', onMainPinEnterPress);

  // события на главном указателе (drag'n'drop)
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    // если открыт попап - закрываем
    closePopup();
    // активируем пин
    activatePin(mainPin);
    // считаем сдвиг мышки относительно краев передвигаемого эл-та
    var mouseOffset = {
      x: evt.clientX - mainPin.offsetLeft,
      y: evt.clientY - mainPin.offsetTop
    };
    // создаем объект под координаты и передаем их в поле адреса
    var coordinate = {
      x: evt.clientX - mouseOffset.x,
      y: Math.round(evt.clientY - mouseOffset.y + pinHeight / 2 + ARROW_HEIGHT)
    };
    window.setAddress(coordinate.x, coordinate.y);
    // задаем обработчики
    pinsWrapper.addEventListener('mousemove', onMouseMove);
    pinsWrapper.addEventListener('mouseup', onMouseUp);

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      // дабы компенсировть слишком высокую планку в 100px, ставим координату Y в район самой верхней точки указателя
      var initialY = moveEvt.clientY - mouseOffset.y - pinHeight / 2;
      moveEvt.preventDefault();
      var initialX = moveEvt.clientX - mouseOffset.x;
      if (initialY > LOCATION.y.min && initialY < LOCATION.y.max && initialX > LOCATION.x.min && initialX < LOCATION.x.max) {
        // двигаем элемент следом за мышью
        mainPin.style.left = (moveEvt.clientX - mouseOffset.x) + 'px';
        mainPin.style.top = (moveEvt.clientY - mouseOffset.y) + 'px';
        // сразу передаем значения в поле адреса
        coordinate.x = parseInt(mainPin.style.left, 10);
        coordinate.y = Math.round(parseInt(mainPin.style.top, 10) + pinHeight / 2 + ARROW_HEIGHT);
        window.setAddress(coordinate.x, coordinate.y);
      }
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      pinsWrapper.removeEventListener('mousemove', onMouseMove);
      pinsWrapper.removeEventListener('mouseup', onMouseUp);
    }
  });

  // -----------------функции----------------------------

  /**
   * onMainPinClick - обработчик кликов на главном указателе
   *
   * @param {Event} evt
   */
  function onMainPinClick(evt) {
    evt.preventDefault();
    showMap();
  }

  /**
   * onMainPinEnterPress - обработчик нажатия клавиш на главном указателе
   *
   * @param {Event} evt
   */
  function onMainPinEnterPress(evt) {
    window.handlers.isEnterPressed(evt, showMap);
  }

  /**
   * showMap - показывает карту с указателями
   *
   */
  function showMap() {
    // удаляем обработчики с главного пина во избежании повторных срабатываний
    mainPin.removeEventListener('mousedown', onMainPinClick);
    mainPin.removeEventListener('keydown', onMainPinEnterPress);
    // показываем карту с пинами
    window.backend.load(window.renderMap, window.util.renderErrorPopup);
    // активируем карту и разблокируем форму
    map.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');
    changeFormAccessibility();
  }

  /**
   * showPopup - показывает попан и назначает стили текущему пину
   *
   * @param {Node} pin пин, на котором произошел клик
   * @param {ad} ad
   */
  function showPopup(pin, ad) {
    activatePin(pin);
    window.showCard(ad, popup, closePopup);
  }

  /**
   * activatePin - удаляет класс активности у текущего пина и добавляет его заданному пину(если указан)
   *
   * @param {Node} [pin]
   */
  function activatePin(pin) {
    if (activePin) {
      activePin.classList.remove(PIN_ACTIVE_CLASSNAME);
    }
    if (pin) {
      pin.classList.add(PIN_ACTIVE_CLASSNAME);
      activePin = pin;
    }
  }

  /**
   * closePopup - закрывает попап и убирает активный класс с указателя
   *
   */
  function closePopup() {
    // удаляем класс активности у активного пина и скрываем попап
    activatePin();
    popup.classList.add('hidden');
  }

  /**
 * changeFormAccessibility - переключает блокировку всех полей формы на обратную
 *
 */
  function changeFormAccessibility() {
    Array.from(formFieldsets).forEach(function (fieldset) {
      fieldset.disabled = !fieldset.disabled;
    });
  }

  window.map = {
    showPopup: showPopup
  };
})();
