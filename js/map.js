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
  var map = document.querySelector('.map');
  var pinsWrapper = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var form = document.querySelector('.notice__form');
  var formFieldsets = form.querySelectorAll('fieldset');
  var popup = document.querySelector('.popup');
  var popupClose = popup.querySelector('.popup__close');
  var currentPin = null;
  // переменные для drag'n'drop
  var mainPinHandle = map.querySelector('.map__pin--main img');
  var formAddress = form.querySelector('#address');
  var pinHeight = mainPin.offsetHeight;
  window.ads = [];

  // скрываем попап по умолчанию
  popup.classList.add('hidden');
  // дизейблим филдсеты
  changeFormAccessibility();
  // события на главном указателе (показываем карту)
  mainPin.addEventListener('mousedown', onMainPinClick);
  mainPin.addEventListener('keydown', onMainPinEnterPress);

  // события на главном указателе (drag'n'drop)
  mainPinHandle.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    if (currentPin) {
      currentPin.classList.remove('map__pin--active');
    }
    mainPin.classList.add('map__pin--active');
    currentPin = mainPin;
    // считаем сдвиг мышки относительно краев передвигаемого эл-та
    var mouseOffset = {
      x: evt.clientX - mainPin.offsetLeft,
      y: evt.clientY - mainPin.offsetTop
    };
    // задаем обработчики
    pinsWrapper.addEventListener('mousemove', onMouseMove);
    pinsWrapper.addEventListener('mouseup', onMouseUp);

    function onMouseMove(moveEvt) {
      // дабы компенсировть слишком высокую планку в 100px, ставим координату Y в район самой верхней точки указателя
      var initialY = moveEvt.clientY - mouseOffset.y - pinHeight / 2;
      moveEvt.preventDefault();
      var initialX = moveEvt.clientX - mouseOffset.x;
      if (initialY > LOCATION.y.min && initialY < LOCATION.y.max && initialX > LOCATION.x.min && initialX < LOCATION.x.max) {
        // двигаем элемент следом за мышью
        mainPin.style.left = (moveEvt.clientX - mouseOffset.x) + 'px';
        mainPin.style.top = (moveEvt.clientY - mouseOffset.y) + 'px';
        // сразу передаем значения в поле адреса
        formAddress.value = 'x: ' + parseInt(mainPin.style.left, 10) + ', y: ' + (parseInt(mainPin.style.top, 10) + pinHeight / 2 + ARROW_HEIGHT);
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
    // показываем пины и отслеживаем клики по карте
    window.backend.load(renderMap, window.util.renderErrorPopup);
    // активируем карту и разблокируем форму
    map.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');
    changeFormAccessibility();
  }

  /**
   * renderMap - при успешной загрузке данных с сервера заполняет данными пины и попапы на карте
   *
   * @param {Array} data
   */
  function renderMap(data) {
    window.ads = data;
    window.pin.render(window.ads);
  }

  /**
   *showPopup - показывает попан и назначает стили текущему пину
   *
   * @param {Event} evt
   * @param {number} index индекс объявления в массиве для привязки попапа к пину
   * @param {ad[]} arr
   */
  function showPopup(evt, index, arr) {
    var pin = evt.target.closest('.map__pin');
    if (currentPin) {
      currentPin.classList.remove('map__pin--active');
    }
    currentPin = pin;
    pin.classList.add('map__pin--active');
    window.showCard(arr[index], popup);
    popup.classList.remove('hidden');
    popupClose.addEventListener('click', onPopupCloseClick);
  }

  window.showPopup = showPopup;

  /**
   * changeFormAccessibility - переключает блокировку всех полей формы на обратную
   *
   */
  function changeFormAccessibility() {
    for (var i = 0; i < formFieldsets.length; i++) {
      formFieldsets[i].disabled = formFieldsets[i].disabled ? false : true;
    }
  }

  /**
   * closePopup - закрывает попап и убирает активный класс с указателя
   *
   */
  function closePopup() {
    if (currentPin !== mainPin) {
      currentPin.classList.remove('map__pin--active');
    }
    popup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
    popup.removeEventListener('click', onPopupCloseClick);
  }

  /**
   * onPopupCloseClick - обработчик события клика мыши на крестике попапа
   *
   */
  function onPopupCloseClick() {
    closePopup();
  }

  /**
   * onPopupEscPress - обработчик события нажатия клавиши при открытом попапе
   *
   * @param  {Event} evt
   */
  function onPopupEscPress(evt) {
    window.handlers.isEscPressed(evt, closePopup);
  }
})();
