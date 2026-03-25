import dotenv from "dotenv";
dotenv.config();
import { tavily } from "@tavily/core";
const tavlyClinet = tavily({
    apiKey: process.env.TAVILY_API_KEY,
});
export  async function getWebData(question) {
    
    const search = await tavlyClinet.search(question);
    return "here is data from web" + search.results[0].content;

}