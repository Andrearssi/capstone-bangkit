/* eslint-disable linebreak-style */
import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

export const Articles = db.define(
  'articles',
  {
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  },
);

export const ArticleImages = db.define(
  'article_images',
  {
    imagePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Articles,
        key: 'id',
      },
    },
  },
  {
    freezeTableName: true,
  },
);

Articles.hasMany(ArticleImages, { foreignKey: 'articleId' });
ArticleImages.belongsTo(Articles, { foreignKey: 'articleId' });
