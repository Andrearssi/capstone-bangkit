/* eslint-disable linebreak-style */
/* eslint-disable no-console */
import express from 'express';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import db from './config/Database.js';
import usersRouter from './routes/Users.js';
import articlesRouter from './routes/Articles.js';
import pricesRouter from './routes/Prices.js';

dotenv.config();

const app = express();

try {
  await db.authenticate();
  console.log('Database Connected...');
} catch (error) {
  console.log(error);
}

app.use(cookieParser());
app.use(express.json());
app.use(usersRouter);
app.use('/articles', articlesRouter);
app.use('/prices', pricesRouter);

app.listen(5000, () => {
  console.log('Server running at port 5000');
});
