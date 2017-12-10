'use strict';

(function () {
  var ARROW_HEIGHT = 10;
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
  var minY = window.data.location.y.min;
  var maxY = window.data.location.y.max;
  var minX = window.data.location.x.min;
  var maxX = window.data.location.x.max;


  // отрисовываем пины на основе массива, получаем массив пинов
  // window.pin.render(window.data.ads);
  window.backend.load(window.pin.render);

  var pins = Array.prototype.slice.call(pinsWrapper.querySelectorAll('.map__pin'));
  // скрываем указатели по умолчанию
  pins.forEach(function (item) {
    if (item !== mainPin) {
      item.classList.add('hidden');
    }
  });
  // скрываем попап по умолчанию
  popup.classList.add('hidden');

  // дизейблим филдсеты
  disableForm();
  // события на главном указателе
  // drag'n'drop
  mainPinHandle.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    showMap();
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
      if (initialY > minY && initialY < maxY && initialX > minX && initialX < maxX) {
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

  mainPin.addEventListener('keydown', function (evt) {
    window.handlers.isEnterPressed(evt, showMap);
  });

  // -----------------функции----------------------------
  /**
   * disableForm - переключает блокировку всех полей формы на обратную
   *
   */
  function disableForm() {
    for (var i = 0; i < formFieldsets.length; i++) {
      formFieldsets[i].disabled = formFieldsets[i].disabled ? false : true;
    }
  }

  /**
   * showMap - показывает карту с указателями
   *
   */
  function showMap() {
    // активируем карту и разблокируем форму
    map.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');
    disableForm();
    // показываем указатели и ставим на них обработчик клика
    pins.forEach(function (item) {
      item.classList.remove('hidden');
    });
    map.addEventListener('click', onMapClick);
  }

  /**
   * onPinClick - обработчик события клика мыши на указателях
   *
   * @param  {Event} evt
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
        window.card.fill(item, popup);
      }
    });
    // показываем попап, задаем обработчики на события попапа
    popup.classList.remove('hidden');
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
    popup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
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
