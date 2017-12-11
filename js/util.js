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
     * createNumbersArray - создает массив чисел
     *
     * @param  {number} a первый элемент массива
     * @param  {number} b последний элемент массива
     * @return {Array} массив
     */
    createNumbersArray: function (a, b) {
      var arr = [];
      for (a; a <= b; a++) {
        arr.push(a);
      }
      return arr;
    },

    /**
    * getRandomElement - возвращает значение случайного элемента заданного массива
    *
    * @param {Array} arr массив
    * @param {boolean} [noRepeat] если true, вырезаем элемент из массива
    * @return {*} случайный элемент массива
    */
    getRandomElement: function (arr, noRepeat) {
      var index = Math.floor(Math.random() * arr.length);
      return noRepeat ? arr.splice(index, 1) : arr[index];
    },

    /**
    * getRandomNumber - возвращает случайное число в заданном диапазоне
    *
    * @param {number} min минимальное значение
    * @param {number} max максимальное значение
    * @return {number} случайное число между min и max
    */
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },

    /**
     * roundUpNumber - округляет число по заданному значению
     *
     * @param  {number} number  число
     * @param  {number} roundBy диапазон округления
     * @return {number} округленное число
     */
    roundUpNumber: function (number, roundBy) {
      return (Math.round(number / roundBy)) * roundBy;
    },

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
