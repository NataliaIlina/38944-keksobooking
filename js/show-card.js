'use strict';

(function () {
  var TYPE = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var map = document.querySelector('.map');
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var cloneCard = cardTemplate.cloneNode(true);
  // добавляем карточку объявления на карту
  map.querySelector('.map__filters-container').insertAdjacentElement('beforeBegin', cloneCard);
  cloneCard.classList.add('hidden');

  /**
   * объект объявления
   * @typedef {Object} ad
   */

  /**
   * showCard - заполняет карточку объявления данными из объекта
   *
   * @param  {ad} ad объект с данными
   * @param  {Node} template заполняемый элемент
   * @param  {function} onCLose функция закрытия попапа
   */
  function showCard(ad, template, onCLose) {
    var imagesList = template.querySelector('.popup__pictures');
    var featuresList = template.querySelector('.popup__features');
    var closeButton = template.querySelector('.popup__close');

    template.querySelector('h3').textContent = ad.offer.title;
    template.querySelector('p small').textContent = ad.offer.address;
    template.querySelector('.popup__price').textContent = ad.offer.price + ' \u20bd/ночь';
    template.querySelector('h4').textContent = TYPE[ad.offer.type];
    template.querySelector('p:nth-of-type(3)').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    template.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    featuresList.innerHTML = '';
    ad.offer.features.forEach(function (item) {
      var li = document.createElement('li');
      li.classList.add('feature', 'feature--' + item);
      featuresList.appendChild(li);
    });
    template.querySelector('p:nth-of-type(5)').textContent = ad.offer.description;
    template.querySelector('.popup__avatar').setAttribute('src', ad.author.avatar);
    imagesList.innerHTML = '';
    if (ad.offer.photos.length > 0) {
      ad.offer.photos.forEach(function (photo) {
        var listItem = document.createElement('li');
        var image = document.createElement('img');
        image.setAttribute('src', photo);
        image.style = 'width: 40px; height: 40px; margin-right: 5px';
        listItem.appendChild(image);
        imagesList.appendChild(listItem);
      });
    }
    template.classList.remove('hidden');

    closeButton.addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onPopupEscPress);

    sortImages(imagesList);

    /**
     * onPopupCloseClick - обработчик события клика мыши на крестике попапа
     *
     */
    function onPopupCloseClick() {
      onCLose();
      // удаляем обработчики попапа
      closeButton.removeEventListener('click', onPopupCloseClick);
      document.removeEventListener('keydown', onPopupEscPress);
    }

    /**
     * onPopupEscPress - обработчик события нажатия клавиши при открытом попапе
     *
     * @param  {Event} evt
     */
    function onPopupEscPress(evt) {
      window.handlers.isEscPressed(evt, onCLose);
      // удаляем обработчики попапа
      closeButton.removeEventListener('click', onPopupCloseClick);
      document.removeEventListener('keydown', onPopupEscPress);
    }
  }

  function sortImages(list) {
    var dragEl;
    // разрешаем переност элементов списка
    Array.from(list.children).forEach(function (item) {
      item.draggable = true;
    });

    function onDragOver(evt) {
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'move';
      var target = evt.target.closest('li');
      if (target && target !== dragEl) {
        list.insertBefore(dragEl, target);
      }
    }

    function onDragEnd(evt) {
      evt.preventDefault();
      list.removeEventListener('dragover', onDragOver, false);
      list.removeEventListener('dragend', onDragEnd, false);
    }

    list.addEventListener('dragstart', function (evt) {
      // запоминаем элемент который будет перемещать
      dragEl = evt.target.closest('li');
      evt.dataTransfer.effectAllowed = 'move';
      list.addEventListener('dragover', onDragOver);
      list.addEventListener('dragend', onDragEnd);
    });
  }

  window.showCard = showCard;
})();

