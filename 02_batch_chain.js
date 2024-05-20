import { config } from "dotenv";
config();

import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });
const promptTemplate = PromptTemplate.fromTemplate(
  "Raconte moi une blague sur un {topic}"
);

const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

const result = await chain.batch([{ topic: "ours" }, { topic: "chat" }]);

console.log(result);
