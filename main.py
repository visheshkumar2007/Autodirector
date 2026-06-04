import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)

from pydantic import BaseModel, Field
from typing import List
from groq import AsyncGroq

raw_key = os.getenv("GROQ_API_KEY", "").strip()
if not raw_key or raw_key == "your_api_key_goes_here":
    raise ValueError(f"Missing or placeholder GROQ_API_KEY in {BASE_DIR}/.env")

client = AsyncGroq(api_key=raw_key)

app = FastAPI(title="The Auto-Director API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StoryRequest(BaseModel):
    seed_idea: str

class ActOutline(BaseModel):
    title: str
    description: str

class ScreenplayOutline(BaseModel):
    title: str
    genre: str
    act_1: ActOutline
    act_2: ActOutline
    act_3: ActOutline

class ShotDetail(BaseModel):
    shot_number: int
    camera_angle: str
    visual_prompt: str = Field(
        description="A rich, descriptive scene prompt suitable for an image generator. "
                    "Include subject, setting, mood, lighting, and color. Max 150 words."
    )
    unsplash_keyword: str = Field(
        description="1-2 word fallback keyword (not used anymore, keep for schema compat)"
    )

class SceneDetail(BaseModel):
    scene_number: int
    location: str
    shots: List[ShotDetail]

class ActCinematography(BaseModel):
    act_title: str
    scenes: List[SceneDetail]

class FullCinematographyPlan(BaseModel):
    movie_title: str
    act_1_breakdown: ActCinematography
    act_2_breakdown: ActCinematography
    act_3_breakdown: ActCinematography


def clean_json(raw: str) -> dict:
    text = raw.strip()
    for prefix in ("```json", "```"):
        if text.startswith(prefix):
            text = text[len(prefix):]
            break
    if text.endswith("```"):
        text = text[:-3]
    return json.loads(text.strip())

@app.get("/")
async def root():
    return {"status": "Auto-Director API running"}

@app.post("/generate-story", response_model=ScreenplayOutline)
async def generate_story(request: StoryRequest):
    try:
        system_prompt = f"""
You are a world-class Hollywood Screenwriter.
Expand the seed idea into a compelling 3-Act feature film outline.

CRITICAL: Return ONLY valid JSON — no markdown, no preamble — matching this schema exactly:
{json.dumps(ScreenplayOutline.model_json_schema(), indent=2)}
"""
        r = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": f"Seed Idea: {request.seed_idea}"},
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
        )
        return clean_json(r.choices[0].message.content)
    except Exception as e:
        print(f"[Agent 1] {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-cinematography", response_model=FullCinematographyPlan)
async def generate_cinematography(screenplay: ScreenplayOutline):
    try:
        system_prompt = f"""
You are an expert Hollywood Director of Photography.
Break this screenplay into a highly detailed visual storyboard plan.

RULES:
1. Every Act  → EXACTLY 3 Scenes.
2. Every Scene → EXACTLY 3 Shots.
3. For each shot write a rich visual_prompt (subject, setting, lighting, mood, colors, ~60-100 words)
   that will be sent directly to an AI image generator.
4. camera_angle must be a real cinematography term (e.g. "extreme close-up", "dutch angle", "bird's eye view").
5. unsplash_keyword: just a 1-2 word placeholder (e.g. "city night").

CRITICAL: Return ONLY valid JSON — no markdown — matching this schema exactly:
{json.dumps(FullCinematographyPlan.model_json_schema(), indent=2)}
"""
        user_content = f"""
Movie Title: {screenplay.title}
Genre: {screenplay.genre}
ACT 1: {screenplay.act_1.title} — {screenplay.act_1.description}
ACT 2: {screenplay.act_2.title} — {screenplay.act_2.description}
ACT 3: {screenplay.act_3.title} — {screenplay.act_3.description}
"""
        r = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_content},
            ],
            response_format={"type": "json_object"},
            temperature=0.6,
        )
        return clean_json(r.choices[0].message.content)
    except Exception as e:
        print(f"[Agent 2] {e}")
        raise HTTPException(status_code=500, detail=str(e))