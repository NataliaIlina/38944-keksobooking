'use strict';

(function () {
  var map = document.querySelector('.map');
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  // добавляем карточку объявления на карту
  map.querySelector('.map__filters-container').insertAdjacentElement('beforeBegin', cardTemplate.cloneNode(true));


  /**
   * fillCard - заполняет карточку объявления данными из объекта
   *
   * @param  {ad} ad объект с данными
   * @param  {Node} template заполняемый элемент
   */
  function fillCard(ad, template) {
    var featuresList = template.querySelector('.popup__features');
    template.querySelector('h3').textContent = ad.offer.title;
    template.querySelector('p small').textContent = ad.offer.address;
    template.querySelector('.popup__price').textContent = ad.offer.price + ' \u20bd/ночь';
    template.querySelector('h4').textContent = window.data.type[ad.offer.type];
    template.querySelector('p:nth-of-type(3)').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    template.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    featuresList.innerHTML = '';
    for (var i = 0; i < ad.offer.features.length; i++) {
      var li = document.createElement('li');
      li.classList.add('feature', 'feature--' + ad.offer.features[i]);
      featuresList.appendChild(li);
    }
    template.querySelector('p:nth-of-type(5)').textContent = ad.offer.description;
    template.querySelector('.popup__avatar').setAttribute('src', ad.author.avatar);
  }

  window.card = {
    fill: fillCard
  };
})();
