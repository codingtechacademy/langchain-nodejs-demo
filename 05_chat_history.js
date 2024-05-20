import { config } from "dotenv";
config();

import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });

const messageHistories = {};

const prompt = ChatPromptTemplate.fromMessages([
  ["system", `Tu es un chatbot utile`],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

const withMessageHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: async (sessionId) => {
    if (!messageHistories[sessionId]) {
      messageHistories[sessionId] = new InMemoryChatMessageHistory();
    }
    return messageHistories[sessionId];
  },
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});

const historyConfig = {
  configurable: {
    sessionId: "mySessionKey",
  },
};

const response = await withMessageHistory.invoke(
  {
    input: "Bonjour, mon prénom est Thibaud !",
  },
  historyConfig
);

console.log(response);

const followupResponse = await withMessageHistory.invoke(
  {
    input: "Quel est mon prénom ?",
  },
  historyConfig
);

console.log(followupResponse);
