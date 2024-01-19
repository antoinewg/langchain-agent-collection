import dotenv from "dotenv";
import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createRetrieverTool } from "langchain/tools/retriever";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { AgentExecutor, createXmlAgent } from "langchain/agents";

dotenv.config();

async function getRetrieverTool() {
	const loader = new CheerioWebBaseLoader(
		"https://docs.smith.langchain.com/overview",
	);
	const rawDocs = await loader.load();

	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 200,
	});
	const docs = await splitter.splitDocuments(rawDocs);

	const vectorstore = await MemoryVectorStore.fromDocuments(
		docs,
		new OpenAIEmbeddings(),
	);
	const retriever = vectorstore.asRetriever();

	return createRetrieverTool(retriever, {
		name: "langsmith_search",
		description:
			"Search for information about LangSmith. For any questions about LangSmith, you must use this tool!",
	});
}

export async function main() {
	console.log("Hello from agent agent-rag-chat-tools-claude !");

	const retrieverTool = await getRetrieverTool();
	const tools = [new TavilySearchResults({ maxResults: 2 }), retrieverTool];

	const llm = new ChatAnthropic({ modelName: "claude-2.1", temperature: 0 });
	const prompt = await pull<ChatPromptTemplate>("hwchase17/xml-agent-convo");
	const agent = await createXmlAgent({ llm, tools, prompt });

	const agentExecutor = new AgentExecutor({
		agent,
		tools,
		handleParsingErrors: true,
	});

	const question =
		// this test conversation history
		"Start your answer by remining by my name. " +
		// this is to check that the tool `retrieverTool` is working
		"Also how can langsmith help with testing ? " +
		// this is to check that the tool `TavilySearchResults` is working
		"And what's the weather in Paris ?";

	const result = await agentExecutor.invoke({
		input: question,
		chat_history:
			"Human: Hi! My name is Cob\nAI: Hello Cob! How can I assist you today?",
	});

	console.log(result);
	/**
	 * Hello Cob! LangSmith can help with testing by providing automated tests to ensure software quality and reliability. As for the weather in Paris, it looks to be around 23 degrees Fahrenheit and clear at the moment, with highs around 36-50 degrees Fahrenheit over the next few days.
	 */
}

/**
 * Before running this agent, make sure to have the necessary environment variables:
 * - `ANTHROPIC_API_KEY`
 * - `TAVILY_API_KEY`
 */
main();
