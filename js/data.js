'use strict';

(function () {
  var NUMBERS = window.util.createNumbersArray(1, 8);
  var TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var TYPES = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };
  var TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];
  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];
  var ROOMS = {
    min: 1,
    max: 5
  };
  var LOCATIONS = {
    x: {
      min: 300,
      max: 900
    },
    y: {
      min: 100,
      max: 500
    }
  };
  var PRICES = {
    min: 1000,
    max: 1000000,
    round: 100
  };
  var GUESTS_PER_ROOM = 2;
  var NUMBER_OF_ADS = 8;

  /**
   * generateAd - возвращает объект объявления, созданный на основе данных, полученных из массивов
   *
   * @param  {Array} numbersArr  числовой массив
   * @param  {Array} titlesArr   массив с заголовками
   * @param  {Array} featuresArr массив с удобствами
   * @return {Object} объект объявления
   */
  function generateAd(numbersArr, titlesArr, featuresArr) {
    var ad = {};
    var userNumber = window.util.getRandomElement(numbersArr, true);
    if (userNumber < 10) {
      userNumber = '0' + userNumber;
    }
    var rooms = window.util.getRandomNumber(ROOMS.min, ROOMS.max);
    var features = featuresArr.slice(0, window.util.getRandomNumber(1, featuresArr.length));
    var locationX = window.util.getRandomNumber(LOCATIONS.x.min, LOCATIONS.x.max);
    var locationY = window.util.getRandomNumber(LOCATIONS.y.min, LOCATIONS.y.max);
    ad.author = {
      avatar: 'img/avatars/user' + userNumber + '.png'
    };
    ad.offer = {
      title: window.util.getRandomElement(titlesArr, true),
      address: locationX + ', ' + locationY,
      price: window.util.roundUpNumber(window.util.getRandomNumber(PRICES.min, PRICES.max), PRICES.round),
      type: window.util.getRandomElement(Object.keys(TYPES)),
      rooms: rooms,
      guests: rooms * GUESTS_PER_ROOM,
      checkin: window.util.getRandomElement(TIMES),
      checkout: window.util.getRandomElement(TIMES),
      features: features,
      description: '',
      photos: []
    };
    ad.location = {
      x: locationX,
      y: locationY
    };
    return ad;
  }

  /**
   * createAds - возвращает массив из сгенерированных объектов
   *
   * @return {Array}  массив
   */
  function createAds() {
    var ads = [];
    for (var i = 0; i < NUMBER_OF_ADS; i++) {
      ads[i] = generateAd(NUMBERS, TITLES, FEATURES);
    }
    return ads;
  }

  window.data = {
    types: {
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    },
    ads: createAds()
  };
})();
