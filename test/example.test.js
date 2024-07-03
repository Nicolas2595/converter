// test/class.test.js
const assert = require('assert');

// Classe da testare
class Calculator {
  add(a, b) {
    return a + b;
  }

  subtract(a, b) {
    return a - b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  }
}

// Gruppo di test
describe('Classe Calculator', function() {
  let calculator;

  // Setup prima di ogni test
  beforeEach(function() {
    calculator = new Calculator();
  });

  // Test specifici
  it('dovrebbe sommare due numeri', function() {
    assert.strictEqual(calculator.add(1, 2), 3);
  });

  it('dovrebbe sottrarre due numeri', function() {
    assert.strictEqual(calculator.subtract(5, 3), 2);
  });

  it('dovrebbe moltiplicare due numeri', function() {
    assert.strictEqual(calculator.multiply(4, 3), 12);
  });

  it('dovrebbe dividere due numeri', function() {
    assert.strictEqual(calculator.divide(10, 2), 5);
  });

  it('dovrebbe lanciare un errore quando si divide per zero', function() {
    assert.throws(() => calculator.divide(1, 0), Error, 'Division by zero');
  });
});
