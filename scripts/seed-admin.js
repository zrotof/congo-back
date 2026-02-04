const { sequelize, models } = require('../models');
const { admin } = require('../config/dot-env');
const { generateHashedPasswordAndSalt } = require('../helpers/password.helpers');

async function seedAdmin() {
  if (!admin.email || !admin.password || !admin.username) {
    console.error('❌ Erreur : Les variables FIRST_ADMIN_... ne sont pas définies dans le .env');
    process.exit(1);
  }

  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL établie.');

    const existingUser = await models.User.findOne({ where: { email: admin.email } });

    if (existingUser) {
      console.log(`⚠️ L'admin avec l'email ${admin.email} existe déjà.`);
      process.exit(0);
    }

    const { hash, salt } = generateHashedPasswordAndSalt(admin.password);

    await models.User.create({
      email: admin.email,
      username: admin.username,
      password: hash,
      salt: salt,
      role: 'admin'
    });

    console.log('--------------------------------------------------');
    console.log('🚀 UTILISATEUR ADMIN CRÉÉ');
    console.log(`Email    : ${admin.email}`);
    console.log(`Username : ${admin.username}`);
    console.log('--------------------------------------------------');

  } catch (error) {
    console.error('❌ Erreur lors de la création :', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

seedAdmin();