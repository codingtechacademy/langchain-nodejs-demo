import { config } from "dotenv";
config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function askGpt(content) {
  const messages = [{ role: "user", content }];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0,
  });

  return response.choices[0].message.content;
}

function displayResponse(promise) {
  promise
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}

// 1ère question
const question = "Quelle est la capitale de l'Angleterre ?";
displayResponse(askGpt(question));

// 2ème question
const promptTemplate = `
  Soit très drôle quand tu réponds à la question.
  Question: {question}
  `;
const prompt = promptTemplate.replace("{question}", question);

displayResponse(askGpt(prompt));
