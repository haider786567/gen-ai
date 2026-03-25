import dotenv from "dotenv";
dotenv.config();
import readline from "readline";
import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent,tool, HumanMessage } from "langchain";
import {getWebData} from "./internet.service.js";
import * as z from "zod";

const webTool  = tool(
  getWebData,
  {
    name:"webTool",
    description:"use this tool to get data from web",
    inputSchema: z.object({
      question: z.string().describe("the search query to fetch data from the web"),
    }),
  }
)


export function askUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {

      rl.close();
      resolve(answer.trim());
    });
  });
}




const model = new ChatMistralAI({
model: "mistral-small-latest",
});

const agent = createAgent({
  model,
  tools:[webTool],
  systemPrompt:"You are a helpful assistant that can fetch data from the web using the webTool tool. Always use the tool when you need to fetch information from the web. Answer questions to the best of your ability using the tools at your disposal."
})



const messages = []
while(true){
  const userInput = await askUser("You:");
  messages.push(new HumanMessage(userInput))
  const response = await agent.invoke({
    messages
  });
  messages.push(response.messages[response.messages.length - 1]);
  console.log("Ai:", response.messages[response.messages.length - 1].content);
}
