'use strict';

var NUMBERS = createNumbersArray(1, 8);
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
var TYPES = [
  'flat',
  'house',
  'bungalo'
];
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
var GUESTS_PER_ROOM = 2;
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
var NUMBER_OF_ADS = 8;

var ads = [];
// копируем массивы для дальнейшего изменения
var copyNumbers = NUMBERS.slice();
var copyTitles = TITLES.slice();
var copyFeatures = FEATURES.slice();

var buttonTemplate = document.querySelector('template').content.querySelector('.map__pin');
var buttonTemplateImage = buttonTemplate.querySelector('img');
var buttonWidth = buttonTemplateImage.getAttribute('width');
var buttonHeight = buttonTemplateImage.getAttribute('height');
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
var fragment = document.createDocumentFragment();
var mapPinsElement = document.querySelector('.map__pins');
var mapElement = document.querySelector('.map');

mapElement.classList.remove('map--faded');
// заполняем пустой массив объектами
for (var i = 0; i < NUMBER_OF_ADS; i++) {
  ads[i] = generateAd();
}
// для каждого объекта массива создаем копию элемента с шаблона
ads.forEach(function (item) {
  fragment.appendChild(createCloneElement(item));
});
// добавляем фрагмент с копиями в DOM
mapPinsElement.appendChild(fragment);
// заполняем карточку объявления данными и добавляем в DOM
mapElement.appendChild(fillCard(ads[0]));


/**
 * createNumbersArray - создает массив чисел
 *
 * @param  {number} a первый элемент массива
 * @param  {number} b последний элемент массива
 * @return {Array} массив
 */
function createNumbersArray(a, b) {
  var arr = [];
  for (a; a <= b; a++) {
    arr.push(a);
  }
  return arr;
}

/**
* getRandomElement - возвращает значение случайного элемента заданного массива
*
* @param {Array} arr массив
* @return {string} случайный элемент массива
*/
function getRandomElement(arr) {
  var index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
* getRandomNoRepeatElement - возвращает значение случайного элемента заданного массива, вырезая его из массива
*
* @param {Array} arr массив
* @return {string|number} случайный элемент массива
*/
function getRandomNoRepeatElement(arr) {
  var elem = getRandomElement(arr);
  var index = arr.indexOf(elem);
  arr.splice(index, 1);
  if (typeof elem === 'number' && elem < 10) {
    elem = '0' + elem;
  }
  return elem;
}

/**
* getRandomNumber - возвращает случайное число в заданном диапазоне
*
* @param {number} min минимальное значение
* @param {number} max максимальное значение
* @return {number} случайное число между min и max
*/
function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * roundUpNumber - округляет число по заданному значению
 *
 * @param  {number} number  число
 * @param  {number} roundBy диапазон округления
 * @return {number} округленное число
 */
function roundUpNumber(number, roundBy) {
  return (Math.round(number / roundBy)) * roundBy;
}

/**
 * generateAd - генерирует объект объявления
 *
 * @return {Object} объект объявления
 */
function generateAd() {
  var ad = {};
  var rooms = getRandomNumber(ROOMS.min, ROOMS.max);
  var features = copyFeatures.slice(0, getRandomNumber(1, copyFeatures.length));
  var locationX = getRandomNumber(LOCATIONS.x.min, LOCATIONS.x.max);
  var locationY = getRandomNumber(LOCATIONS.y.min, LOCATIONS.y.max);
  ad.author = {
    avatar: 'img/avatars/user' + getRandomNoRepeatElement(copyNumbers) + '.png'
  };
  ad.offer = {
    title: getRandomNoRepeatElement(copyTitles),
    address: locationX + ', ' + locationY,
    price: roundUpNumber(getRandomNumber(PRICES.min, PRICES.max), PRICES.round),
    type: getRandomElement(TYPES),
    rooms: rooms,
    guests: rooms * GUESTS_PER_ROOM,
    checkin: getRandomElement(TIMES),
    checkout: getRandomElement(TIMES),
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
 * createCloneElement - возвращает объект, заполненный данными из массива
 *
 * @param  {Object} obj объект с данными
 * @return {Object} скопированный с шаблона элемент с данными
 */
function createCloneElement(obj) {
  var сloneElement = buttonTemplate.cloneNode(true);
  сloneElement.style.left = (obj.location['x'] - buttonWidth / 2) + 'px';
  сloneElement.style.top = (obj.location['y'] + parseInt(buttonHeight, 10)) + 'px';
  сloneElement.querySelector('img').setAttribute('src', obj.author.avatar);
  return сloneElement;
}

/**
 * fillCard - возвращает карточку объявления с данными из объекта
 *
 * @param  {Object} obj объект с данными
 * @return {Object} карта товара с данными
 */
function fillCard(obj) {
  var cloneCard = cardTemplate.cloneNode(true);
  var list = cloneCard.querySelector('.popup__features');
  cloneCard.querySelector('h3').textContent = obj.offer.title;
  cloneCard.querySelector('p small').textContent = obj.offer.address;
  cloneCard.querySelector('.popup__price').textContent = obj.offer.price + ' &#x20bd;/ночь';
  cloneCard.querySelector('p:nth-of-type(3)').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
  cloneCard.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
  for (i = 0; i < obj.offer.features.length; i++) {
    var li = document.createElement('li');
    li.classList.add('feature', 'feature--' + obj.offer.features[i]);
    list.appendChild(li);
  }
  cloneCard.querySelector('p:nth-of-type(5)').textContent = obj.offer.description;
  cloneCard.querySelector('.popup__avatar').setAttribute('src', obj.author.avatar);
  return cloneCard;
}
