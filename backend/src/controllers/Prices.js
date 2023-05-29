/* eslint-disable linebreak-style */
/* eslint-disable no-console */
import Validator from "fastest-validator";
import Prices from "../models/PricesModel.js";
import { errorResponse, successResponse } from "../config/Response.js";

const v = new Validator();

export const getPrices = async (req, res) => {
  try {
    const prices = await Prices.findAll({
      attributes: ["harga", "provinsi"],
    });
    return successResponse(res, prices);
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};

export const getPricesById = async (req, res) => {
  try {
    const { id } = req.params;
    const price = await Prices.findByPk(id, {
      attributes: ["harga", "provinsi"],
    });
    if (!price) {
      return errorResponse(res, "Price not found", 404);
    }
    return successResponse(res, price);
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};

export const createPrice = async (req, res) => {
  let { harga, provinsi } = req.body;
  const schema = {
    harga: { type: "string" },
    provinsi: { type: "string", min: 3, max: 255 },
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return errorResponse(res, validate, 400);
  }
  if (!harga.match(/^\d*(\.\d+)?$/)) {
    return errorResponse(res, "harga is'n number!", 400);
  }
  harga = parseInt(harga);
  try {
    const inserted = {
      harga,
      provinsi,
    };
    await Prices.create(inserted);
    return successResponse(res, inserted, "success", 201);
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};

export const updatePrice = async (req, res) => {
  const { id } = req.params;

  const checkPrice = await Prices.findByPk(id);

  if (!checkPrice) {
    return errorResponse(res, "Price not found", 404);
  }
  const schema = {
    harga: {
      type: "number",
      positive: true,
      integer: true,
      optional: true,
    },
    provinsi: {
      type: "string",
      min: 3,
      max: 255,
      optional: true,
    },
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return errorResponse(res, validate, 400);
  }
  await checkPrice.update(req.body);
  return successResponse(res, req.body, "success", 201);
};

export const deletePrice = async (req, res) => {
  const { id } = req.params;

  const price = await Prices.findByPk(id);

  if (!price) {
    return errorResponse(res, "Price not found", 404);
  }
  await price.destroy(id);
  return successResponse(res);
};
