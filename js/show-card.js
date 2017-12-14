'use strict';

(function () {
  var TYPE = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var map = document.querySelector('.map');
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  // добавляем карточку объявления на карту
  map.querySelector('.map__filters-container').insertAdjacentElement('beforeBegin', cardTemplate.cloneNode(true));

  /**
   * объект объявления
   * @typedef {Object} ad
   */

  /**
   * showCard - заполняет карточку объявления данными из объекта
   *
   * @param  {ad} ad объект с данными
   * @param  {Node} template заполняемый элемент
   */
  function showCard(ad, template) {
    var imagesList = template.querySelector('.popup__pictures');
    var featuresList = template.querySelector('.popup__features');

    template.querySelector('h3').textContent = ad.offer.title;
    template.querySelector('p small').textContent = ad.offer.address;
    template.querySelector('.popup__price').textContent = ad.offer.price + ' \u20bd/ночь';
    template.querySelector('h4').textContent = TYPE[ad.offer.type];
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
    imagesList.innerHTML = '';
    if (ad.offer.photos.length > 0) {
      for (var j = 0; j < ad.offer.photos.length; j++) {
        var listItem = document.createElement('li');
        var image = document.createElement('img');
        image.setAttribute('src', ad.offer.photos[j]);
        image.style = 'width: 40px; height: 40px; margin-right: 5px';
        listItem.appendChild(image);
        imagesList.appendChild(listItem);
      }
    }
    template.classList.remove('hidden');
  }

  window.showCard = showCard;
})();

