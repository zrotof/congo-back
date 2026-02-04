const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { models } = require('../models');
const { tokenLifeTimeOnLogin, rsa } = require('../config/dot-env');
const { isPasswordValid } = require('../helpers/password.helpers');

// Charger la clé privée RSA
const privateKeyPath = path.join(__dirname, '..', rsa.keysDir, rsa.privateKeyFilename);
const RSA_PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email et mot de passe requis'
      });
    }

    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Identifiants invalides'
      });
    }

    const isValid = isPasswordValid(password, user.password, user.salt);

    if (!isValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Identifiants invalides'
      });
    }

    // Créer le token JWT avec RSA
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      RSA_PRIVATE_KEY,
      { 
        algorithm: 'RS256',
        expiresIn: tokenLifeTimeOnLogin 
      }
    );

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      message: 'Connexion réussie'
    });

  } catch (error) {
    console.log(error)
    next(error);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('admin_token');
  return res.status(200).json({
    status: 'success',
    message: 'Déconnexion réussie'
  });
};

exports.me = (req, res) => {
  const user = req.user;
  return res.status(200).json({
    status: 'success',
    data: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    }
  });
};