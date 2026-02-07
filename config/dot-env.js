require('dotenv').config();

const allowedOrigins = [
    process.env.PUBLIC_URL_WHITELISTED,
    process.env.ADMIN_URL_WHITELISTED,
    process.env.CLIENT_BASE_URL,
    process.env.CLIENT_ADMIN_BASE_URL,
    "https://sassou.sm-digitalizer.fr",
    "https://www.sassou.sm-digitalizer.fr",
    "https://admin-sassou.sm-digitalizer.fr",
    "https://www.admin-sassou.sm-digitalizer.fr"
].filter(url => url);

module.exports = {
    port: process.env.PORT || 3000,
    environment: process.env.ENVIRONMENT,
    tokenLifeTimeOnLogin: process.env.TOKEN_LIFE_TIME_ON_LOGIN,
    db: {
        name: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    },
    admin: {
        email: process.env.FIRST_ADMIN_EMAIL,
        username: process.env.FIRST_ADMIN_USERNAME,
        password: process.env.FIRST_ADMIN_PASSWORD
    },
    cloudinary: {
        name: process.env.CLOUDINARY_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        challengeFolder: process.env.CLOUDINARY_CHALLENGE_FOLDER
    },
    rsa: {
        publicKeyFilename: process.env.RSA_PUBLIC_KEY_FILENAME,
        privateKeyFilename: process.env.RSA_PRIVATE_KEY_FILENAME,
        keysDir: process.env.RSA_KEYS_DIR
    },
    urlWhiteListed: allowedOrigins
};
