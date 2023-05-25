/* eslint-disable linebreak-style */
import { Sequelize } from 'sequelize';

const db = new Sequelize({
  username: 'root',
  password: '',
  database: 'db_test',
  host: 'localhost',
  dialect: 'mysql',
});

export default db;
