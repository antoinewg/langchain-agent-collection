# langchain-agent-collection

This repository is aimed at testing a few agents from langchain, with different use cases.

## Installation

Install dependencies with `pnpm i`.
Make sure `ts-node` is installed globally.
Add environment variables as prescribed by each agent in `.env`.

Run the agent script you want to try `ts-node agent-rag-chat-tools-gpt4`

## Templates

Here's the list of templates currenlty available. Feel free to open up a PR to add one.

<details>
<summary>agent-rag-chat-tools-gpt4</summary>
Conversational agent with document retriever, and web tool. Using OpenAI's GPT4 model.
</details>

<details>
<summary>agent-rag-chat-tools-claude</summary>
Conversational agent with document retriever, and web tool. Using Anthropic's Claude 2.1 model.
</details>

<details>
<summary>agent-rag-chat-tools-gpt4-streaming</summary>
Conversational agent with document retriever, and web tool. Using OpenAI's GPT4 model.
The output can be streamed to the user.
</details>
