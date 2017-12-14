'use strict';

(function () {
  var INTERVAL = 500;
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
  var currentTimeout;

  // блок с фильтрами - рендерим подходящие пины при изменении настроек
  filters.addEventListener('change', function () {
    var type = typeFilter.value;
    var price = priceFilter.value;
    var rooms = roomsFilter.value;
    var guests = guestsFilter.value;
    var features = Array.from(featuresFilter.querySelectorAll('input[type=checkbox]:checked')).map(function (item) {
      return item.value;
    });

    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
    currentTimeout = setTimeout(function () {
      updatePins(type, guests, rooms, price, features);
    }, INTERVAL);

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
  function updatePins(type, guests, rooms, price, features) {
    // удаляем пины и скрываем попап
    pins.forEach(function (pin) {
      pin.remove();
    });
    popup.classList.add('hidden');
    // массив, с которым будем работать, на старте равен dataAds
    var newArr = dataAds;
    // фильтруем массивы
    newArr = newArr.filter(function (ad) {
      return isAny(type) ? ad.offer.type : ad.offer.type === type;
    });
    newArr = newArr.filter(function (ad) {
      return isAny(guests) ? ad.offer.guests : ad.offer.guests === parseInt(guests, 10);
    });
    newArr = newArr.filter(function (ad) {
      return isAny(rooms) ? ad.offer.rooms : ad.offer.rooms === parseInt(rooms, 10);
    });

    newArr = newArr.filter(function (ad) {
      var result;
      switch (price) {
        case 'low':
          result = ad.offer.price < 10000;
          break;
        case 'middle':
          result = (ad.offer.price >= 10000 && ad.offer.price <= 50000);
          break;
        case 'high':
          result = ad.offer.price > 50000;
          break;
      }
      return isAny(price) ? ad.offer.price : result;
    });

    if (features.length > 0) {
      newArr = newArr.filter(function (ad) {
        return features.every(function (item) {
          return ad.offer.features.indexOf(item) !== -1;
        });
      });
    }

    renderPins(newArr);
  }

  /**
   * isAny - возвращает истинность соответствия параметра функции значению 'any'
   *
   * @param {*} value
   * @return {boolean}
   */
  function isAny(value) {
    return value === 'any';
  }


  /**
   * createPin - возвращает объект, заполненный данными из массива
   *
   * @param  {ad} ad
   * @param  {number} index порядковый номер объявления
   * @param  {ad[]} ads
   * @return {Node} скопированный с шаблона элемент с данными
   */
  function createPin(ad, index, ads) {
    var cloneElement = pinTemplate.cloneNode(true);
    cloneElement.style.left = (ad.location['x']) + 'px';
    cloneElement.style.top = (ad.location['y'] + parseInt(pinHeight, 10)) + 'px';
    cloneElement.querySelector('img').setAttribute('src', ad.author.avatar);
    cloneElement.addEventListener('click', function (evt) {
      window.showPopup(evt, index, ads);
    });
    return cloneElement;
  }

  /**
   * renderPins - отрисовывает пины на основе данных из массива
   *
   * @param {ad[]} ads массив объявлений
   */
  function renderPins(ads) {
    var fragment = document.createDocumentFragment();
    ads.forEach(function (item, index, arr) {
      var pin = createPin(item, index, arr);
      fragment.appendChild(pin);
      pins.push(pin);
    });
    pinsWrapper.appendChild(fragment);
  }

  /**
   * renderMap - при успешной загрузке данных с сервера заполняет данными пины и попапы на карте
   *
   * @param {Array} data
   */
  function renderMap(data) {
    dataAds = data;
    renderPins(dataAds);
  }

  window.pin = {
    renderMap: renderMap
  };
})();
