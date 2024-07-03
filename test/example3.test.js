// test/promise.test.js
const assert = require('assert');

function fetchDataPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('dati');
    }, 100);
  });
}

describe('Funzione fetchDataPromise', function() {
  it('dovrebbe restituire dati dopo un timeout', function() {
    return fetchDataPromise().then(data => {
      assert.strictEqual(data, 'dati');
    });
  });
});
