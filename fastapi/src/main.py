from g4f.client import Client
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import uvicorn

app = FastAPI()

origins = [
    "https://shop.c4ei.net",
    "http://localhost:3021",
    "localhost:3021"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Client()

@app.get("/api/v1/chatbot")
async def chatbot(message: str = "안녕하세요"):
    chat_completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        # model="gpt-4",
        messages=[{"role": "user", "content": message}], 
        stream=True
    )
    
    response = ""
    for completion in chat_completion:
        response += completion.choices[0].delta.content or ""
        
    return {"response": response}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=80, loop="asyncio")