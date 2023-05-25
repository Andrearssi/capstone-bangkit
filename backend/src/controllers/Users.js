/* eslint-disable linebreak-style */
/* eslint-disable no-console */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import Users from '../models/UsersModel.js';

dotenv.config();

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['id', 'name', 'email'],
    });
    return res.json(users);
  } catch (error) {
    return console.log(error);
  }
};

export const Register = async (req, res) => {
  const {
    name, email, password, confPassword,
  } = req.body;
  try {
    const existingUser = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        msg: `Email ${email} telah terdaftar`,
      });
    }
    if (password !== confPassword) {
      return res.status(400).json({
        msg: 'Password dan confirm Password tidak cocok',
      });
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    await Users.create({
      name,
      email,
      password: hashPassword,
    });
    return res.json({
      msg: 'Register Berhasil',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Terjadi kesalahan saat melakukan registrasi',
    });
  }
};

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) {
      return res.status(400).json({
        msg: 'Wrong Password',
      });
    }
    const userId = user[0].id;
    const { name } = user[0];
    const { email } = user[0];
    const accessToken = jwt.sign(
      {
        userId,
        name,
        email,
      },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: '20s',
      },
    );
    const refreshToken = jwt.sign(
      {
        userId,
        name,
        email,
      },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      },
    );
    await Users.update(
      {
        refresh_token: refreshToken,
      },
      {
        where: {
          id: userId,
        },
      },
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // jika menggunakan https secure: true,
    });
    return res.json({ accessToken });
  } catch (error) {
    return res.status(404).json({
      msg: 'Email tidak ditemukan',
    });
  }
};

export const Logout = async (req, res) => {
  const refreshtoken = req.cookies.refreshToken;
  if (!refreshtoken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshtoken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    },
  );
  return res.clearCookie('refreshToken');
};
