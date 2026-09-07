# MediaForge

**MediaForge** is a fully local, ultra-lightweight, and offline-first AI Media Agent designed to act as an intelligent bridge between natural language and the FFmpeg processing engine.

By combining the raw power of FFmpeg with a sleek, modern interface, MediaForge allows video editors, content creators, and developers to process media files simply by describing what they want to do—without ever having to memorize complex command-line arguments.

## 🚀 Key Features

- **Híbrido (Beginner & Pro):** A beautiful dual-pane interface featuring a chat panel for natural language intent and a transparent terminal for direct code editing and execution.
- **Offline-First AI:** Powered by an embedded Small Language Model (SLM) running entirely on CPU, ensuring zero latency, maximum privacy, and no internet requirement.
- **Ultra-Lightweight:** Built with Tauri + Rust + React. No heavy Chromium browser bundled, keeping the footprint to a minimum.
- **Strict Guardrails:** The Rust backend intercepts and validates every generated command, ensuring only safe `ffmpeg`, `ffprobe`, and basic file management commands are executed. No accidental data deletion.
- **Local File Explorer:** Interactive directory tree that gives the AI immediate "awareness" of your media files and their metadata via `ffprobe`.

## 🛠️ Technology Stack

- **Core & OS Interop:** Rust + Tauri (v2)
- **Frontend UI:** React + Tailwind CSS + TanStack Router (Vite SPA)
- **AI Brain:** `llama.cpp` / ONNX Runtime (quantized local model)
- **Media Engine:** Static builds of `ffmpeg` and `ffprobe` (included as sidecars)

## 📦 Getting Started (Development)

This project currently contains the Frontend SPA structure. The Rust backend implementation is planned for the next development phase.

### Prerequisites
- Node.js & npm (or Bun)
- Rust & Cargo (for the upcoming Tauri setup)

### Setup Frontend

1. Install dependencies:
```bash
npm install
# or
bun install
```

2. Start the development server:
```bash
npm run dev
# or
bun run dev
```

### Next Steps (Backend)
In the next phase, we will initialize the Tauri shell (`npx tauri init`) and map the frontend commands to the Rust filesystem and child-process execution APIs.
