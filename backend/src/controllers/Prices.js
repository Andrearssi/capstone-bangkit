/* eslint-disable linebreak-style */
/* eslint-disable no-console */
import Validator from 'fastest-validator';
import Prices from '../models/PricesModel.js';

const v = new Validator();

export const getPrices = async (req, res) => {
  try {
    const prices = await Prices.findAll({
      attributes: ['harga', 'provinsi'],
    });
    return res.json(prices);
  } catch (error) {
    return console.log(error);
  }
};

export const getPricesById = async (req, res) => {
  try {
    const { id } = req.params;
    const price = await Prices.findByPk(id, {
      attributes: ['harga', 'provinsi'],
    });
    if (!price) {
      return res.status(400).json({
        message: 'Price not found',
      });
    }
    return res.json(price);
  } catch (error) {
    return console.log(error);
  }
};

export const createPrice = async (req, res) => {
  const schema = {
    harga: { type: 'number', positive: true, integer: true },
    provinsi: { type: 'string', min: 3, max: 255 },
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }
  try {
    await Prices.create(req.body);
    return res.status(201).json({
      msg: 'Create success',
      data: req.body,
    });
  } catch (error) {
    return res.status(500).json({
      msg: 'Server error',
      serverMessage: error,
    });
  }
};

export const updatePrice = async (req, res) => {
  const { id } = req.params;

  const checkPrice = await Prices.findByPk(id);

  if (!checkPrice) {
    return res.status(400).json({
      message: 'Price not found',
    });
  }
  const schema = {
    harga: {
      type: 'number', positive: true, integer: true, optional: true,
    },
    provinsi: {
      type: 'string', min: 3, max: 255, optional: true,
    },
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }
  await checkPrice.update(req.body);
  return res.status(200).json({
    msg: 'Update success',
    data: req.body,
  });
};

export const deletePrice = async (req, res) => {
  const { id } = req.params;

  const price = await Prices.findByPk(id);

  if (!price) {
    return res.status(400).json({
      message: 'Price not found',
    });
  }
  await price.destroy(id);
  return res.status(200).json({
    msg: 'Delete success',
  });
};
