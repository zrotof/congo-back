const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { rsa, db, port } = require('../config/dot-env');
const targetDir = path.join(__dirname, "..", rsa.keysDir);
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Create the public key file
fs.writeFileSync(path.join(targetDir, rsa.publicKeyFilename), publicKey);

// Create the private key file
fs.writeFileSync(path.join(targetDir, rsa.privateKeyFilename), privateKey);