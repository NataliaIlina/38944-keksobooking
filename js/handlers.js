'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  /**
   * Вызывает заданную функцию при нажатии клавиши Enter
   *
   * @param  {Event} evt
   * @param  {function} action
   */
  function isEnterPressed(evt, action) {
    if (evt.keyCode === ENTER_KEYCODE) {
      action();
    }
  }

  /**
   * Вызывает заданную функцию при нажатии клавиши Esc
   *
   * @param  {Event} evt
   * @param  {function} action
   */
  function isEscPressed(evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  }

  window.handlers = {
    isEnterPressed: isEnterPressed,
    isEscPressed: isEscPressed
  };
})();
