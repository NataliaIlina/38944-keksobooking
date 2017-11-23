'use strict';

var NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var GUESTS_PER_ROOM = 2;
var NUMBER_OF_ADS = 8;

var ads = [];
// копируем массивы для дальнейшего изменения
var copyNumbers = NUMBERS.slice();
var copyTitles = TITLES.slice();
var copyFeatures = FEATURES.slice();

/**
* Возвращает значение случайного элемента заданного массива
*
* @param {Array} arr массив
* @return {string} случайный элемент массива
*/
var getRandomElement = function (arr) {
  var index = Math.floor(Math.random() * arr.length);
  return arr[index];
};

/**
* Возвращает значение случайного элемента заданного массива, вырезая его из массива, избегая повторений
*
* @param {Array} arr массив
* @return {string, number} случайный элемент массива
*/

var getRandomNoRepeatElement = function (arr) {
  var elem = getRandomElement(arr);
  var index = arr.indexOf(elem);
  arr.splice(index, 1);
  if (typeof elem === 'number' && elem < 10) {
    elem = '0' + elem;
  }
  return elem;
};

/**
* Возвращает случайное число в заданном диапазоне
*
* @param {number} min минимальное значение
* @param {number} max максимальное значение
* @return {number} случайное число между min и max
*/
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

/**
 * Округляет число по заданному значению
 *
 * @param  {number} number  число
 * @param  {number} roundBy диапазон округления
 * @return {number} округленное число
 */
var roundUpNumber = function (number, roundBy) {
  return (Math.round(number / roundBy)) * roundBy;
};

/**
 * Генерирует объект объявления из случайных элементов заданных массивов
 *
 * @param  {Array} numbers порядковые номера пользователей
 * @param  {Array} titles название объявления
 * @param  {Array} types тип объявления
 * @param  {Array} times время заезда/выезда
 * @param  {Array} features особенности
 * @param  {number} guests количество гостей на комнату
 * @return {Object} объект объявления
 */
var generateAd = function (numbers, titles, types, times, features, guests) {
  var ad = {};
  var rooms = getRandomNumber(1, 5);
  var newFeatures = features.slice(0, getRandomNumber(1, features.length));
  var locationX = getRandomNumber(300, 900);
  var locationY = getRandomNumber(100, 500);

  ad.author = {
    avatar: 'img/avatars/user' + getRandomNoRepeatElement(numbers) + '.png'
  };
  ad.offer = {
    title: getRandomNoRepeatElement(titles),
    address: locationX + ', ' + locationY,
    price: roundUpNumber(getRandomNumber(1000, 1000000), 100),
    type: getRandomElement(types),
    rooms: rooms,
    guests: rooms * guests,
    checkin: getRandomElement(times),
    checkout: getRandomElement(times),
    features: newFeatures,
    description: '',
    photos: []
  };
  ad.location = {
    x: locationX,
    y: locationY
  };

  return ad;
};

for (var i = 0; i < NUMBER_OF_ADS; i++) {
  ads[i] = generateAd(copyNumbers, copyTitles, TYPES, TIMES, copyFeatures, GUESTS_PER_ROOM);
}

// document.querySelector('.map').classList.remove('map--faded');
