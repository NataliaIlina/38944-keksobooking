'use strict';

(function () {
  var ACTIVE_BORDER_COLOR = '#ff5635';
  var ACTIVE_BACKGROUND_COLOR = 'rgba(255, 86, 53, 0.2)';

  function makeDroppable(element, input, callback) {

    input.addEventListener('change', function (evt) {
      triggerCallback(evt, callback);
    });

    document.addEventListener('dragover', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
    });

    element.addEventListener('dragenter', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      element.style.borderColor = ACTIVE_BORDER_COLOR;
      element.style.backgroundColor = ACTIVE_BACKGROUND_COLOR;
    });

    element.addEventListener('dragleave', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      element.style = '';
    });

    element.addEventListener('drop', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      element.style = '';
      triggerCallback(evt, callback);
    });
  }


  function triggerCallback(evt, callback) {
    if (typeof callback !== 'function') {
      return;
    }
    var files;
    if (evt.dataTransfer) {
      files = evt.dataTransfer.files;
    } else if (evt.target) {
      files = evt.target.files;
    }
    callback(files);
  }

  window.makeDroppable = makeDroppable;
})();
