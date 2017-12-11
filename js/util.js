'use strict';

(function () {
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

  window.util = {
    /**
     * renderErrorPopup - отрисовывает попап с сообщением об ошибке
     *
     * @param {string} message
     */
    renderErrorPopup: function (message) {
      createPopup(message, '#ff5635');
    },

    /**
     * renderSuccessPopup - отрисовывает попап с сообщением об успешной отправке данных
     *
     */
    renderSuccessPopup: function () {
      createPopup('Данные успешно отправлены', '#1cb34d');
    }
  };
})();
