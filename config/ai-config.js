require('dotenv').config();
const path = require('path');
const { geminiApiKey } = require('./dot-env')

module.exports = {
  apiKey: geminiApiKey,
  modelName: 'gemini-2.5-flash', 
  
  get apiUrl() {
    return `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
  },

  search: {
    jsonPath: path.join(__dirname, '../public/data/knowledge.json'),    
    options: {
      keys: ['keywords', 'category', 'content'],
      threshold: 0.6,
      ignoreLocation: true
    },    
    limit: 8 
  },

  prompt: {
    role: "Tu es l'assistant virtuel officiel de la campagne du Président Denis Sassou N'Guesso.",
    tone: "Ton ton doit être : Poli, Encouragent, Institutionnel et précis.",
    fallbackMessage: "Je suis désolé, je n'ai pas trouvé d'information spécifique à ce sujet dans le projet de société. Pouvez-vous reformuler ?"
  }
};