/* eslint-disable linebreak-style */
/* eslint-disable no-console */
import Validator from 'fastest-validator';
import Articles from '../models/ArticlesModel.js';
import { errorResponse, successResponse } from '../config/Response.js';

const v = new Validator();

export const getArticles = async (req, res) => {
  try {
    const articles = await Articles.findAll({
      attributes: ['judul', 'author', 'content', 'image'],
    });
    return successResponse(res, articles);
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};

export const getArticlesById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Articles.findByPk(id, {
      attributes: ['judul', 'author', 'content', 'image'],
    });
    if (!article) {
      return errorResponse(res, 'Artikel tidak ditemukan', 404);
    }
    return successResponse(res, article);
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};

export const createArticle = async (req, res) => {
  const schema = {
    judul: { type: 'string', min: 3, max: 255 },
    author: { type: 'string', min: 3, max: 255 },
    content: { type: 'string', min: 3, max: 255 },
    image: { type: 'string', min: 3, max: 255 },
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return errorResponse(res, validate, 400);
  }
  const article = await Articles.create(req.body);
  return successResponse(res, article, 'success', 201);
};

export const updateArticle = async (req, res) => {
  const { id } = req.params;

  const article = await Articles.findByPk(id);

  if (!article) {
    return errorResponse(res, 'Artikel tidak ditemukan', 404);
  }
  const schema = {
    judul: {
      type: 'string', min: 3, max: 255, optional: true,
    },
    author: {
      type: 'string', min: 3, max: 255, optional: true,
    },
    content: {
      type: 'string', min: 3, max: 255, optional: true,
    },
    image: {
      type: 'string', min: 3, max: 255, optional: true,
    },
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return errorResponse(res, validate, 400);
  }
  await article.update(req.body);
  return successResponse(res, req.body, 'success', 201);
};

export const deleteArticle = async (req, res) => {
  const { id } = req.params;

  const article = await Articles.findByPk(id);

  if (!article) {
    return errorResponse(res, 'Artikel tidak ditemukan', 404);
  }

  await article.destroy();
  return successResponse(res);
};
