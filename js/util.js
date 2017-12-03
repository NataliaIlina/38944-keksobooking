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
    * @param {boolean} noRepeat если true, вырезаем элемент из массива
    * @return {*} случайный элемент массива
    */
    getRandomElement: function (arr, noRepeat) {
      var index = Math.floor(Math.random() * arr.length);
      if (noRepeat) {
        return arr.splice(index, 1);
      } else {
        return arr[index];
      }
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
    }
  };
})();
