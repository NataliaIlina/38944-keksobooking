'use strict';

(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinTemplateImage = pinTemplate.querySelector('img');
  var pinHeight = pinTemplateImage.getAttribute('height');
  var pinsWrapper = document.querySelector('.map__pins');

  var filters = document.querySelector('.map__filters');
  var typeFilter = filters.querySelector('#housing-type');
  var priceFilter = filters.querySelector('#housing-price');
  var roomsFilter = filters.querySelector('#housing-rooms');
  var guestsFilter = filters.querySelector('#housing-guests');
  var featuresFilter = filters.querySelector('#housing-features');


  filters.addEventListener('change', function () {
    var type = typeFilter.value;
    var price = priceFilter.value;
    var rooms = roomsFilter.value;
    var guests = guestsFilter.value;
    var features = Array.from(featuresFilter.querySelectorAll('input[type=checkbox]:checked')).map(function (item) {
      return item.value;
    });
    updatePins(type, guests, rooms, price, features);
  });


  function updatePins(typeValue, guestsValue, roomsValue, priceValue, featuresValues) {
    var pins = pinsWrapper.querySelectorAll('.map__pin:not(.map__pin--main)');
    Array.from(pins).forEach(function (pin) {
      pin.remove();
    });

    var newArr = window.ads;

    if (typeValue !== 'any') {
      newArr = newArr.filter(function (ad) {
        return ad.offer.type === typeValue;
      });
    }
    if (guestsValue !== 'any') {
      newArr = newArr.filter(function (ad) {
        return ad.offer.guests === parseInt(guestsValue, 10);
      });
    }
    if (roomsValue !== 'any') {
      newArr = newArr.filter(function (ad) {
        return ad.offer.rooms === parseInt(roomsValue, 10);
      });
    }
    if (priceValue !== 'any') {
      if (priceValue === 'low') {
        newArr = newArr.filter(function (ad) {
          return ad.offer.price < 10000;
        });
      } else if (priceValue === 'high') {
        newArr = newArr.filter(function (ad) {
          return ad.offer.price > 50000;
        });
      } else if (priceValue === 'middle') {
        newArr = newArr.filter(function (ad) {
          return (ad.offer.price >= 10000 && ad.offer.price <= 50000);
        });
      }
    }
    if (featuresValues.length > 0) {
      newArr = newArr.filter(function (ad) {
        return featuresValues.every(function (item) {
          return ad.offer.features.indexOf(item) !== -1;
        });
      });
    }

    renderPins(newArr);
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
    cloneElement.setAttribute('id', index);
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
      fragment.appendChild(createPin(item, index, arr));
    });
    pinsWrapper.appendChild(fragment);
  }

  window.pin = {
    render: renderPins,
    update: updatePins
  };
})();
