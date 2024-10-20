const db = require('../util/database');

module.exports = class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static find(email) {
    return db.execute('SELECT * FROM users WHERE email = ?', [email]); // ? => to prevent SQL injection
  }

  static save(user) {
    return db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', // ? => to prevent SQL injection
      [user.name, user.email, user.password]
    );
  }
};
