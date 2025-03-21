
const OpenAI = require('openai');
const DetectionResult = require('../models/DetectionResult');

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Humanizes text using OpenAI's API
 * @param {string} text - The text to humanize
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Humanization results
 */
async function humanizeText(text, userId = 'anonymous') {
  try {
    let humanizedText;
    let note;
    
    // If no OpenAI API key is provided, use mock humanization
    if (!process.env.OPENAI_API_KEY) {
      console.warn('No OpenAI API key provided. Using mock humanization.');
      const mockResult = mockHumanization(text);
      humanizedText = mockResult.humanizedText;
      note = mockResult.note;
    } else {
      // Use OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an assistant that rewrites text to sound more natural and human-like. Maintain the original meaning but make the text flow better, use varied sentence structures, and eliminate patterns typical of AI-generated content."
          },
          {
            role: "user",
            content: `Rewrite the following text to sound more human-like, natural, and less like AI-generated content: \n\n${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });
      
      humanizedText = response.choices[0].message.content.trim();
    }

    // Find if there's an existing record for this text from the same user
    let detectionResult = await DetectionResult.findOne({ 
      userId, 
      originalText: text 
    }).sort({ timestamp: -1 });
    
    // If a record exists, update it with the humanized text
    if (detectionResult) {
      detectionResult.humanizedText = humanizedText;
      await detectionResult.save();
    } else {
      // If no record exists, create a new one
      detectionResult = new DetectionResult({
        userId,
        originalText: text,
        humanizedText,
        timestamp: new Date()
      });
      await detectionResult.save();
    }

    // Return the humanized text
    return {
      originalText: text,
      humanizedText,
      textLength: text.length,
      timestamp: detectionResult.timestamp.toISOString(),
      resultId: detectionResult._id,
      note
    };
  } catch (error) {
    console.error('Error in OpenAI API call:', error);
    
    // Fallback to mock humanization if API call fails
    console.warn('OpenAI API call failed. Using mock humanization.');
    const mockResult = mockHumanization(text);
    
    // Save mock result to database
    const detectionResult = new DetectionResult({
      userId,
      originalText: text,
      humanizedText: mockResult.humanizedText,
      timestamp: new Date()
    });
    await detectionResult.save();
    
    return {
      originalText: text,
      humanizedText: mockResult.humanizedText,
      textLength: text.length,
      timestamp: detectionResult.timestamp.toISOString(),
      resultId: detectionResult._id,
      note: mockResult.note
    };
  }
}

/**
 * Mock humanization function for when API key is missing or API call fails
 * @param {string} text - The text to humanize
 * @returns {Object} Mock humanization results
 */
function mockHumanization(text) {
  // Very basic modifications to demonstrate the concept
  const mockedHumanizedText = text
    // Add some filler words
    .replace(/\. /g, '. Well, ')
    // Add some hesitations
    .replace(/\, /g, ', um, ')
    // Add some contractions
    .replace(/it is/g, "it's")
    .replace(/they are/g, "they're")
    .replace(/we are/g, "we're")
    .replace(/do not/g, "don't")
    .replace(/cannot/g, "can't");
  
  return {
    humanizedText: mockedHumanizedText,
    note: "This is a mock humanization since the OpenAI API key is not configured or the API call failed."
  };
}

module.exports = {
  humanizeText
};
