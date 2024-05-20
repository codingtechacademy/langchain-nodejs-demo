import { config } from "dotenv";
config();

import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });

const prompt1 = PromptTemplate.fromTemplate(
  `De quelle ville est originaire {person} ? Répond uniquement avec le nom de la ville.`
);

const prompt2 = PromptTemplate.fromTemplate(
  `Dans quel pays se trouve la ville {city} ? Répond en {language}.`
);

const chain = prompt1.pipe(model).pipe(new StringOutputParser());

const composedChain = new RunnableLambda({
  func: async (input) => {
    const result = await chain.invoke(input);
    return { city: result, language: input.language };
  },
})
  .pipe(prompt2)
  .pipe(model)
  .pipe(new StringOutputParser());

const result = await composedChain.invoke({ person: "Obama", language: "Anglais" });

console.log(result);