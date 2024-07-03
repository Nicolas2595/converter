// test/mock.test.js
const assert = require('assert');
const sinon = require('sinon');

// Funzione da testare
function getUser(id, callback) {
  // Simuliamo una chiamata a database
  setTimeout(() => {
    callback(null, { id: id, name: 'John Doe' });
  }, 100);
}

// Gruppo di test
describe('Funzione getUser', function() {
  let clock;

  // Setup prima di ogni test
  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  // Cleanup dopo ogni test
  afterEach(function() {
    clock.restore();
  });

  // Test specifico
  it('dovrebbe restituire un utente', function(done) {
    const callback = sinon.spy();

    getUser(1, callback);

    // Avanza il timer fittizio
    clock.tick(100);

    assert(callback.calledOnce);
    assert.strictEqual(callback.firstCall.args[1].name, 'John Doe');
    done();
  });
});
