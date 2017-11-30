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
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;

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
var mainPin = document.querySelector('.map__pin--main');
var form = document.querySelector('.notice__form');
var formFieldsets = form.querySelectorAll('fieldset');

// заполняем пустой массив объектами
for (var i = 0; i < NUMBER_OF_ADS; i++) {
  ads[i] = generateAd();
}
// для каждого объекта массива создаем копию элемента указателя с шаблона
ads.forEach(function (item) {
  fragment.appendChild(createCloneElement(item));
});

// добавляем фрагмент с указателями в DOM
mapPinsElement.appendChild(fragment);
// получаем в коллекцию все указатели
var pins = mapPinsElement.querySelectorAll('.map__pin');
// в массив отправляем все указатели, кроме главного
var arrPins = [];
for (i = 0; i < pins.length; i++) {
  if (pins[i] !== mainPin) {
    arrPins.push(pins[i]);
  }
}
// скрываем указатели по умолчанию
arrPins.forEach(function (item) {
  item.classList.add('hidden');
});

// добавляем попап на страницу
mapElement.querySelector('.map__filters-container').insertAdjacentElement('beforeBegin', createCardElement(ads[0]));
// скрываем попап по умолчанию
var popupElement = document.querySelector('.popup');
var popupClose = popupElement.querySelector('.popup__close');
popupElement.classList.add('hidden');

// события на главном указателе
mainPin.addEventListener('mouseup', function () {
  showMap();
});

mainPin.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    showMap();
  }
});

/**
 * showMap - показывает карту с указателями
 *
 */
function showMap() {
  // активируем карту и разблокируем форму
  mapElement.classList.remove('map--faded');
  form.classList.remove('notice__form--disabled');
  for (var j = 0; j < formFieldsets.length; j++) {
    formFieldsets[j].disabled = false;
  }
  // показываем указатели и ставим на них обработчик клика
  arrPins.forEach(function (item) {
    item.classList.remove('hidden');
    item.addEventListener('click', onPinClick);
  });
}

/**
 * onPinClick - обработчик события клика мыши на указателях
 *
 * @param  {Object} evt event
 */
function onPinClick(evt) {
  // удаляем все ативные классы
  arrPins.forEach(function (item) {
    item.classList.remove('map__pin--active');
  });
  // добавляем текущему указателю активный класс
  evt.currentTarget.classList.add('map__pin--active');
  // по атрибуту src в картинке находим нужный нам объект объявления и заполняем попап
  var src = evt.currentTarget.children[0].getAttribute('src');
  ads.forEach(function (item) {
    if (item.author.avatar === src.toString()) {
      fillCard(item, popupElement);
    }
  });
  // показываем попап, задаем обработчики на события попапа
  popupElement.classList.remove('hidden');
  popupClose.addEventListener('click', onPopupCloseClick);
  document.addEventListener('keydown', onPopupEscPress);
}

/**
 * closePopup - закрывает попап и убирает активный класс с указателя
 *
 */
function closePopup() {
  popupElement.classList.add('hidden');
  // удаляем активный класс у указателей
  arrPins.forEach(function (item) {
    item.classList.remove('map__pin--active');
  });
  // удаляем обработчики событий попапа при закрытии его
  popupClose.removeEventListener('click', onPopupCloseClick);
  document.removeEventListener('keydown', onPopupEscPress);
}

/**
 * onPopupCloseClick - обработчик события клика на крестик попапа
 *
 */
function onPopupCloseClick() {
  closePopup();
}

/**
 * onPopupEscPress - обработчик события нажатия клавиши при открытом попапе
 *
 * @param  {Object} evt event
 */
function onPopupEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
}

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
* @param {boolean} noRepeat если true, вырезаем элемент из массива
* @return {*} случайный элемент массива
*/
function getRandomElement(arr, noRepeat) {
  var index = Math.floor(Math.random() * arr.length);
  if (noRepeat) {
    return arr.splice(index, 1);
  } else {
    return arr[index];
  }
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
  var userNumber = getRandomElement(copyNumbers, true);
  if (userNumber < 10) {
    userNumber = '0' + userNumber;
  }
  var rooms = getRandomNumber(ROOMS.min, ROOMS.max);
  var features = copyFeatures.slice(0, getRandomNumber(1, copyFeatures.length));
  var locationX = getRandomNumber(LOCATIONS.x.min, LOCATIONS.x.max);
  var locationY = getRandomNumber(LOCATIONS.y.min, LOCATIONS.y.max);
  ad.author = {
    avatar: 'img/avatars/user' + userNumber + '.png'
  };
  ad.offer = {
    title: getRandomElement(copyTitles, true),
    address: locationX + ', ' + locationY,
    price: roundUpNumber(getRandomNumber(PRICES.min, PRICES.max), PRICES.round),
    type: getRandomElement(Object.keys(TYPES)),
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
  var cloneElement = buttonTemplate.cloneNode(true);
  cloneElement.style.left = (obj.location['x'] - buttonWidth / 2) + 'px';
  cloneElement.style.top = (obj.location['y'] + parseInt(buttonHeight, 10)) + 'px';
  cloneElement.querySelector('img').setAttribute('src', obj.author.avatar);
  return cloneElement;
}

/**
 * fillCard - заполняет карточку объявления данными из объекта
 *
 * @param  {Object} obj объект с данными
 * @param  {Node} template заполняемый элемент
 */
function fillCard(obj, template) {
  var featuresList = template.querySelector('.popup__features');
  template.querySelector('h3').textContent = obj.offer.title;
  template.querySelector('p small').textContent = obj.offer.address;
  template.querySelector('.popup__price').textContent = obj.offer.price + ' \u20bd/ночь';
  template.querySelector('h4').textContent = TYPES[obj.offer.type];
  template.querySelector('p:nth-of-type(3)').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
  template.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
  featuresList.innerHTML = '';
  for (i = 0; i < obj.offer.features.length; i++) {
    var li = document.createElement('li');
    li.classList.add('feature', 'feature--' + obj.offer.features[i]);
    featuresList.appendChild(li);
  }
  template.querySelector('p:nth-of-type(5)').textContent = obj.offer.description;
  template.querySelector('.popup__avatar').setAttribute('src', obj.author.avatar);
}

/**
 * createCardElement - Возвращает скопированный с шаблона элемент с данными из объекта
 *
 * @param  {Object} obj объект с данными
 * @return {Node} готовый элемент
 */
function createCardElement(obj) {
  var cloneCard = cardTemplate.cloneNode(true);
  fillCard(obj, cloneCard);
  return cloneCard;
}
