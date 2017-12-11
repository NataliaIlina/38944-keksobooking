'use strict';

(function () {
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
      var errorPopup = document.createElement('div');
      errorPopup.textContent = message;
      errorPopup.style = 'padding: 30px 40px; color: white; font-size: 25px; text-align: center; background-color: #ff5635; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 100';
      document.body.insertAdjacentElement('afterbegin', errorPopup);

      document.addEventListener('click', function () {
        errorPopup.remove();
      });
    }
  };
})();
