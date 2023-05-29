/* eslint-disable linebreak-style */
/* eslint-disable no-console */
import Validator from 'fastest-validator';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Articles, ArticleImages } from '../models/ArticlesModel.js';
import { errorResponse, successResponse } from '../config/Response.js';

const v = new Validator();

const storage = new Storage({
  projectId: 'testing-backend-388116',
  keyFilename: '../config/key.json',
});

const bucketName = 'images-berasai';

export const getArticles = async (req, res) => {
  try {
    const articles = await Articles.findAll({
      attributes: ['id', 'judul', 'author', 'content'],
      include: ArticleImages,
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
      attributes: ['id', 'judul', 'author', 'content'],
      include: ArticleImages,
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
    images: {
      type: 'array',
      items: 'string',
      min: 1,
      max: 10,
    },
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return errorResponse(res, validate, 400);
  }

  try {
    const article = await Articles.create({
      judul: req.body.judul,
      author: req.body.author,
      content: req.body.content,
    });

    const uploadedImages = await Promise.all(
      req.body.images.map(async (image) => {
        const fileExtension = path.extname(image);
        const fileName = `${uuidv4()}${fileExtension}`;
        const filePath = `articles/${article.id}/${fileName}`;

        await storage.bucket(bucketName).upload(image, {
          destination: filePath,
        });

        const imageEntry = await ArticleImages.create({
          imagePath: filePath,
          articleId: article.id,
        });

        return imageEntry;
      }),
    );

    article.article_images = uploadedImages;

    return successResponse(res, article, 'Artikel berhasil dibuat', 201);
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};

export const updateArticle = async (req, res) => {
  const { id } = req.params;

  const article = await Articles.findByPk(id, {
    include: ArticleImages,
  });

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
    images: {
      type: 'array',
      items: 'string',
      optional: true,
      min: 1,
      max: 10,
    },
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return errorResponse(res, validate, 400);
  }

  try {
    await article.update({
      judul: req.body.judul || article.judul,
      author: req.body.author || article.author,
      content: req.body.content || article.content,
    });

    if (req.body.images && req.body.images.length > 0) {
      await Promise.all(
        article.article_images.map(async (imageEntry) => {
          await storage
            .bucket(bucketName)
            .file(imageEntry.imagePath)
            .delete();
          await imageEntry.destroy();
        }),
      );

      const uploadedImages = await Promise.all(
        req.body.images.map(async (image) => {
          const fileExtension = path.extname(image);
          const fileName = `${uuidv4()}${fileExtension}`;
          const filePath = `articles/${article.id}/${fileName}`;

          await storage.bucket(bucketName).upload(image, {
            destination: filePath,
          });

          const imageEntry = await ArticleImages.create({
            imagePath: filePath,
            articleId: article.id,
          });

          return imageEntry;
        }),
      );

      article.article_images = uploadedImages;
    }

    return successResponse(res, article, 'Artikel berhasil diperbarui', 200);
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};

export const deleteArticle = async (req, res) => {
  const { id } = req.params;

  const article = await Articles.findByPk(id, {
    include: ArticleImages,
  });

  if (!article) {
    return errorResponse(res, 'Artikel tidak ditemukan', 404);
  }

  try {
    await Promise.all(
      article.article_images.map(async (imageEntry) => {
        await storage.bucket(bucketName).file(imageEntry.imagePath).delete();
        await imageEntry.destroy();
      }),
    );

    await article.destroy();

    return successResponse(res, null, 'Artikel berhasil dihapus', 200);
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};
