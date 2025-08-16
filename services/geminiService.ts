import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getMotivationalQuote = async (): Promise<string> => {
  const fallbackQuote = "Believe you can and you're halfway there. - Theodore Roosevelt";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Generate a short, powerful motivational quote for a student preparing for an important exam.',
      config: {
        temperature: 0.9,
      }
    });
    const text = response.text?.trim();
    return text || fallbackQuote;
  } catch (error) {
    console.error("Error fetching motivational quote:", error);
    return fallbackQuote;
  }
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[] | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a 5-question multiple-choice quiz on the topic "${topic}". Each question should have 4 options. Indicate the correct answer index (0-3).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: {
                    type: Type.STRING,
                    description: "The quiz question."
                  },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "An array of 4 possible answers."
                  },
                  correctAnswer: {
                    type: Type.INTEGER,
                    description: "The index (0-3) of the correct answer in the options array."
                  }
                },
                required: ["question", "options", "correctAnswer"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const jsonString = response.text.trim();
    if (jsonString) {
      const parsed = JSON.parse(jsonString);

      if (parsed && Array.isArray(parsed.questions)) {
          return parsed.questions as QuizQuestion[];
      }
      
      console.error("Unexpected JSON structure from Gemini API:", parsed);
    }
    return null;

  } catch (error) {
    console.error("Error generating quiz:", error);
    return null;
  }
};

export const getFormulasAndShortcuts = async (topic: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Provide a concise list of important formulas, shortcuts, and/or grammar rules for the topic "${topic}". Use basic markdown for formatting (e.g., headings, bold text, lists).`,
            config: {
                temperature: 0.2,
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error fetching formulas:", error);
        return "Sorry, I couldn't fetch the formulas for that topic. Please try again.";
    }
};

export const generateReasoningPuzzle = async (puzzleType: string): Promise<{ puzzle: string; solution: string } | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a short reasoning puzzle based on the topic: "${puzzleType}". The puzzle should be a single block of text. The solution should also be a single block of text.`,
             config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        puzzle: { type: Type.STRING, description: "The puzzle question or scenario." },
                        solution: { type: Type.STRING, description: "The detailed solution to the puzzle." }
                    },
                    required: ["puzzle", "solution"]
                }
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating puzzle:", error);
        return null;
    }
};

export const getPerformanceAnalysis = async (topic: string, score: number, totalQuestions: number): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `A student just completed a quiz on the topic "${topic}" and scored ${score} out of ${totalQuestions}. Based on this, provide a short, encouraging, and personalized suggestion for what they should focus on next. For example, if the score is low, suggest revising specific sub-topics. If the score is high, suggest trying more advanced problems. Keep the analysis to 2-3 sentences.`,
            config: {
                temperature: 0.7,
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error getting performance analysis:", error);
        return "Could not generate AI suggestion at this time.";
    }
};

export const extractTextFromImage = async (base64Image: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
            },
        };
        const textPart = {
            text: 'Extract all handwritten and printed text from this image. Provide only the extracted text, preserving line breaks.'
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });
        
        return response.text.trim();
    } catch (error) {
        console.error("Error extracting text from image:", error);
        return "Sorry, I couldn't read the text from that image. Please try again with a clearer picture.";
    }
};