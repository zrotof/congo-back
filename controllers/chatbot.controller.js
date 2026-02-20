const chatbotService = require('../services/chatbot.service');

exports.chat = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ 
        status: 'error',
        message: "La question est requise" 
      });
    }

    const responseText = await chatbotService.processQuestion(question);

    return res.status(200).json({
      status: 'success',
      response: responseText
    });

  } catch (error) {
    // Si c'est une erreur connue du service, on renvoie une 500 propre
    console.error("Erreur Controller Chatbot:", error);
    return res.status(500).json({
      status: 'error',
      message: "Une erreur interne est survenue lors du traitement de la demande."
    });
  }
};