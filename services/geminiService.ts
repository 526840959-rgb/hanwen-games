import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
你是一个专业的宝可梦对战专家助手。你的名字叫“洛托姆图鉴”。
- 你的回答应该简洁、有趣，并富含宝可梦世界的知识。
- 能够识别图片中的宝可梦（如果用户提供）。
- 如果用户询问策略，请给出详细的战术建议。
- 说话语气要像一个热心的助手，偶尔可以带一点“洛托”口癖。
`;

export const sendGeminiMessage = async (
  messages: ChatMessage[], 
  newPrompt: string, 
  imageBase64?: string,
  useThinking: boolean = false
): Promise<string> => {
  try {
    const modelId = 'gemini-3-pro-preview';
    
    // Prepare contents
    // History context is good, but for simplicity in this demo wrapper 
    // we will construct a single turn or limited history if needed.
    // For specific "Thinking" requests or "Image" requests, single turn often works best 
    // unless we maintain a complex chat session object.
    
    const parts: any[] = [];
    
    // If there is an image, add it
    if (imageBase64) {
      // Clean base64 string if it contains data prefix
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg', // Assuming jpeg/png generic
          data: cleanBase64
        }
      });
    }

    parts.push({ text: newPrompt });

    // Configure model
    const config: any = {
      systemInstruction: SYSTEM_INSTRUCTION,
    };

    if (useThinking) {
      // MUST use thinkingBudget: 32768 for complex queries
      // And MUST NOT set maxOutputTokens (handled by not setting it)
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    // Since we are using a fresh call for simplicity (or managing history manually),
    // we use ai.models.generateContent. 
    // If we wanted chat history, we would reconstruct the `contents` array with history.
    // For this implementation, let's include simplified history in the prompt 
    // or just the current message if it's a specific task like "Analyze this image".
    
    // Let's build full content with history for better chat experience
    const historyParts = messages.map(m => ({
       role: m.role,
       parts: [{ text: m.text }] // Note: We skip re-sending old images to save bandwidth/complexity
    }));

    const contents = [
      ...historyParts,
      { role: 'user', parts: parts }
    ];

    const response = await ai.models.generateContent({
      model: modelId,
      contents: contents,
      config: config
    });

    return response.text || "洛托姆暂时无法连接到服务器洛托...";
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "发生错误了洛托！请检查网络或API Key。";
  }
};
