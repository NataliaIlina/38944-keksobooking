'use strict';

(function () {
  var map = document.querySelector('.map');
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  // добавляем карточку объявления на карту
  map.querySelector('.map__filters-container').insertAdjacentElement('beforeBegin', cardTemplate.cloneNode(true));
})();
