'use strict';

(function () {
  var INTERVAL = 500;
  var ERROR_COLOR = '#ff5635';
  var currentTimeout;

  /**
   * debounce - устанавливает setTimeout для заданной функции, устраняя слишком частые ее вызовы
   *
   * @param {function} action
   */
  function debounce(action) {
    if (currentTimeout) {
      window.clearTimeout(currentTimeout);
    }
    currentTimeout = window.setTimeout(action, INTERVAL);
  }

  /**
   * createPopup - создает попап, задает стили и заполняет данными
   *
   * @param {string} text
   * @param {string} backgroundColor
   */
  function createPopup(text, backgroundColor) {
    var popup = document.createElement('div');
    popup.textContent = text;
    popup.style = 'padding: 30px 40px; color: white; font-size: 25px; text-align: center;position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 100';
    popup.style.backgroundColor = backgroundColor;
    document.body.insertAdjacentElement('afterbegin', popup);
    // закрываем попап при клику/esc
    document.addEventListener('click', onPageClick);
    document.addEventListener('keydown', onPageKeyPress);

    function onPageClick(evt) {
      evt.preventDefault();
      removePopup();
    }

    function onPageKeyPress(evt) {
      evt.preventDefault();
      window.handlers.isEscPressed(evt, removePopup);
    }

    function removePopup() {
      popup.remove();
      document.removeEventListener('click', onPageClick);
      document.removeEventListener('keydown', onPageKeyPress);
    }
  }

  /**
   * renderErrorPopup - отрисовывает попап с сообщением об ошибке
   *
   * @param {string} message
   */
  function renderErrorPopup(message) {
    createPopup(message, ERROR_COLOR);
  }

  window.util = {
    debounce: debounce,
    renderErrorPopup: renderErrorPopup,
    createPopup: createPopup
  };
})();
