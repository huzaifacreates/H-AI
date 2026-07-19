from agents import Agent, Runner, AsyncOpenAI, OpenAIChatCompletionsModel, set_tracing_disabled
import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

set_tracing_disabled(True)

api_key = os.environ.get("GROQ_API_KEY")
model_name = os.environ.get("MODEL", "openai/gpt-oss-20b") # model name from env, falls back to default

provider = AsyncOpenAI(
    api_key = api_key,
    base_url = "https://api.groq.com/openai/v1"
)

model = OpenAIChatCompletionsModel(
    model = model_name,
    openai_client = provider
)

agent = Agent(
    name = "Huzaifa",
    instructions = "You are a helpful assistant. Respond in clean plain text only. Do NOT use markdown, bullet points, asterisks, dashes, or any special formatting. Write natural, conversational sentences.",
    model = model
)


async def ask_agent(userInput: str):
    try:
        result = await asyncio.wait_for(Runner.run(agent, userInput), timeout=30.0) # 30s timeout to avoid hanging
        return result.final_output
    except asyncio.TimeoutError:
        return "The request timed out. Please try again."

