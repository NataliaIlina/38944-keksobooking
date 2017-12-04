'use strict';

(function () {
  var map = document.querySelector('.map');
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  // добавляем карточку объявления на карту
  map.querySelector('.map__filters-container').insertAdjacentElement('beforeBegin', createCardElement(window.data.ads[0]));

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
    template.querySelector('h4').textContent = window.data.type[obj.offer.type];
    template.querySelector('p:nth-of-type(3)').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
    template.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
    featuresList.innerHTML = '';
    for (var i = 0; i < obj.offer.features.length; i++) {
      var li = document.createElement('li');
      li.classList.add('feature', 'feature--' + obj.offer.features[i]);
      featuresList.appendChild(li);
    }
    template.querySelector('p:nth-of-type(5)').textContent = obj.offer.description;
    template.querySelector('.popup__avatar').setAttribute('src', obj.author.avatar);
  }

  window.card = {
    fill: fillCard
  };
})();
