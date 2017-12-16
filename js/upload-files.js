'use strict';

(function () {
  function makeDroppable(element, input, callback) {
    input.addEventListener('change', function (evt) {
      triggerCallback(evt, callback);
    });

    document.addEventListener('dragover', function (evt) {
      evt.preventDefault();
      element.style.borderColor = 'red';
    });

    element.addEventListener('dragenter', function (evt) {
      evt.preventDefault();
      element.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    });

    element.addEventListener('dragleave', function (evt) {
      evt.preventDefault();
      element.style = '';
    });

    document.addEventListener('drop', function (evt) {
      evt.preventDefault();
      element.style = '';
    });

    element.addEventListener('drop', function (evt) {
      evt.preventDefault();
      element.style = '';
      triggerCallback(evt, callback);
    });
  }


  function triggerCallback(evt, callback) {
    if (!callback || typeof callback !== 'function') {
      return;
    }
    var files;
    if (evt.dataTransfer) {
      files = evt.dataTransfer.files;
    } else if (evt.target) {
      files = evt.target.files;
    }
    callback.call(null, files);
  }

  window.makeDroppable = makeDroppable;
})();
