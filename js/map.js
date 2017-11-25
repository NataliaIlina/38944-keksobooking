'use strict';

var NUMBERS = createNumbersArray(1, 8);
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
  ads[i] = generateAd(copyNumbers, copyTitles, TYPES, TIMES, copyFeatures, GUESTS_PER_ROOM);
}
// для каждого объекта массива создаем копию элемента с шаблона
ads.forEach(function (item) {
  fragment.appendChild(createCloneElement(buttonTemplate, item, buttonWidth, buttonHeight));
});
// добавляем фрагмент с копиями в DOM
mapPinsElement.appendChild(fragment);
// заполняем карточку объявления данными и добавляем в DOM
mapElement.appendChild(fillCard(cardTemplate, ads[0]));


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
 * generateAd - генерирует объект объявления из случайных элементов заданных массивов
 *
 * @param  {Array} numbers порядковые номера пользователей
 * @param  {Array} titles название объявления
 * @param  {Array} types тип объявления
 * @param  {Array} times время заезда/выезда
 * @param  {Array} features особенности
 * @param  {number} guests количество гостей на комнату
 * @return {Object} объект объявления
 */
function generateAd(numbers, titles, types, times, features, guests) {
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
}

/**
 * createCloneElement - возвращает объект, заполненный данными из массива
 *
 * @param  {Object} template шаблон для создания копии
 * @param  {Object} obj объект с данными
 * @param  {string} width атрибут ширины элемента (для точного указания локации)
 * @param  {string} height атрибут высоты элемента
 * @return {Object} скопированный с шаблона элемент с данными
 */
function createCloneElement(template, obj, width, height) {
  var сloneElement = template.cloneNode(true);
  сloneElement.style.left = (obj.location['x'] - width / 2) + 'px';
  сloneElement.style.top = (obj.location['y'] + parseInt(height, 10)) + 'px';
  сloneElement.querySelector('img').setAttribute('src', obj.author.avatar);
  return сloneElement;
}

/**
 * fillCard - возвращает карточку объявления с данными из объекта
 *
 * @param  {Object} template шаблон элемента
 * @param  {Object} obj объект с данными
 * @return {Object} карта товара с данными
 */
function fillCard(template, obj) {
  var cloneCard = template.cloneNode(true);
  var list = cloneCard.querySelector('.popup__features');
  cloneCard.querySelector('h3').textContent = obj.offer.title;
  cloneCard.querySelector('p small').textContent = obj.offer.address;
  cloneCard.querySelector('.popup__price').textContent = obj.offer.price + ' &#x20bd;/ночь';
  cloneCard.querySelector('p:nth-of-type(3)').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
  cloneCard.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + ads[0].offer.checkin + ', выезд до ' + obj.offer.checkout;
  for (i = 0; i < obj.offer.features.length; i++) {
    var li = document.createElement('li');
    li.classList.add('feature', 'feature--' + obj.offer.features[i]);
    list.appendChild(li);
  }
  cloneCard.querySelector('p:nth-of-type(5)').textContent = obj.offer.description;
  cloneCard.querySelector('.popup__avatar').setAttribute('src', obj.author.avatar);
  return cloneCard;
}
