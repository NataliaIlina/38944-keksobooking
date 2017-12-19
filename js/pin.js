'use strict';

(function () {
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var MAX_PINS = 5;
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinTemplateImage = pinTemplate.querySelector('img');
  var pinHeight = pinTemplateImage.getAttribute('height');
  var pinsWrapper = document.querySelector('.map__pins');
  var popup = document.querySelector('.popup');

  var filters = document.querySelector('.map__filters');
  var typeFilter = filters.querySelector('#housing-type');
  var priceFilter = filters.querySelector('#housing-price');
  var roomsFilter = filters.querySelector('#housing-rooms');
  var guestsFilter = filters.querySelector('#housing-guests');
  var featuresFilter = filters.querySelector('#housing-features');

  var dataAds = [];
  var pins = [];

  // блок с фильтрами - рендерим подходящие пины при изменении настроек
  filters.addEventListener('change', function () {
    window.util.debounce(updatePins);
  });

  /**
   * updatePins - рендерит новые пины, соответствующие значениям аргументов
   *
   * @param {*} type тип жилья
   * @param {*} guests кол-во гостей
   * @param {*} rooms кол-во комнат
   * @param {*} price цена
   * @param {Array} features список удобств
   */
  function updatePins() {
    // получаем значения из формы
    var type = typeFilter.value;
    var price = priceFilter.value;
    var roomsNumber = roomsFilter.value;
    var guestsNumber = guestsFilter.value;
    // создаем массив из значений отмеченных чекбоксов
    var features = Array.from(featuresFilter.querySelectorAll('input[type=checkbox]:checked')).map(function (item) {
      return item.value;
    });

    // удаляем пины и скрываем попап
    pins.forEach(function (pin) {
      pin.remove();
    });
    popup.classList.add('hidden');
    // массив, с которым будем работать, на старте равен dataAds
    var currentAds = dataAds;
    // фильтруем массивы
    currentAds = currentAds.filter(function (ad) {
      return isAny(type) ? ad.offer.type : ad.offer.type === type;
    });
    currentAds = currentAds.filter(function (ad) {
      return isAny(guestsNumber) ? ad.offer.guests : ad.offer.guests === parseInt(guestsNumber, 10);
    });
    currentAds = currentAds.filter(function (ad) {
      return isAny(roomsNumber) ? ad.offer.rooms : ad.offer.rooms === parseInt(roomsNumber, 10);
    });

    currentAds = currentAds.filter(function (ad) {
      var result;
      switch (price) {
        case 'low':
          result = ad.offer.price < LOW_PRICE;
          break;
        case 'middle':
          result = (ad.offer.price >= LOW_PRICE && ad.offer.price <= HIGH_PRICE);
          break;
        case 'high':
          result = ad.offer.price > HIGH_PRICE;
          break;
      }
      return isAny(price) ? ad.offer.price : result;
    });

    if (features.length > 0) {
      currentAds = currentAds.filter(function (ad) {
        return features.every(function (item) {
          return ad.offer.features.indexOf(item) !== -1;
        });
      });
    }

    renderPins(currentAds);
  }

  /**
   * isAny - возвращает истинность соответствия параметра функции значению 'any'
   *
   * @param {string} value
   * @return {boolean}
   */
  function isAny(value) {
    return value === 'any';
  }


  /**
   * createPin - возвращает объект, заполненный данными из объявления
   *
   * @param  {ad} ad
   * @return {Node} скопированный с шаблона элемент с данными
   */
  function createPin(ad) {
    var clonePin = pinTemplate.cloneNode(true);
    clonePin.style.left = (ad.location['x']) + 'px';
    clonePin.style.top = (ad.location['y'] + parseInt(pinHeight, 10)) + 'px';
    clonePin.querySelector('img').setAttribute('src', ad.author.avatar);
    // вешаем обработчик клика на пин, который показывает попап
    clonePin.addEventListener('click', function (evt) {
      var pin = evt.target.closest('.map__pin');
      window.map.showPopup(pin, ad);
    });
    return clonePin;
  }

  /**
   * renderPins - отрисовывает пины на основе данных из массива
   *
   * @param {ad[]} ads массив объявлений
   */
  function renderPins(ads) {
    var fragment = document.createDocumentFragment();
    ads = ads.length > MAX_PINS ? ads.slice(0, MAX_PINS) : ads;
    ads.forEach(function (item) {
      var pin = createPin(item);
      fragment.appendChild(pin);
      pins.push(pin);
    });
    pinsWrapper.appendChild(fragment);
  }

  /**
   * объект объявления
   * @typedef {Object} ad
   */

  /**
   * renderMap - при успешной загрузке данных с сервера заполняет данными пины и попапы на карте
   *
   * @param {ad[]} data
   */
  function renderMap(data) {
    dataAds = data;
    renderPins(dataAds);
  }

  window.renderMap = renderMap;
})();
