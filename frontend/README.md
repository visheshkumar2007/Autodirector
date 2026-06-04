## 📖 About The Project

Most aspiring storytellers and creators have compelling ideas but struggle to translate them into structured, visually rich narratives. The Auto-Director is an AI-powered system that solves this by transforming a simple single-line seed idea into a fully structured, visually interpretable 3-act cinematic storyboard.

Instead of plain text or tables, the user receives their storyboard in an immersive **Vertical Cinematic Feed**, complete with generated imagery, scene breakdowns, and even voiceover capabilities.

---

## 🤖 The Multi-Agent Pipeline

The backend simulates a professional Hollywood production team using a multi-agent AI pipeline:

* **Agent 1: The Screenwriter:** Expands the initial seed idea into a structured 3-Act narrative (Setup, Conflict, Resolution).
* **Agent 2: The Cinematographer:** Breaks down each Act into exactly 3 Scenes, and each Scene into exactly 3 Shots, detailing specific camera angles and rich visual prompts.
* **Agent 3: The Visual Artist:** Utilizes Pollinations Flux AI to instantly generate a visual representation for every single shot based on the Cinematographer's descriptions.

---

## ✨ Key Features

* **Zero-Friction Input:** Type a single sentence, select a genre, and let the AI do the heavy lifting.
* **Dynamic Image Generation:** Seamlessly fetches AI-generated visuals for all 27 storyboard shots.
* **Cinematography Logic:** Automatically assigns accurate camera angles (e.g., Wide Shot, Close-up) to fit the narrative.
* **Interactive Voiceover:** Built-in Web Speech API integration reads out the visual prompts like a director pitching the scene.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (React), TypeScript, CSS
* **Backend:** Python, FastAPI, Uvicorn
* **LLM Engine:** Llama-3.3-70b-versatile via Groq API (for blazing-fast JSON schema generation)
* **Image Generation:** Pollinations Flux AI



---

## 🎯 Use Cases

* Film pre-production planning
* Short film ideation
* Storyboarding
* Ad film planning
* YouTube video planning
* Creative writing

---


---

**Built by Vishesh Kumar**

