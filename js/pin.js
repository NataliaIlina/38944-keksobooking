'use strict';

(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinTemplateImage = pinTemplate.querySelector('img');
  var pinHeight = pinTemplateImage.getAttribute('height');
  var pinsWrapper = document.querySelector('.map__pins');

  /**
   * createPin - возвращает объект, заполненный данными из массива
   *
   * @param  {ad} ad объект с данными
   * @return {Node} скопированный с шаблона элемент с данными
   */
  function createPin(ad) {
    var cloneElement = pinTemplate.cloneNode(true);
    cloneElement.style.left = (ad.location['x']) + 'px';
    cloneElement.style.top = (ad.location['y'] + parseInt(pinHeight, 10)) + 'px';
    cloneElement.querySelector('img').setAttribute('src', ad.author.avatar);
    return cloneElement;
  }

  /**
   * renderPins - отрисовывает пины на основе данных из массива
   *
   * @param {Ad[]} ads массив объявлений
   */
  function renderPins(ads) {
    var fragment = document.createDocumentFragment();
    ads.forEach(function (item) {
      fragment.appendChild(createPin(item));
    });
    pinsWrapper.appendChild(fragment);
  }

  window.pin = {
    render: renderPins
  };
})();
