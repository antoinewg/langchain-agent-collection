import dotenv from "dotenv";

dotenv.config();

export async function main() {
  console.log("Hello from agent agent-rag-chat-tools-claude !")
}

/**
 * Before running this agent, make sure to have the necessary environment variables:
 * - `ANTHROPIC_API_KEY`
 * - `TAVILY_API_KEY`
 */
main()
