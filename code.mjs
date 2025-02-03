// ================================================================
// ================================================================
import readline from "readline";
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
const model = "gpt-4o";
const filename = `${model}.json`;
const openai = new OpenAI({ apiKey: process.env.OAPI, baseURL: "https://api.sree.shop/v1" });
async function getOpenAIResponse(messages) {
  try {
    const response = await openai.chat.completions.create({ model: model, messages: messages });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in getting response:", error);
    return null;
  }
}
function loadContext(filename) {
  try {
    if (fs.existsSync(filename)) {
      const data = fs.readFileSync(filename, "utf8");
      const context = JSON.parse(data);
      if (!context.messages) context.messages = [];
      return context;
    } else return { messages: [] };
  } catch (error) {
    console.error("Error loading context:", error);
    return { messages: [] };
  }
}
(async () => {
  console.clear();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const context = loadContext(filename);
  rl.on("line", async (userMessage) => {
    context.messages.push({ role: "user", content: userMessage });
    const response = await getOpenAIResponse(context.messages);
    if (response) {
      console.clear();
      console.log("Assistant:", response);
      context.messages.push({ role: "assistant", content: response });
      fs.writeFileSync(filename, JSON.stringify(context, null, 2));
    }
  });
})();
// ================================================================
// ================================================================
