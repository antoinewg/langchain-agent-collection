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
<summary>`agent-rag-chat-tools-gpt4`</summary>
Conversational agent with document retriever, and web tool. Using OpenAI's GPT4 model.

See code [here](./agent-rag-chat-tools-gpt4/index.ts)
Run with `ts-node agent-rag-chat-tools-gpt4`
</details>

<details>
<summary>`agent-rag-chat-tools-claude`</summary>
Conversational agent with document retriever, and web tool. Using Anthropic's Claude 2.1 model.

See code [here](./agent-rag-chat-tools-claude/index.ts)
Run with `ts-node agent-rag-chat-tools-claude`
</details>

<details>
<summary>`agent-rag-chat-tools-gpt4-streaming`</summary>
Conversational agent with document retriever, and web tool. Using OpenAI's GPT4 model.
The output can be streamed to the user.

See code [here](./agent-rag-chat-tools-gpt4-streaming/index.ts)
Run with `ts-node agent-rag-chat-tools-gpt4-streaming`
</details>

## Disclaimer

Running those scripts will incur service fees from Anthropic/OpenAI.
Results are not guaranteed, this repo should be used only as a list of examples that can be adapted to specific use cases.

## Sources

Most of the code comes and is based from the langchain [documentation](https://js.langchain.com/docs/modules/agents/quick_start).
Make sure to check it out.
