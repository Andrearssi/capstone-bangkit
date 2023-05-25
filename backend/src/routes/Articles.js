/* eslint-disable linebreak-style */
import express from 'express';
import {
  getArticles, createArticle, getArticlesById, updateArticle, deleteArticle,
} from '../controllers/Articles.js';

const articlesRouter = express.Router();

articlesRouter.get('/', getArticles);
articlesRouter.post('/', createArticle);
articlesRouter.get('/:id', getArticlesById);
articlesRouter.put('/:id', updateArticle);
articlesRouter.delete('/:id', deleteArticle);

export default articlesRouter;
