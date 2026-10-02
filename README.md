# 🏰 Gargoyle's Keep: Soulwarden

> **A 3D Gothic Dark Fantasy Tower Defense Game built with Three.js & Vite**

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.186-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Defend the **Soul Hearth** against relentless nocturnal horrors with grumpy gargoyles, bubbling witch cauldrons, eldritch crypts, and tesla spire conduits across procedural floating island realms!

---

## 🎮 Key Features

- **⚔️ 3D Gothic Tower Defense**: Handcrafted procedural 3D low-poly models built dynamically with Three.js.
- **🗺️ Realm Progression & Endless Spire**:
  - *Gloomstone Graveyard* (Chilled Midnight & Mist)
  - *Crimson Nethermaw* (Blood Moon & Molten Caverns)
  - *Frostfall Citadel* (Glacial Blizzard & Rime)
  - *Alchemist Mire* (Bioluminescent Poison Swamps)
  - *The Endless Spire* (Infinite scaling procedural levels with custom mutators)
- **🌓 Dual Celestial Themes**: Instantly toggle between **Dark Gothic Midnight** and **Celestial Dawn (Light Mode)**.
- **⚒️ Soul Forge Metaprogression**: Spend harvested Soul Essence on permanent upgrades for Hearth HP, starting gold, defender damage, and soul magnet range.
- **📖 Character Codex & Bestiary**: In-depth statistics, lore, strengths, and weaknesses for all defenders and gothic enemies.
- **🔊 Procedural Web Audio Engine**: Atmospheric ambient chords, dynamic spell sound effects, and auditory feedback without external audio files.
- **⚡ Spells & Arsenal Hotkeys**: Summon Meteor Rain, Soul Freezes, and Bone Walls using hotkeys (`1`, `2`, `3`, `Spacebar`).
- **🏆 Quests & Bounties**: Complete challenging achievements to earn bonus gold and souls.

---

## 🕹️ Controls & Shortcuts

| Action | Shortcut |
| :--- | :--- |
| **Summon / Unleash Next Wave** | `Spacebar` |
| **Cast Spell: Meteor Barrage** | `1` |
| **Cast Spell: Soul Frost** | `2` |
| **Cast Spell: Bone Wall** | `3` |
| **Select Towers (Gargoyle / Cauldron / Crypt / Tesla)** | `Q`, `W`, `E`, `R` |
| **Upgrade Selected Tower** | `U` |
| **Open Realm Map & Levels** | `L` |
| **Rotate & Pan Camera** | `Left Click + Drag` / `Right Click + Drag` |
| **Zoom In / Out** | `Mouse Wheel` |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ranveeramilkanthwar-cyber/3d-battel-game.git

# Enter project directory
cd 3d-battel-game

# Install dependencies
npm install
```

### Development

```bash
# Launch Vite dev server
npm run dev
```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview build locally
npm run preview
```

---

## 📁 Project Structure

```text
├── index.html          # Game markup, modal dialogues, HUD & HUD dock
├── package.json        # Project metadata & dependencies
├── vercel.json         # Vercel deployment configuration
├── public/
│   └── favicon.svg     # Custom gothic citadel favicon
└── src/
    ├── main.js         # Game entry point, Three.js scene setup & UI event handling
    ├── game.js         # Core game engine, wave management, leveling & state
    ├── models.js       # 3D procedural meshes, materials, and thematic environments
    ├── audio.js        # Web Audio API procedural sound synthesizer engine
    └── style.css       # Comprehensive Gothic & Celestial CSS design system
```

---

## 📜 License

This project is licensed under the MIT License - feel free to build, remix, and expand upon it!
