import { config } from "dotenv";
config();

import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { formatDocumentsAsString } from "langchain/util/document";

const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });

const vectorStore = await HNSWLib.fromTexts(
  [
    "Le restaurant 'Le Magnifique' ouvre du lundi au vendredi de 12h à 14h et de 18h à 22h.",
  ],
  [{ id: 1 }],
  new OpenAIEmbeddings()
);
const retriever = vectorStore.asRetriever(1);

const prompt =
  PromptTemplate.fromTemplate(`Répond à la question en te basant uniquement sur le contexte suivant:
{context}

Question: {question}`);

const chain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

const result = await chain.invoke(
  "Le restaurant 'Le Magnifique' est il ouvert vendredi à 15h ?"
);

console.log(result);
