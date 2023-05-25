/* eslint-disable linebreak-style */
import express from 'express';
import {
  getPrices, getPricesById, createPrice, updatePrice,
} from '../controllers/Prices.js';

const pricesRouter = express.Router();

pricesRouter.get('/', getPrices);
pricesRouter.post('/', createPrice);
pricesRouter.get('/:id', getPricesById);
pricesRouter.put('/:id', updatePrice);

export default pricesRouter;
