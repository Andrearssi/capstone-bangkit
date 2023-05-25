/* eslint-disable linebreak-style */
/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import Users from '../models/UsersModel.js';

dotenv.config();

const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = process.env;

const refreshToken = async (req, res) => {
  try {
    const refreshtoken = req.cookies.refreshToken;
    if (!refreshtoken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshtoken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    return jwt.verify(refreshtoken, REFRESH_TOKEN_SECRET, (err) => {
      if (err) return res.sendStatus(403);
      const userId = user[0].id;
      const { name } = user[0];
      const { email } = user[0];
      const accessToken = jwt.sign({ userId, name, email }, ACCESS_TOKEN_SECRET, {
        expiresIn: '15s',
      });
      return res.json({ accessToken });
    });
  } catch (error) {
    return console.log(error);
  }
};

export default refreshToken;
