from fastapi import FastAPI, Request
from pydantic import BaseModel, Field # data checker kinda lib.. like ap validation customize kr rahe hoge k kia accept krna and kia nai krna accept
from fastapi.middleware.cors import CORSMiddleware # * cors == cross-origin resource sharing
from agent import ask_agent
import logging
import time

# logging setup for monitoring requests
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"], # * safer: allow_origin = ["localhost:3000, nananani.com"]
    allow_credentials = True, # without it browser may block auth data.. basically ap sb allow kr rahe hote to come (cookies, header, sessions)
    allow_methods = ["*"], # accept all http header methods
    allow_headers = ["*"] # allow any customer request header
)


# middleware to log every incoming request with timing
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    logger.info(f"{request.method} {request.url.path} -> {response.status_code} ({duration}ms)")
    return response


class ChatRequest(BaseModel): # defines DTO (data transfer object)
    message: str = Field(..., max_length=1000) # validated max length for safety
class ChatResponse(BaseModel):
    response: str


@app.get("/health") # health check endpoint for monitoring/uptime checks
async def health():
    return {"status": "healthy"}


@app.post("/chat", response_model = ChatResponse)
async def chat(req: ChatRequest):
    try:
        reply = await ask_agent(req.message)
        return {"response": reply}
    except Exception as e:
        logger.error(f"Agent error: {str(e)}")
        return {"response": "Sorry, something went wrong. Please try again."}