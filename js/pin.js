'use strict';

(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinTemplateImage = pinTemplate.querySelector('img');
  var pinHeight = pinTemplateImage.getAttribute('height');
  var fragment = document.createDocumentFragment();
  var pinsWrapper = document.querySelector('.map__pins');

  // заполняем фрагмент указателями
  window.data.ads.forEach(function (item) {
    fragment.appendChild(createPin(item));
  });
  // добавляем фрагмент на карту
  pinsWrapper.appendChild(fragment);

  /**
   * createCloneElement - возвращает объект, заполненный данными из массива
   *
   * @param  {Object} obj объект с данными
   * @return {Node} скопированный с шаблона элемент с данными
   */
  function createPin(obj) {
    var cloneElement = pinTemplate.cloneNode(true);
    cloneElement.style.left = (obj.location['x']) + 'px';
    cloneElement.style.top = (obj.location['y'] + parseInt(pinHeight, 10)) + 'px';
    cloneElement.querySelector('img').setAttribute('src', obj.author.avatar);
    return cloneElement;
  }

  // передаем массив с указателями в глобальную область видимости
  window.pin = {
    list: Array.prototype.slice.call(pinsWrapper.querySelectorAll('.map__pin'))
  };
})();
