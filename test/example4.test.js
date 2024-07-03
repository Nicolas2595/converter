// test/async.test.js
const assert = require('assert');

function fetchData(callback) {
  setTimeout(() => {
    callback(null, 'dati');
  }, 100);
}

describe('Funzione fetchData', function() {
  it('dovrebbe restituire dati dopo un timeout', function(done) {
    fetchData((err, data) => {
      assert.strictEqual(data, 'dati');
      done();
    });
  });
});
