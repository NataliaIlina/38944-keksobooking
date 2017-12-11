'use strict';

(function () {
  /**
   * showCard - заполняет карточку объявления данными из объекта
   *
   * @param  {ad} ad объект с данными
   * @param  {Node} template заполняемый элемент
   */
  window.showCard = function (ad, template) {
    var imagesList = template.querySelector('.popup__pictures');
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
  };
})();

