const { GoogleGenerativeAI } = require("@google/generative-ai");
const Fuse = require("fuse.js");
const fs = require('fs');
const aiConfig = require('../config/ai-config');

class ChatbotService {
  constructor() {
    this.fuse = null;
    this.genAI = null;
    this.model = null;
    this.knowledgeBase = [];
    
    this.init();
  }

  /**
   * Initialisation : Charge JSON + Prépare SDK Google
   */
  init() {
    try {
      // 1. Charger les données
      const rawData = fs.readFileSync(aiConfig.search.jsonPath, 'utf8');
      this.knowledgeBase = JSON.parse(rawData);
      
      // 2. Init Fuse.js
      this.fuse = new Fuse(this.knowledgeBase, aiConfig.search.options);
      
      // 3. Init SDK Google
      if (aiConfig.apiKey) {
        this.genAI = new GoogleGenerativeAI(aiConfig.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: aiConfig.modelName });
        console.log(`🤖 [ChatbotService] Prêt (Modèle: ${aiConfig.modelName} | Entrées: ${this.knowledgeBase.length})`);
      } else {
        console.warn("⚠️ [ChatbotService] Clé API manquante !");
      }

    } catch (error) {
      console.error("❌ [ChatbotService] Erreur init:", error.message);
    }
  }

  /**
   * Traite la question utilisateur
   */
  async processQuestion(question) {
    if (!this.fuse || !this.model) {
      throw new Error("Service Chatbot non initialisé ou clé API invalide.");
    }

    // 1. Recherche de contexte (RAG)
    const context = this.findContext(question);

    if (!context) {
      return aiConfig.prompt.fallbackMessage;
    }

    // 2. Appel IA
    return await this.generateResponse(question, context);
  }

  /**
   * Trouve le contexte pertinent
   */
  findContext(question) {
    const results = this.fuse.search(question, { limit: aiConfig.search.limit });
    if (results.length === 0) return null;
    return results.map(r => r.item.content).join("\n\n");
  }

  /**
   * Génère la réponse avec le SDK Google
   */
  async generateResponse(question, context) {
    const prompt = `
      RÔLE: ${aiConfig.prompt.role}
      TON: ${aiConfig.prompt.tone}
      
      CONTEXTE OFFICIEL (Extrait du projet de société) :
      """
      ${context}
      """
      
      QUESTION DU CITOYEN :
      "${question}"
      
      CONSIGNE :
      Réponds à la question en utilisant UNIQUEMENT les informations du CONTEXTE OFFICIEL ci-dessus.
      N'invente rien. Si la réponse n'est pas dans le contexte, dis poliment que ce point précis n'est pas détaillé ici.
      Fais une réponse concise.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("❌ [ChatbotService] Erreur SDK Google:", error.message);
      // Fallback
      return "Le système intelligent est momentanément indisponible. Voici les extraits trouvés :\n" + context;
    }
  }
}

module.exports = new ChatbotService();