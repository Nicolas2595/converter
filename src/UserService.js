// src/UserService.js
const axios = require('axios');

class UserService {
  constructor(apiUrl, db, tokenService) {
    this.apiUrl = apiUrl;
    this.db = db;
    this.tokenService = tokenService;
  }

  async fetchUsers() {
    const token = await this.tokenService.getToken();
    try {
      const response = await axios.get(`${this.apiUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error('Errore nel recupero dei dati utente');
    }
  }

  async saveUsers(users) {
    try {
      await this.db.insert(users);
    } catch (error) {
      throw new Error('Errore nel salvataggio dei dati utente');
    }
  }

  async createUser(user) {
    try {
      const token = await this.tokenService.getToken();
      const response = await axios.post(`${this.apiUrl}/users`, user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await this.db.insert([response.data]);
      return response.data;
    } catch (error) {
      throw new Error('Errore nella creazione dell\'utente');
    }
  }

  async updateUser(user) {
    try {
      const token = await this.tokenService.getToken();
      await axios.put(`${this.apiUrl}/users/${user.id}`, user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await this.db.update(user.id, user);
    } catch (error) {
      throw new Error('Errore nell\'aggiornamento dell\'utente');
    }
  }

  async deleteUser(userId) {
    try {
      const token = await this.tokenService.getToken();
      await axios.delete(`${this.apiUrl}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await this.db.delete(userId);
    } catch (error) {
      throw new Error('Errore nella cancellazione dell\'utente');
    }
  }

  async getUser(userId) {
    try {
      const user = await this.db.get(userId);
      return user;
    } catch (error) {
      throw new Error('Errore nel recupero dell\'utente');
    }
  }

  calculateAverageAge(users) {
    if (users.length === 0) return 0;

    const totalAge = users.reduce((sum, user) => sum + user.age, 0);
    return totalAge / users.length;
  }

  async getAndSaveUsers() {
    const users = await this.fetchUsers();
    await this.saveUsers(users);
    return users;
  }

  async getAverageAge() {
    const users = await this.db.getAll();
    return this.calculateAverageAge(users);
  }
}

module.exports = UserService;
