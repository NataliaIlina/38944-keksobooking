'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  window.handlers = {

    /**
     * Вызывает заданную функцию при нажатии клавиши Enter
     *
     * @param  {Event} evt Event
     * @param  {function} action функция
     */
    isEnterPressed: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },

    /**
     * Вызывает заданную функцию при нажатии клавиши Esc
     *
     * @param  {Event} evt Event
     * @param  {function} action функция
     */
    isEscPressed: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    }
  };
})();
