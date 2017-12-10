'use strict';

(function () {
  window.synchronizeFields = function (firstElement, secondElement, firstValues, secondValues, syncValues) {
    var currentValue = firstElement.value;
    var currentIndex = firstValues.indexOf(currentValue);

    syncValues(secondElement, secondValues[currentIndex]);
  };
})();
