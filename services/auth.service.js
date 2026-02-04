const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Chargement des clés RSA (Assure-toi que les fichiers existent dans ton dossier config ou certs)
const pathToPrivKey = path.join(__dirname, '..', 'rsa-keys', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf8');

class AuthService {
    /**
     * Génère un JWT pour un membre du Staff
     * @param {Object} staff - L'objet staff issu de la DB
     */
    issueJWT(staff) {
        const _id = staff.id;
        const expiresIn = '1d'; // Le token expire après 24h

        const payload = {
            sub: _id,
            iat: Math.floor(Date.now() / 1000),
            username: staff.username,
            role: 'staff' // Pour tes futures vérifications de permissions
        };

        // Signature avec l'algorithme RS256 (Clé Privée)
        const signedToken = jwt.sign(payload, PRIV_KEY, { 
            expiresIn: expiresIn, 
            algorithm: 'RS256' 
        });

        return {
            token: signedToken,
            expires: expiresIn
        };
    }

    /**
     * Optionnel : Méthode pour vérifier si un token est blacklisté 
     * (si tu décides d'ajouter une sécurité supplémentaire au logout)
     */
    async isTokenValid(token) {
        // Logique de vérification supplémentaire si nécessaire
        return true;
    }
}

module.exports = new AuthService();