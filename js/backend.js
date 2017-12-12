'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';

  /**
   * setup - возвращает новый объект XMLHttpRequest и передает в обработчики параметры ответа сервера
   *
   * @param {function} onLoad обработчик успешного ответа
   * @param {function} onError обработчик ошибок сервера
   * @return {Object} xhr
   */
  function setup(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Произошла ошибка. Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout / 1000 + 'с');
    });

    xhr.timeout = 5000;
    return xhr;
  }

  /**
   * load - функция загрузки данных с сервера
   *
   * @param {function} onLoad
   * @param {function} onError
   */
  function load(onLoad, onError) {
    var xhr = setup(onLoad, onError);
    xhr.open('GET', SERVER_URL + '/data');
    xhr.send();
  }

  /**
   * save - функция передачи данных на сервер
   *
   * @param {Object} data передаваемые данные
   * @param {function} onLoad
   * @param {function} onError
   */
  function save(data, onLoad, onError) {
    var xhr = setup(onLoad, onError);
    xhr.open('POST', SERVER_URL);
    xhr.send(data);
  }


  window.backend = {
    load: load,
    save: save
  };
})();
