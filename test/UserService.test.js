// test/UserService.test.js
const assert = require('assert');
const sinon = require('sinon');
const axios = require('axios');
const UserService = require('../src/UserService');

describe('Classe UserService', function() {
  let userService;
  let axiosGetStub, axiosPostStub, axiosPutStub, axiosDeleteStub;
  let dbMock, tokenServiceMock;

  beforeEach(function() {
    dbMock = {
      insert: sinon.stub(),
      update: sinon.stub(),
      delete: sinon.stub(),
      get: sinon.stub(),
      getAll: sinon.stub()
    };
    tokenServiceMock = {
      getToken: sinon.stub().resolves('fake-token')
    };
    userService = new UserService('http://fakeapi.com', dbMock, tokenServiceMock);
    axiosGetStub = sinon.stub(axios, 'get');
    axiosPostStub = sinon.stub(axios, 'post');
    axiosPutStub = sinon.stub(axios, 'put');
    axiosDeleteStub = sinon.stub(axios, 'delete');
  });

  afterEach(function() {
    sinon.restore();
  });

  it('dovrebbe recuperare i dati utente dall\'API con token', async function() {
    const mockUsers = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 },
    ];
    axiosGetStub.resolves({ data: mockUsers });

    const users = await userService.fetchUsers();
    assert.strictEqual(users.length, 2);
    assert.strictEqual(users[0].name, 'Alice');
    assert(axiosGetStub.calledWith('http://fakeapi.com/users', {
      headers: { Authorization: 'Bearer fake-token' }
    }));
  });

  it('dovrebbe lanciare un errore se il recupero dei dati fallisce', async function() {
    axiosGetStub.rejects(new Error('Errore di rete'));

    try {
      await userService.fetchUsers();
      assert.fail('Dovrebbe aver lanciato un errore');
    } catch (error) {
      assert.strictEqual(error.message, 'Errore nel recupero dei dati utente');
    }
  });

  it('dovrebbe salvare i dati utente nel database', async function() {
    const mockUsers = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 },
    ];
    await userService.saveUsers(mockUsers);

    assert(dbMock.insert.calledOnce);
    assert(dbMock.insert.calledWith(mockUsers));
  });

  it('dovrebbe lanciare un errore se il salvataggio dei dati fallisce', async function() {
    dbMock.insert.rejects(new Error('Errore di database'));

    try {
      await userService.saveUsers([]);
      assert.fail('Dovrebbe aver lanciato un errore');
    } catch (error) {
      assert.strictEqual(error.message, 'Errore nel salvataggio dei dati utente');
    }
  });

  it('dovrebbe creare un nuovo utente e salvarlo nel database', async function() {
    const newUser = { name: 'Alice', age: 30 };
    const savedUser = { id: 1, ...newUser };
    axiosPostStub.resolves({ data: savedUser });

    const user = await userService.createUser(newUser);
    assert.strictEqual(user.id, 1);
    assert(dbMock.insert.calledOnce);
    assert(dbMock.insert.calledWith([savedUser]));
  });

  it('dovrebbe lanciare un errore se la creazione dell\'utente fallisce', async function() {
    const newUser = { name: 'Alice', age: 30 };
    axiosPostStub.rejects(new Error('Errore di rete'));

    try {
      await userService.createUser(newUser);
      assert.fail('Dovrebbe aver lanciato un errore');
    } catch (error) {
      assert.strictEqual(error.message, 'Errore nella creazione dell\'utente');
    }
  });

  it('dovrebbe aggiornare un utente nel database', async function() {
    const updatedUser = { id: 1, name: 'Alice', age: 31 };
    axiosPutStub.resolves();

    await userService.updateUser(updatedUser);
    assert(dbMock.update.calledOnce);
    assert(dbMock.update.calledWith(1, updatedUser));
  });

  it('dovrebbe lanciare un errore se l\'aggiornamento dell\'utente fallisce', async function() {
    const updatedUser = { id: 1, name: 'Alice', age: 31 };
    axiosPutStub.rejects(new Error('Errore di rete'));

    try {
      await userService.updateUser(updatedUser);
      assert.fail('Dovrebbe aver lanciato un errore');
    } catch (error) {
      assert.strictEqual(error.message, 'Errore nell\'aggiornamento dell\'utente');
    }
  });

  it('dovrebbe cancellare un utente nel database', async function() {
    axiosDeleteStub.resolves();

    await userService.deleteUser(1);
    assert(dbMock.delete.calledOnce);
    assert(dbMock.delete.calledWith(1));
  });

  it('dovrebbe lanciare un errore se la cancellazione dell\'utente fallisce', async function() {
    axiosDeleteStub.rejects(new Error('Errore di rete'));

    try {
      await userService.deleteUser(1);
      assert.fail('Dovrebbe aver lanciato un errore');
    } catch (error) {
      assert.strictEqual(error.message, 'Errore nella cancellazione dell\'utente');
    }
  });

  it('dovrebbe recuperare un utente dal database', async function() {
    const mockUser = { id: 1, name: 'Alice', age: 30 };
    dbMock.get.resolves(mockUser);

    const user = await userService.getUser(1);
    assert.strictEqual(user.id, 1);
    assert.strictEqual(user.name, 'Alice');
  });

  it('dovrebbe lanciare un errore se il recupero dell\'utente fallisce', async function() {
    dbMock.get.rejects(new Error('Errore di database'));

    try {
      await userService.getUser(1);
      assert.fail('Dovrebbe aver lanciato un errore');
    } catch (error) {
      assert.strictEqual(error.message, 'Errore nel recupero dell\'utente');
    }
  });

  it('dovrebbe calcolare correttamente l\'età media degli utenti', function() {
    const users = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 },
    ];

    const averageAge = userService.calculateAverageAge(users);
    assert.strictEqual(averageAge, 27.5);
  });

  it('dovrebbe restituire 0 se non ci sono utenti', function() {
    const users = [];

    const averageAge = userService.calculateAverageAge(users);
    assert.strictEqual(averageAge, 0);
  });

  it('dovrebbe recuperare e salvare i dati utente, poi restituirli', async function() {
    const mockUsers = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 },
    ];
    axiosGetStub.resolves({ data: mockUsers });

    const users = await userService.getAndSaveUsers();

    assert.strictEqual(users.length, 2);
    assert(dbMock.insert.calledOnce);
    assert(dbMock.insert.calledWith(mockUsers));
  });

  it('dovrebbe recuperare i dati utente dal database e calcolare l\'età media', async function() {
    const mockUsers = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 },
    ];
    dbMock.getAll.resolves(mockUsers);

    const averageAge = await userService.getAverageAge();
    assert.strictEqual(averageAge, 27.5);
  });
});
