"use client";

import { useState } from "react";

interface ShotDetail {
  shot_number: number;
  camera_angle: string;
  visual_prompt: string;
  unsplash_keyword: string;
  image_url?: string;
}
interface SceneDetail {
  scene_number: number;
  location: string;
  shots: ShotDetail[];
}
interface ActCinematography {
  act_title: string;
  scenes: SceneDetail[];
}
interface FullCinematographyPlan {
  movie_title: string;
  act_1_breakdown: ActCinematography;
  act_2_breakdown: ActCinematography;
  act_3_breakdown: ActCinematography;
}

function ShotImage({ shot, seed }: { shot: ShotDetail; seed: number }) {
  const [attempt, setAttempt]   = useState(0);  // 0 = original, 1 = retry
  const [status, setStatus]     = useState<"loading" | "ok" | "error">("loading");

  function getUrl(a: number): string | undefined {
    if (!shot.image_url) return undefined;
    if (a === 0) return shot.image_url;
    
    return shot.image_url.replace(/seed=\d+/, `seed=${seed + a * 3737}`);
  }

  const src = getUrl(attempt);

  const placeholders = ["#12100e", "#0d1018", "#12100e", "#0d1510", "#100d18"];
  const bg = placeholders[seed % placeholders.length];

  return (
    <div style={{
      width: "100%", height: "100%", background: bg,
      position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {}
      {status === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 2 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            border: "2px solid #2a2415", borderTopColor: "#c8a96e",
            animation: "spin 1s linear infinite",
          }} />
          <span style={{ fontSize: 10, color: "#5a4e38", letterSpacing: "0.12em" }}>
            {attempt === 0 ? "GENERATING…" : "RETRYING…"}
          </span>
        </div>
      )}

      {      }
      {status === "error" && (
        <div style={{
          padding: "14px 18px", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 8, textAlign: "center", zIndex: 2,
        }}>
          <div style={{ fontSize: 22 }}>🎞️</div>
          <p style={{ fontSize: 11, color: "#5a4e38", lineHeight: 1.6, margin: 0, maxWidth: 220 }}>
            {shot.visual_prompt.slice(0, 100)}…
          </p>
          <button
            onClick={() => { setAttempt(0); setStatus("loading"); }}
            style={{
              marginTop: 4, padding: "4px 12px", background: "transparent",
              border: "1px solid #3a2e1a", borderRadius: 6,
              cursor: "pointer", color: "#7a6840", fontSize: 11, fontFamily: "inherit",
            }}>
            ↻ Retry
          </button>
        </div>
      )}

      {}
      {src && (
        <img
          key={`${attempt}`}
          src={src}
          alt={shot.camera_angle}
          onLoad={() => setStatus("ok")}
          onError={() => {
            if (attempt === 0) {
              // Try once more with a new seed
              setAttempt(1);
              setStatus("loading");
            } else {
              setStatus("error");
            }
          }}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            opacity: status === "ok" ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />
      )}

      {}
      {status === "ok" && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)",
        }} />
      )}

      {}
      {status === "ok" && (
        <div style={{
          position: "absolute", bottom: 7, right: 8, zIndex: 2,
          background: "rgba(0,0,0,0.5)", borderRadius: 3,
          padding: "2px 6px", fontSize: 9, color: "#5a4e38", letterSpacing: "0.1em",
        }}>
          FLUX · AI
        </div>
      )}
    </div>
  );
}


function StepPill({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: done || active ? 1 : 0.3, transition: "opacity 0.4s" }}>
      <div style={{
        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
        background: done ? "#c8a96e" : active ? "#fff" : "transparent",
        border: `1.5px solid ${done ? "#c8a96e" : active ? "#fff" : "#444"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 700,
        color: done || active ? "#1a1207" : "#666",
        transition: "all 0.4s",
      }}>
        {done ? "✓" : n}
      </div>
      <span style={{
        fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
        color: active ? "#fff" : done ? "#c8a96e" : "#555",
        fontWeight: active ? 700 : 500,
      }}>
        {label}
      </span>
    </div>
  );
}

function ShotCard({
  shot, seed, speakingKey, onSpeak,
}: {
  shot: ShotDetail; seed: number;
  speakingKey: string | null; onSpeak: (text: string, key: string) => void;
}) {
  const key = `shot-${seed}`;
  const isSpeaking = speakingKey === key;

  return (
    <div
      style={{
        display: "grid", gridTemplateColumns: "320px 1fr",
        background: "#0e0c08", borderRadius: 10,
        border: "1px solid #221c10", overflow: "hidden",
        transition: "border-color 0.25s",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "#c8a96e55")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "#221c10")}
    >
      <div style={{ height: 190, position: "relative" }}>
        <ShotImage shot={shot} seed={seed} />
        <div style={{
          position: "absolute", top: 10, left: 10, zIndex: 10,
          background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)",
          border: "0.5px solid #c8a96e55", borderRadius: 4,
          padding: "3px 9px", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.12em", color: "#c8a96e", textTransform: "uppercase",
        }}>
          SHOT {shot.shot_number}
        </div>
      </div>

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{
            fontSize: 10, letterSpacing: "0.15em", color: "#c8a96e",
            textTransform: "uppercase", fontWeight: 700, marginBottom: 8,
          }}>
            {shot.camera_angle}
          </div>
          <p style={{ color: "#b8a882", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            {shot.visual_prompt}
          </p>
        </div>
        <button
          onClick={() => onSpeak(shot.visual_prompt, key)}
          style={{
            marginTop: 14, padding: "6px 14px", alignSelf: "flex-start",
            background: isSpeaking ? "rgba(224,68,68,0.12)" : "transparent",
            border: `1px solid ${isSpeaking ? "#e04444" : "#3a2e1a"}`,
            borderRadius: 7, cursor: "pointer",
            color: isSpeaking ? "#fca5a5" : "#6a5a3a",
            fontSize: 12, fontWeight: 600, transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit",
          }}
        >
          <span style={{ fontSize: 11 }}>{isSpeaking ? "⏹" : "▶"}</span>
          {isSpeaking ? "Stop" : "Voiceover"}
          {isSpeaking && (
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171", animation: "pulse 1s infinite", display: "inline-block" }} />
          )}
        </button>
      </div>
    </div>
  );
}


const GENRE_OPTIONS = [
  { value: "thriller", label: "Thriller", icon: "🔪" },
  { value: "sci-fi",   label: "Sci-Fi",   icon: "🚀" },
  { value: "romance",  label: "Romance",  icon: "🌹" },
  { value: "fantasy",  label: "Fantasy",  icon: "🗡️" },
  { value: "horror",   label: "Horror",   icon: "👁️" },
  { value: "action",   label: "Action",   icon: "💥" },
];


export default function Home() {
  const [seedIdea, setSeedIdea]           = useState("");
  const [genre, setGenre]                 = useState("thriller");
  const [loadingStory, setLoadingStory]   = useState(false);
  const [loadingShots, setLoadingShots]   = useState(false);
  const [cine, setCine]                   = useState<FullCinematographyPlan | null>(null);
  const [speakingKey, setSpeakingKey]     = useState<string | null>(null);

  const getSeed = (aIdx: number, sIdx: number, shIdx: number) =>
    (aIdx + 1) * 1000 + (sIdx + 1) * 100 + (shIdx + 1);

  const run = async () => {
    if (!seedIdea.trim()) return;
    window.speechSynthesis?.cancel();
    setCine(null);
    setSpeakingKey(null);
    setLoadingStory(true);

    try {
      const storyRes = await fetch("http://127.0.0.1:8000/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed_idea: `${seedIdea} (Genre: ${genre})` }),
      });
      const storyData = await storyRes.json();
      if (!storyRes.ok) { alert("Story failed: " + (storyData.detail || "error")); return; }

      setLoadingStory(false);
      setLoadingShots(true);

      const cineRes = await fetch("http://127.0.0.1:8000/generate-cinematography", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyData),
      });
      const cineData = await cineRes.json();
      if (!cineRes.ok || !cineData.act_1_breakdown) {
        alert("Cinematography failed. Try again.");
        return;
      }

      setCine(cineData);
    } catch {
      alert("Cannot reach Python backend. Is Uvicorn running on port 8000?");
    } finally {
      setLoadingStory(false);
      setLoadingShots(false);
    }
  };

  const speak = (text: string, key: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (speakingKey === key) { setSpeakingKey(null); return; }
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.92; utt.pitch = 0.95;
    utt.onend = () => setSpeakingKey(null);
    utt.onerror = () => setSpeakingKey(null);
    setSpeakingKey(key);
    window.speechSynthesis.speak(utt);
  };

  const renderAct = (act: ActCinematography, aIdx: number) => {
    const labels = ["Act I", "Act II", "Act III"];
    return (
      <div style={{ marginBottom: 56 }}>
        <div style={{
          display: "flex", alignItems: "baseline", gap: 16,
          marginBottom: 28, paddingBottom: 14, borderBottom: "1px solid #1e1810",
        }}>
          <span style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c8a96e", textTransform: "uppercase", fontWeight: 700, flexShrink: 0 }}>
            {labels[aIdx]}
          </span>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#e8dcc0", fontFamily: "'Playfair Display', Georgia, serif" }}>
            {act.act_title}
          </h2>
        </div>
        {act.scenes.map((scene, sIdx) => (
          <div key={sIdx} style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{
                padding: "2px 11px", borderRadius: 20,
                background: "#130f08", border: "1px solid #2e2616",
                fontSize: 11, letterSpacing: "0.1em", color: "#7a6840", textTransform: "uppercase",
              }}>
                Scene {scene.scene_number}
              </span>
              <span style={{ fontSize: 13, color: "#4a4030", fontStyle: "italic" }}>{scene.location}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {scene.shots.map((shot, shIdx) => (
                <ShotCard
                  key={shIdx}
                  shot={shot}
                  seed={getSeed(aIdx, sIdx, shIdx)}
                  speakingKey={speakingKey}
                  onSpeak={speak}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const isLoading = loadingStory || loadingShots;

  return (
    <main style={{
      minHeight: "100vh", background: "#0a0804",
      color: "#e8dcc0", fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::placeholder { color: #3a3020; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0804; }
        ::-webkit-scrollbar-thumb { background: #2a2010; border-radius: 3px; }
      `}</style>

      <header style={{
        width: "100%", padding: "52px 40px 44px", textAlign: "center",
        borderBottom: "1px solid #1a1408", background: "#0e0c08", position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 7, backgroundImage: "repeating-linear-gradient(90deg,#231c0e 0,#231c0e 18px,transparent 18px,transparent 28px)" }} />
        <div style={{ fontSize: 10, letterSpacing: "0.45em", color: "#7a6840", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>
          AI-Powered Cinematic Storyboarding
        </div>
        <h1 style={{
          margin: "0 0 8px", lineHeight: 1,
          fontSize: "clamp(40px, 6vw, 78px)",
          fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900,
          background: "linear-gradient(135deg,#f0e6d0 30%,#c8a96e 75%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          The Auto-Director
        </h1>
        <p style={{ color: "#4a4030", margin: 0, fontSize: 15 }}>
          Idea → Screenplay → AI visuals generated from your actual story
        </p>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 7, backgroundImage: "repeating-linear-gradient(90deg,#231c0e 0,#231c0e 18px,transparent 18px,transparent 28px)" }} />
      </header>

      <section style={{ width: "100%", maxWidth: 760, padding: "44px 24px 0" }}>
        <div style={{ marginBottom: 6, fontSize: 10, letterSpacing: "0.2em", color: "#4a3e28", textTransform: "uppercase" }}>Genre</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
          {GENRE_OPTIONS.map(g => (
            <button key={g.value} onClick={() => setGenre(g.value)} style={{
              padding: "6px 16px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit",
              background: genre === g.value ? "#c8a96e" : "transparent",
              border: `1px solid ${genre === g.value ? "#c8a96e" : "#2e2616"}`,
              color: genre === g.value ? "#1a1207" : "#7a6840",
              fontSize: 13, fontWeight: genre === g.value ? 700 : 500, transition: "all 0.2s",
            }}>
              {g.icon} {g.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Enter your story idea — e.g. A heist inside a futuristic underwater vault…"
          value={seedIdea}
          onChange={e => setSeedIdea(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !isLoading && run()}
          style={{
            width: "100%", padding: "17px 22px", marginBottom: 10,
            background: "#0e0c08", border: "1px solid #2e2616",
            borderRadius: 10, fontSize: 16, color: "#e8dcc0",
            outline: "none", fontFamily: "inherit", transition: "border-color 0.2s",
          }}
          onFocus={e => (e.target.style.borderColor = "#c8a96e")}
          onBlur={e => (e.target.style.borderColor = "#2e2616")}
        />

        <p style={{ fontSize: 11, color: "#3a3020", marginBottom: 14 }}>
          ⏱ Images are generated by Pollinations Flux AI from your story — each one takes ~5–15s to appear after the storyboard loads
        </p>

        <button onClick={run} disabled={isLoading || !seedIdea.trim()} style={{
          width: "100%", padding: "17px 24px",
          background: isLoading ? "#1a1610" : "#c8a96e",
          color: isLoading ? "#7a6840" : "#1a1207",
          border: "none", borderRadius: 10, fontSize: 15,
          fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "all 0.3s", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        }}>
          {isLoading && (
            <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #3a3020", borderTopColor: "#c8a96e", animation: "spin 0.8s linear infinite" }} />
          )}
          {loadingStory ? "Writing Screenplay…" : loadingShots ? "Building Shot List & Image URLs…" : "Generate Storyboard"}
        </button>

        {isLoading && (
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 20, padding: "14px 22px", background: "#0e0c08", borderRadius: 9, border: "1px solid #1e1810" }}>
            <StepPill n={1} label="Screenplay" active={loadingStory}  done={!loadingStory && loadingShots} />
            <div style={{ width: 1, background: "#1e1810" }} />
            <StepPill n={2} label="Shot List"  active={loadingShots}  done={false} />
            <div style={{ width: 1, background: "#1e1810" }} />
            <StepPill n={3} label="AI Images"  active={false}         done={false} />
          </div>
        )}
      </section>

      {cine && (
        <section style={{ width: "100%", maxWidth: 900, padding: "60px 24px", animation: "fadeUp 0.6s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.4em", color: "#7a6840", textTransform: "uppercase", marginBottom: 10 }}>Now Presenting</div>
            <h1 style={{ margin: 0, fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(26px, 4vw, 50px)", fontWeight: 900, color: "#f0e6d0" }}>
              {cine.movie_title}
            </h1>
            <p style={{ color: "#4a3e28", fontSize: 12, marginTop: 10, letterSpacing: "0.05em" }}>
              Images are generating in the background — they appear as each one completes
            </p>
          </div>
          {[cine.act_1_breakdown, cine.act_2_breakdown, cine.act_3_breakdown].map((act, i) => (
            <div key={i}>{renderAct(act, i)}</div>
          ))}
        </section>
      )}

      <footer style={{ width: "100%", padding: "22px 0", textAlign: "center", borderTop: "1px solid #1a1408", fontSize: 10, color: "#2e2616", letterSpacing: "0.2em", marginTop: "auto" }}>
        THE AUTO-DIRECTOR · IMAGES BY POLLINATIONS FLUX AI
      </footer>
    </main>
  );
}