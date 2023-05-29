/* eslint-disable linebreak-style */
import { Sequelize } from 'sequelize';

const db = new Sequelize({
  username: 'andrea',
  password: '123456',
  database: 'berasai',
  host: '34.101.59.88',
  dialect: 'mysql',
});

export default db;
