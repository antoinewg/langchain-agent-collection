import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createRetrieverTool } from "langchain/tools/retriever";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";

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
	console.log("Hello from agent agent-rag-chat-tools-gpt4 !");

	const retrieverTool = await getRetrieverTool();
	const tools = [new TavilySearchResults({ maxResults: 2 }), retrieverTool];

	const llm = new ChatOpenAI({ modelName: "gpt-4", temperature: 0 });
	const prompt = await pull<ChatPromptTemplate>(
		"hwchase17/openai-functions-agent",
	);
	const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt });

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
		chat_history: [
			new HumanMessage("hi! my name is Cob."),
			new AIMessage("Hello Cob! How can I assist you today?"),
		],
	});

	console.log(result);
	/**
	 * Hello Cob! LangSmith can be a great help with testing. It provides several features that can assist in debugging, monitoring, and improving the performance of your application. \n' +
    '\n' +
    'For debugging, LangSmith can help you understand the exact input to the Language Model (LLM), why an agent is looping, why a chain was slower than expected, and how many tokens an agent used. It can also help you monitor your application in production by logging all traces, visualizing latency and token usage statistics, and troubleshooting specific issues as they arise. \n' +
    '\n' +
    'LangSmith also allows you to associate feedback programmatically with runs. If your application has a thumbs up/down button on it, you can use that to log feedback back to LangSmith. This can be used to track performance over time and pinpoint underperforming data points, which you can subsequently add to a dataset for future testing.\n' +
    '\n' +
    "As for the weather in Paris, it is currently sunny with a temperature of 3.0°C (37.4°F). The wind is coming from the NNE at 6.8 kph (4.3 mph). The humidity is at 70%. Please note that weather conditions can change rapidly, so it's always a good idea to check a reliable source shortly before you go out.
	 */
}

/**
 * Before running this agent, make sure to have the necessary environment variables:
 * - `OPENAI_API_KEY`
 * - `TAVILY_API_KEY`
 */
main();
