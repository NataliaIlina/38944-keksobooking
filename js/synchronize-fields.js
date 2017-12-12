'use strict';

(function () {
  /**
   * synchronizeFields - синхронизирует значения элементов способом, заданным в функции syncValues
   *
   * @param {Node} firstElement
   * @param {Node} secondElement
   * @param {Array} firstValues
   * @param {Array} secondValues
   * @param {function} syncValues
   */
  function synchronizeFields(firstElement, secondElement, firstValues, secondValues, syncValues) {
    var currentValue = firstElement.value;
    var currentIndex = firstValues.indexOf(currentValue);

    syncValues(secondElement, secondValues[currentIndex]);
  }

  window.synchronizeFields = synchronizeFields;
})();
