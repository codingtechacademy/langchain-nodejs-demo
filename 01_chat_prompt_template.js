import { config } from "dotenv";
config();

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const prompt = ChatPromptTemplate.fromTemplate(
  "Soit très drôle quand tu réponds à la question\n Question: {question}"
);
const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });
const chain = prompt.pipe(model);

const response = await chain.invoke({
  question: "Quelle est la capitale de l'Angleterre ?",
});

console.log(response.content);
