/* eslint-disable linebreak-style */
/* eslint-disable no-console */
import Validator from 'fastest-validator';
import Articles from '../models/ArticlesModel.js';

const v = new Validator();

export const getArticles = async (req, res) => {
  try {
    const articles = await Articles.findAll({
      attributes: ['judul', 'author', 'content', 'image'],
    });
    return res.json(articles);
  } catch (error) {
    return console.log(error);
  }
};

export const getArticlesById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Articles.findByPk(id, {
      attributes: ['judul', 'author', 'content', 'image'],
    });
    if (!article) {
      return res.status(400).json({
        message: 'Article not found',
      });
    }
    return res.json(article);
  } catch (error) {
    return console.log(error);
  }
};

export const createArticle = async (req, res) => {
  const schema = {
    judul: { type: 'string', min: 3, max: 255 },
    penulis: { type: 'string', min: 3, max: 255 },
    konten: { type: 'string', min: 3, max: 255 },
    image: { type: 'string', min: 3, max: 255 },
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }

  const article = await Articles.create(req.body);
  return res.status(201).json(article);
};

export const updateArticle = async (req, res) => {
  const { id } = req.params;

  const checkArticle = await Articles.findByPk(id);

  if (!checkArticle) {
    return res.status(400).json({
      message: 'Artikel tidak ditemukan',
    });
  }
  const schema = {
    judul: {
      type: 'string', min: 3, max: 255, optional: true,
    },
    penulis: {
      type: 'string', min: 3, max: 255, optional: true,
    },
    konten: {
      type: 'string', min: 3, max: 255, optional: true,
    },
    image: {
      type: 'string', min: 3, max: 255, optional: true,
    },
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }
  const article = await checkArticle.update(req.body);
  return res.json(article);
};

export const deleteArticle = async (req, res) => {
  const { id } = req.params;

  const article = await Articles.findByPk(id);

  if (!article) {
    return res.status(400).json({
      message: 'Artikel tidak ditemukan',
    });
  }

  await article.destroy();
  return res.json({
    msg: 'Artikel berhasil dihapus',
  });
};
