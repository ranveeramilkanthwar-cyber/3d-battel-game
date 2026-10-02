// ==========================================================================
// GARGOYLE'S KEEP: GAME LOGIC & MULTI-LEVEL ENGINE
// Autonomous Level Progression, Distinct Themed Paths & Advanced Behaviors
// ==========================================================================

import * as THREE from 'three';
import { sound } from './audio.js';
import {
  createGargoyleTower,
  createCauldronTower,
  createCryptTower,
  createTeslaTower,
  createSkeletonMesh,
  createImpMesh,
  createHellhoundMesh,
  createNecromancerMesh,
  createBansheeMesh,
  createGolemMesh,
  createBossPumpkinMesh,
  createBossBloodDemonMesh,
  createBossFrostColossusMesh,
  createSoulOrb,
} from './models.js';

// Pre-defined Paths for each Level (8 Complex Topologies)
export const LEVEL_PATHS = [
  // 0: Classic S-Curve (Gloomstone)
  [
    new THREE.Vector3(-4.5, 0, -4.5),
    new THREE.Vector3(-1.5, 0, -4.5),
    new THREE.Vector3(-1.5, 0, -1.5),
    new THREE.Vector3(3.5, 0, -1.5),
    new THREE.Vector3(3.5, 0, 1.8),
    new THREE.Vector3(-2.8, 0, 1.8),
    new THREE.Vector3(-2.8, 0, 4.5),
    new THREE.Vector3(0.0, 0, 4.5),
    new THREE.Vector3(0.0, 0, 5.2),
  ],
  // 1: Spiral Chasm (Crimson)
  [
    new THREE.Vector3(4.5, 0, -4.5),
    new THREE.Vector3(4.5, 0, 2.5),
    new THREE.Vector3(-3.5, 0, 2.5),
    new THREE.Vector3(-3.5, 0, -2.5),
    new THREE.Vector3(1.5, 0, -2.5),
    new THREE.Vector3(1.5, 0, 0.5),
    new THREE.Vector3(-0.8, 0, 0.5),
    new THREE.Vector3(-0.8, 0, 5.0),
  ],
  // 2: Zigzag Gauntlet (Frostfall)
  [
    new THREE.Vector3(-4.8, 0, -3.5),
    new THREE.Vector3(0.0, 0, -3.5),
    new THREE.Vector3(3.8, 0, -1.5),
    new THREE.Vector3(-3.8, 0, 0.5),
    new THREE.Vector3(3.8, 0, 2.5),
    new THREE.Vector3(0.0, 0, 4.2),
    new THREE.Vector3(0.0, 0, 5.2),
  ],
  // 3: Serpent Horseshoe (Alchemist)
  [
    new THREE.Vector3(-4.5, 0, 4.0),
    new THREE.Vector3(-4.5, 0, -3.8),
    new THREE.Vector3(-1.5, 0, -3.8),
    new THREE.Vector3(-1.5, 0, 2.5),
    new THREE.Vector3(2.0, 0, 2.5),
    new THREE.Vector3(2.0, 0, -3.8),
    new THREE.Vector3(4.5, 0, -3.8),
    new THREE.Vector3(4.5, 0, 3.5),
    new THREE.Vector3(0.0, 0, 5.0),
  ],
  // 4: The Double Cross (Endless Void)
  [
    new THREE.Vector3(-4.5, 0, 0.0),
    new THREE.Vector3(-2.0, 0, 0.0),
    new THREE.Vector3(-2.0, 0, -4.0),
    new THREE.Vector3(2.0, 0, -4.0),
    new THREE.Vector3(2.0, 0, 2.5),
    new THREE.Vector3(-2.0, 0, 2.5),
    new THREE.Vector3(-2.0, 0, 4.5),
    new THREE.Vector3(0.0, 0, 5.2),
  ],
  // 5: Outer Perimeter Ring
  [
    new THREE.Vector3(0.0, 0, -4.8),
    new THREE.Vector3(4.2, 0, -4.8),
    new THREE.Vector3(4.2, 0, 4.0),
    new THREE.Vector3(-4.2, 0, 4.0),
    new THREE.Vector3(-4.2, 0, -2.5),
    new THREE.Vector3(0.0, 0, -2.5),
    new THREE.Vector3(0.0, 0, 5.0),
  ],
  // 6: Labyrinth Squeeze
  [
    new THREE.Vector3(-4.5, 0, -4.5),
    new THREE.Vector3(4.0, 0, -4.5),
    new THREE.Vector3(4.0, 0, -1.8),
    new THREE.Vector3(-3.5, 0, -1.8),
    new THREE.Vector3(-3.5, 0, 1.2),
    new THREE.Vector3(3.5, 0, 1.2),
    new THREE.Vector3(3.5, 0, 4.5),
    new THREE.Vector3(0.0, 0, 5.2),
  ],
  // 7: Celestial Ascent
  [
    new THREE.Vector3(-4.8, 0, 4.0),
    new THREE.Vector3(-2.2, 0, 2.0),
    new THREE.Vector3(-4.0, 0, -1.5),
    new THREE.Vector3(-1.0, 0, -3.8),
    new THREE.Vector3(2.5, 0, -3.8),
    new THREE.Vector3(4.0, 0, 0.0),
    new THREE.Vector3(1.5, 0, 3.0),
    new THREE.Vector3(0.0, 0, 5.2),
  ],
];

// Dual & Multiple Route Topologies (For Multi-Portal Incursions & Dual Island Bridges)
export const LEVEL_ROUTES_DUAL = [
  // 0: Dual Bridge Incursion (North-West & North-East converging over bridge to South Hearth)
  [
    // Route 1 (Portal Alpha: NW Gate)
    [
      new THREE.Vector3(-3.2, 0, -5.2),
      new THREE.Vector3(-2.2, 0, -3.2),
      new THREE.Vector3(-0.6, 0, -1.8),
      new THREE.Vector3(0.0, 0, -0.4), // bridge center
      new THREE.Vector3(0.0, 0, 1.4),
      new THREE.Vector3(-1.6, 0, 2.8),
      new THREE.Vector3(0.0, 0, 5.0),  // Hearth
    ],
    // Route 2 (Portal Beta: NE Gate)
    [
      new THREE.Vector3(3.2, 0, -5.2),
      new THREE.Vector3(2.2, 0, -3.2),
      new THREE.Vector3(0.6, 0, -1.8),
      new THREE.Vector3(0.0, 0, -0.4), // bridge center
      new THREE.Vector3(0.0, 0, 1.4),
      new THREE.Vector3(1.6, 0, 2.8),
      new THREE.Vector3(0.0, 0, 5.0),  // Hearth
    ],
  ],
  // 1: Pincer Crossfire Flank (West Gate & East Gate)
  [
    // Route 1 (Portal Alpha: West Gate)
    [
      new THREE.Vector3(-4.8, 0, -2.5),
      new THREE.Vector3(-2.2, 0, -2.5),
      new THREE.Vector3(-2.2, 0, 0.8),
      new THREE.Vector3(1.5, 0, 0.8),
      new THREE.Vector3(1.5, 0, 3.2),
      new THREE.Vector3(0.0, 0, 5.0),
    ],
    // Route 2 (Portal Beta: East Gate)
    [
      new THREE.Vector3(4.8, 0, -2.5),
      new THREE.Vector3(2.2, 0, -2.5),
      new THREE.Vector3(2.2, 0, 0.8),
      new THREE.Vector3(-1.5, 0, 0.8),
      new THREE.Vector3(-1.5, 0, 3.2),
      new THREE.Vector3(0.0, 0, 5.0),
    ],
  ],
  // 2: Grand Serpentine & Perimeter Assault
  [
    // Route 1 (Portal Alpha: Outer Gauntlet)
    [
      new THREE.Vector3(-5.5, 0, -5.0),
      new THREE.Vector3(5.0, 0, -5.0),
      new THREE.Vector3(5.0, 0, 0.0),
      new THREE.Vector3(-3.5, 0, 0.0),
      new THREE.Vector3(-3.5, 0, 3.5),
      new THREE.Vector3(0.0, 0, 5.0),
    ],
    // Route 2 (Portal Beta: Inner Direct Assault)
    [
      new THREE.Vector3(0.0, 0, -5.5),
      new THREE.Vector3(-2.0, 0, -3.0),
      new THREE.Vector3(2.5, 0, -1.5),
      new THREE.Vector3(0.0, 0, 1.5),
      new THREE.Vector3(0.0, 0, 5.0),
    ],
  ],
];

// Realm Mutators / Affixes
export const REALM_MUTATORS = [
  { id: 'none', name: 'Standard Night', icon: '🌌', desc: 'Standard sanctuary conditions.', speedMod: 1.0, hpMod: 1.0, soulMod: 1.0, goldMod: 1.0, countMod: 1.0 },
  { id: 'swarm_surge', name: 'Swarm Surge', icon: '⚡', desc: '+35% enemy count, but foes drop +25% bonus Gold!', speedMod: 1.0, hpMod: 0.88, soulMod: 1.2, goldMod: 1.25, countMod: 1.35 },
  { id: 'fleet_footed', name: 'Adrenaline Rush', icon: '👟', desc: 'Enemies sprint +20% faster, but all towers gain +15% range!', speedMod: 1.2, hpMod: 0.95, soulMod: 1.15, goldMod: 1.2, rangeMod: 1.15, countMod: 1.0 },
  { id: 'iron_carapace', name: 'Titan Shell', icon: '🛡️', desc: 'Enemies have +25% HP, but towers deal +20% base damage!', speedMod: 0.9, hpMod: 1.25, soulMod: 1.3, goldMod: 1.35, dmgMod: 1.2, countMod: 1.0 },
  { id: 'soul_eclipse', name: 'Soul Eclipse', icon: '✨', desc: 'Harvested souls drop with 2x Essence value!', speedMod: 1.05, hpMod: 1.05, soulMod: 2.0, goldMod: 1.0, countMod: 1.0 },
  { id: 'blood_moon_tide', name: 'Blood Moon Surge', icon: '🌕', desc: 'Towers attack 25% faster, but bosses possess +30% health!', speedMod: 1.1, hpMod: 1.15, soulMod: 1.25, goldMod: 1.2, hasteMod: 0.75, countMod: 1.0 },
];

// Star Milestones (Permanent relics unlocked by accumulating total stars)
export const REALM_STAR_MILESTONES = [
  { id: 'ms_gold', starsRequired: 3, name: 'Brimstone Bounty', icon: '🪙', desc: 'Sanctum starts every level with +60 bonus Crypt Gold.' },
  { id: 'ms_souls', starsRequired: 6, name: 'Soul Condenser', icon: '👻', desc: 'Defeated horrors drop +25% more Soul Essence.' },
  { id: 'ms_range', starsRequired: 10, name: 'Gargoyle Eye', icon: '🎯', desc: 'All placed defenders gain +12% base attack range across all realms.' },
  { id: 'ms_acid', starsRequired: 15, name: 'Caustic Brew', icon: '🧪', desc: "Witch's Cauldron splash slows enemies for +1.0s longer." },
  { id: 'ms_chain', starsRequired: 22, name: 'Arc Resonator', icon: '⚡', desc: 'Eldritch Monolith lightning chains to +1 additional horror.' },
  { id: 'ms_aegis', starsRequired: 32, name: 'Celestial Aegis', icon: '🛡️', desc: 'Soul Hearth gains +5 bonus maximum HP across all realms.' },
  { id: 'ms_haste', starsRequired: 45, name: 'Spire Overlord', icon: '👑', desc: 'All towers attack 15% faster across all infinite levels.' },
];

// Optional Realm Challenges / Modifiers (Toggled by player for high risk / reward)
export const CHALLENGE_MODIFIERS = [
  { id: 'blood_pact', name: 'Blood Pact', icon: '🩸', desc: 'Horrors have +30% HP, but drop +50% extra Soul Essence.', hpMod: 1.3, soulMod: 1.5, goldMod: 1.0 },
  { id: 'overclocked', name: 'Overclocked Frenzy', icon: '⚡', desc: 'Horrors sprint +25% faster, towers fire +20% faster & enemies drop +30% Gold.', speedMod: 1.25, towerHasteMod: 0.8, goldMod: 1.3 },
  { id: 'hardcore_hearth', name: 'Hardcore Hearth', icon: '💀', desc: 'Hearth health is capped at 1 HP! Any breach is lethal. Victory awards 2.5x Souls & Gold!', hpCap: 1, goldMod: 2.0, soulMod: 2.5 },
];

export const LEVEL_DEFINITIONS = [
  {
    level: 1,
    name: 'Gloomstone Graveyard',
    theme: 'gothic',
    description: 'Chilled midnight cemetery. Skeletons and Imps emerge from ancient crypts.',
    totalWaves: 5,
    spaceType: 'standard',
    routes: [LEVEL_PATHS[0]],
    routeType: 'Single Route',
    hardness: 1,
    bossType: 'boss_pumpkin',
    bossName: 'Pumpkin Lord Jack',
    mutator: REALM_MUTATORS[0],
    isEndless: false,
    levelTasks: [
      { id: 't1_hp', title: 'Sanctum Shield', desc: 'Finish level with at least 80% Hearth HP', target: 80, current: 0, rewardGold: 50, rewardSouls: 15, completed: false },
      { id: 't1_garg', title: 'Stone Sentinel', desc: 'Slay 12 horrors using Gargoyles', target: 12, current: 0, rewardGold: 60, rewardSouls: 20, completed: false },
    ],
  },
  {
    level: 2,
    name: 'Crimson Nethermaw',
    theme: 'crimson',
    description: 'Dual Incursion Island! Swift Hellhounds charge from twin Nether Portals across the bone bridge.',
    totalWaves: 6,
    spaceType: 'dual',
    routes: LEVEL_ROUTES_DUAL[0],
    routeType: 'Dual Pincer Routes',
    hardness: 2,
    bossType: 'boss_demon',
    bossName: 'Blood Demon Overlord',
    mutator: REALM_MUTATORS[1],
    isEndless: false,
    levelTasks: [
      { id: 't2_dual', title: 'Bridge Warden', desc: 'Hold the central bridge without losing more than 4 HP', target: 16, current: 0, rewardGold: 65, rewardSouls: 25, completed: false },
      { id: 't2_slay', title: 'Hellhound Culler', desc: 'Banish 8 Hellhounds before they breach', target: 8, current: 0, rewardGold: 70, rewardSouls: 20, completed: false },
    ],
  },
  {
    level: 3,
    name: 'Frostfall Citadel',
    theme: 'frost',
    description: 'Compact Glacial Arena! Frost Banshees lead crossfire raids from West and East flanks.',
    totalWaves: 7,
    spaceType: 'compact',
    routes: LEVEL_ROUTES_DUAL[1],
    routeType: 'Crossfire Gauntlet',
    hardness: 3,
    bossType: 'boss_frost',
    bossName: 'Frost Colossus',
    mutator: REALM_MUTATORS[2],
    isEndless: false,
    levelTasks: [
      { id: 't3_freeze', title: 'Deep Freeze', desc: 'Slow 20 horrors with Witch Cauldron stew', target: 20, current: 0, rewardGold: 75, rewardSouls: 25, completed: false },
      { id: 't3_colossus', title: 'Titan Slayer', desc: 'Defeat Frost Colossus without using God Rituals', target: 1, current: 0, rewardGold: 85, rewardSouls: 30, completed: false },
    ],
  },
  {
    level: 4,
    name: 'Alchemist Mire',
    theme: 'toxic',
    description: 'Grand Sprawling Fortress! Necromancer Cultists swarm across outer and inner battlements.',
    totalWaves: 8,
    spaceType: 'grand',
    routes: LEVEL_ROUTES_DUAL[2],
    routeType: 'Dual Serpentine Routes',
    hardness: 4,
    bossType: 'boss_demon',
    bossName: 'Nether Chimera',
    mutator: REALM_MUTATORS[3],
    isEndless: false,
    levelTasks: [
      { id: 't4_chain', title: 'Eldritch Arc', desc: 'Discharge 8 Chain Lightning strikes with Monoliths', target: 8, current: 0, rewardGold: 90, rewardSouls: 35, completed: false },
      { id: 't4_purge', title: 'Grand Purifier', desc: 'Slay 35 horrors across the grand fortress', target: 35, current: 0, rewardGold: 100, rewardSouls: 40, completed: false },
    ],
  },
];

// Infinite Procedural Level Generator (Generates Levels 1 to ∞ autonomously)
export function generateLevelDefinition(levelNumber) {
  if (levelNumber >= 1 && levelNumber <= LEVEL_DEFINITIONS.length) {
    return LEVEL_DEFINITIONS[levelNumber - 1];
  }

  const prefixes = ['Abyssal', 'Dread', 'Obsidian', 'Glacial', 'Toxic', 'Celestial', 'Nether', 'Eternal', 'Shadow', 'Cataclysmic', 'Vicious', 'Spectral', 'Immortal', 'Primordial'];
  const realms = ['Rift', 'Citadel', 'Necropolis', 'Spire', 'Caverns', 'Mire', 'Keep', 'Hollow', 'Gauntlet', 'Sanctuary', 'Domain', 'Abyss', 'Bastion', 'Catacombs'];
  const themes = ['gothic', 'crimson', 'frost', 'toxic', 'celestial'];
  const spaces = ['compact', 'standard', 'grand', 'dual'];
  const bossTypes = ['boss_pumpkin', 'boss_demon', 'boss_frost'];
  const bossNames = ['Pumpkin Lord Jack', 'Blood Demon Overlord', 'Frost Colossus', 'Thanatos the Void Harvester', 'Lord of Cinders'];

  const seed = levelNumber * 9301 + 49297;
  const prefix = prefixes[Math.abs(seed) % prefixes.length];
  const realm = realms[Math.abs(seed >> 2) % realms.length];
  const theme = themes[(levelNumber - 1) % themes.length];
  const spaceType = spaces[(levelNumber - 1) % spaces.length];

  // Levels scale difficulty with dual routes & high monster densities
  const useDualRoutes = levelNumber % 2 === 0 || spaceType === 'dual';
  const dualIndex = Math.abs(seed >> 3) % LEVEL_ROUTES_DUAL.length;
  const singleIndex = (levelNumber - 1) % LEVEL_PATHS.length;
  const routes = useDualRoutes ? LEVEL_ROUTES_DUAL[dualIndex] : [LEVEL_PATHS[singleIndex]];
  const routeType = useDualRoutes ? 'Dual Converging Routes' : 'Single Incursion Route';

  const bossType = bossTypes[(levelNumber - 1) % bossTypes.length];
  const bossName = bossNames[(levelNumber - 1) % bossNames.length];
  const mutator = REALM_MUTATORS[1 + (Math.abs(seed) % (REALM_MUTATORS.length - 1))];

  return {
    level: levelNumber,
    name: `${prefix} ${realm} ${levelNumber}`,
    theme: theme,
    description: `Endless Spire Tier ${levelNumber}. Space: ${spaceType.toUpperCase()} | ${routeType}. Active Mutator: ${mutator.name}`,
    totalWaves: Math.min(15, 6 + Math.floor(levelNumber / 2)),
    spaceType: spaceType,
    routes: routes,
    routeType: routeType,
    hardness: levelNumber,
    bossType: bossType,
    bossName: bossName,
    mutator: mutator,
    isEndless: true,
    levelTasks: [
      { id: `spire_hp_${levelNumber}`, title: 'Sanctum Aegis', desc: 'Hold Hearth HP above 75%', target: 75, current: 0, rewardGold: 70 + levelNumber * 5, rewardSouls: 25 + levelNumber * 2, completed: false },
      { id: `spire_kill_${levelNumber}`, title: 'Spire Banishment', desc: `Slay ${20 + levelNumber * 2} horrors`, target: 20 + levelNumber * 2, current: 0, rewardGold: 80 + levelNumber * 6, rewardSouls: 30 + levelNumber * 2, completed: false },
    ],
  };
}

// Multi-Route Aware Position Checker: Checks if point (x, z) is on ANY route
export function isPositionOnCurrentPath(x, z, routes, threshold = 0.95) {
  if (!routes) return false;
  const allRoutes = Array.isArray(routes[0]) && Array.isArray(routes[0][0]) ? routes : [routes];

  for (let pathWaypoints of allRoutes) {
    if (!pathWaypoints || pathWaypoints.length < 2) continue;
    for (let i = 0; i < pathWaypoints.length - 1; i++) {
      const p1 = pathWaypoints[i];
      const p2 = pathWaypoints[i + 1];

      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const lenSq = dx * dx + dz * dz;

      let t = ((x - p1.x) * dx + (z - p1.z) * dz) / lenSq;
      t = Math.max(0, Math.min(1, t));

      const projX = p1.x + t * dx;
      const projZ = p1.z + t * dz;

      const distSq = (x - projX) * (x - projX) + (z - projZ) * (z - projZ);
      if (distSq < threshold * threshold) {
        return true;
      }
    }
  }
  return false;
}

export const TOWER_CONFIGS = {
  gargoyle: {
    id: 'gargoyle',
    name: 'Grumpy Gargoyle',
    cost: 70,
    range: 3.6,
    damage: 26,
    fireRate: 0.85,
    projectileSpeed: 8.5,
    description: 'Spits fiery brimstone boulders at single targets with fierce stone loyalty.',
    upgrades: [
      { rank: 2, name: 'Obsidian Spitter', cost: 65, dmgAdd: 18, rangeAdd: 0.4 },
      { rank: 3, name: 'Dragon Gargoyle', cost: 110, dmgAdd: 32, rangeAdd: 0.6 },
    ],
  },
  cauldron: {
    id: 'cauldron',
    name: "Witch's Cauldron",
    cost: 90,
    range: 2.8,
    damage: 18,
    fireRate: 1.35,
    projectileSpeed: 6.0,
    splashRadius: 1.8,
    slowPercent: 0.45,
    slowDuration: 2.8,
    description: 'Hurls splashing toxic stew that coats ground areas, damaging and slowing foes.',
    upgrades: [
      { rank: 2, name: 'Banshee Brew', cost: 80, dmgAdd: 14, rangeAdd: 0.3, slowAdd: 0.15 },
      { rank: 3, name: 'Eldritch Elixir', cost: 135, dmgAdd: 24, rangeAdd: 0.5, slowAdd: 0.2 },
    ],
  },
  crypt: {
    id: 'crypt',
    name: 'Spectral Crypt',
    cost: 110,
    range: 3.2,
    damage: 14,
    fireRate: 0.65,
    projectileSpeed: 7.0,
    description: 'Channels spirit lanterns that strike rapidly and collect bonus soul power.',
    upgrades: [
      { rank: 2, name: 'Phantom Crypt', cost: 90, dmgAdd: 12, rangeAdd: 0.4 },
      { rank: 3, name: "Lich's Tomb", cost: 150, dmgAdd: 22, rangeAdd: 0.6 },
    ],
  },
  tesla: {
    id: 'tesla',
    name: 'Eldritch Monolith',
    cost: 135,
    range: 4.2,
    damage: 34,
    fireRate: 1.25,
    chainCount: 4,
    chainRange: 2.6,
    description: 'Discharges crackling violet arcs that chain through multiple nearby monsters.',
    upgrades: [
      { rank: 2, name: 'Storm Obelisk', cost: 120, dmgAdd: 22, rangeAdd: 0.4, chainAdd: 2 },
      { rank: 3, name: 'Doom Citadel', cost: 190, dmgAdd: 38, rangeAdd: 0.6, chainAdd: 3 },
    ],
  },
};

// ==========================================================================
// BESTIARY & HEROES CODEX DATA
// ==========================================================================
export const CODEX_DATA = {
  defenders: [
    {
      id: 'gargoyle',
      name: 'Grumpy Gargoyle',
      glyph: '🗿',
      role: 'Single-Target Brimstone Fire',
      lore: 'Carved three centuries ago to guard forgotten cathedrals. Stubborn and grumpy when idle, but spits blistering magma balls at intruders.',
      stats: { damage: '26 -> 76', range: '3.6 -> 4.6', speed: '0.85s' },
      tiers: ['Rank 1: Stone Gargoyle', 'Rank 2: Obsidian Spitter', 'Rank 3: Dragon Gargoyle'],
    },
    {
      id: 'cauldron',
      name: "Witch's Cauldron",
      glyph: '🧪',
      role: 'AoE Slime Splash & Slow',
      lore: 'A black iron cauldron enchanted with an auto-stirring wooden spoon. Splatters boiling radioactive swamp stew that coats lanes and slows foes by 45%.',
      stats: { damage: '18 -> 56', range: '2.8 -> 3.6', slow: '45% -> 80%' },
      tiers: ['Rank 1: Iron Cauldron', 'Rank 2: Banshee Brew', 'Rank 3: Eldritch Elixir'],
    },
    {
      id: 'crypt',
      name: 'Spectral Crypt',
      glyph: '🏛️',
      role: 'Rapid Soul Striker & Reaper',
      lore: 'Miniature mausoleum sheltering friendly lantern-bearing spirits. Strikes rapidly and extracts bonus soul essence from vanquished fiends.',
      stats: { damage: '14 -> 48', range: '3.2 -> 4.2', bonus: '+2 Souls / Kill' },
      tiers: ['Rank 1: Bone Crypt', 'Rank 2: Phantom Crypt', "Rank 3: Lich's Tomb"],
    },
    {
      id: 'tesla',
      name: 'Eldritch Monolith',
      glyph: '⚡',
      role: 'Chain Lightning Arc',
      lore: 'Granite spire crowned with an amethyst void crystal that crackles with high-voltage purple arcs jumping through up to 7 nearby monsters.',
      stats: { damage: '34 -> 94', range: '4.2 -> 5.2', chain: '4 -> 7 Targets' },
      tiers: ['Rank 1: Arc Monolith', 'Rank 2: Storm Obelisk', 'Rank 3: Doom Citadel'],
    },
  ],
  enemies: [
    {
      id: 'skeleton',
      name: 'Skeleton Creeper',
      glyph: '💀',
      threat: 'Low ⭐',
      hp: '55 - 120',
      speed: '1.25 (Medium)',
      trait: 'March in large swarms',
      weakness: 'Vulnerable to Witch Cauldron AoE splash',
    },
    {
      id: 'imp',
      name: 'Imp Fiend',
      glyph: '😈',
      threat: 'Medium ⭐⭐',
      hp: '80 - 180',
      speed: '1.45 (Fast)',
      trait: 'Nimble bat wings allow sudden dashes',
      weakness: 'Vulnerable to Gargoyle single-target focus',
    },
    {
      id: 'hellhound',
      name: 'Hellhound',
      glyph: '🐕‍🔥',
      threat: 'High ⭐⭐⭐',
      hp: '75 - 190',
      speed: '1.85 (Extreme Speed)',
      trait: 'Blinding sprint rush directly to the Hearth',
      weakness: 'Must be slowed by Cauldron or frozen by Frost Nova',
    },
    {
      id: 'banshee',
      name: 'Frost Banshee',
      glyph: '👻',
      threat: 'High ⭐⭐⭐',
      hp: '120 - 240',
      speed: '1.1 (Medium)',
      trait: 'Periodically screams to grant +40% speed to surrounding allies',
      weakness: 'High magic resistance, focus down with Monolith',
    },
    {
      id: 'necromancer',
      name: 'Necromancer Cultist',
      glyph: '🧙‍♂️',
      threat: 'Extreme ⭐⭐⭐⭐',
      hp: '220 - 450',
      speed: '0.85 (Slow)',
      trait: 'Channels purple rituals to summon fresh skeletons from the dead',
      weakness: 'Target immediately with Eldritch Meteor',
    },
    {
      id: 'golem',
      name: 'Crypt Crusher Golem',
      glyph: '🗿',
      threat: 'Extreme ⭐⭐⭐⭐',
      hp: '300 - 800',
      speed: '0.65 (Armored)',
      trait: 'Heavy stone shell deflects 35% physical damage',
      weakness: 'Eldritch Monolith lightning and Witch Cauldron acid',
    },
    {
      id: 'boss_pumpkin',
      name: 'Pumpkin Lord Jack',
      glyph: '🎃',
      threat: 'Realm Boss 👑',
      hp: '1300 - 2500',
      trait: 'Heavy ground smash and high health',
      weakness: 'God Rituals & Blood Moon Frenzy',
    },
    {
      id: 'boss_demon',
      name: 'Blood Demon Overlord',
      glyph: '👹',
      threat: 'Realm Boss 👑',
      hp: '2000 - 4000',
      trait: 'Enrages below 40% HP, doubling its movement velocity',
      weakness: 'Save Frost Nova for its enraged phase',
    },
    {
      id: 'boss_frost',
      name: 'Frost Colossus',
      glyph: '🧊',
      threat: 'Realm Boss 👑',
      hp: '2400 - 5000',
      trait: 'Glacial armor and massive step distance',
      weakness: 'Focus fire with upgraded Dragon Gargoyles',
    },
  ],
};

// ==========================================================================
// SOUL FORGE PERMANENT UPGRADES
// ==========================================================================
export const SOUL_FORGE_UPGRADES = {
  damage_boost: {
    id: 'damage_boost',
    name: 'Titan Runes',
    desc: 'Empowers all defenders with +15% bonus attack damage per rank.',
    icon: '⚔️',
    maxRank: 3,
    costs: [35, 75, 140],
  },
  hearth_hp: {
    id: 'hearth_hp',
    name: 'Hearth Fortification',
    desc: 'Increases Soul Hearth Maximum Health by +5 HP per rank.',
    icon: '💖',
    maxRank: 3,
    costs: [25, 55, 100],
  },
  starting_gold: {
    id: 'starting_gold',
    name: 'Crypt Treasury',
    desc: 'Grants +40 additional starting gold on every realm.',
    icon: '🪙',
    maxRank: 3,
    costs: [30, 65, 120],
  },
  soul_magnet: {
    id: 'soul_magnet',
    name: 'Soul Magnetism',
    desc: 'Harvested soul orbs yield +2 bonus Soul Essence each.',
    icon: '👻',
    maxRank: 3,
    costs: [30, 60, 110],
  },
  spell_discount: {
    id: 'spell_discount',
    name: 'Eldritch Efficiency',
    desc: 'Reduces all God Ritual Soul costs by -15% per rank.',
    icon: '✨',
    maxRank: 3,
    costs: [40, 85, 150],
  },
};

// ==========================================================================
// QUESTS & BOUNTIES SYSTEM
// ==========================================================================
export const INITIAL_QUESTS = [
  { id: 'q_kills', title: 'Crypt Purifier', desc: 'Slay 25 horrors of the dark', target: 25, current: 0, rewardGold: 60, rewardSouls: 15, claimed: false },
  { id: 'q_souls', title: 'Soul Harvester', desc: 'Harvest 12 floating soul orbs', target: 12, current: 0, rewardGold: 70, rewardSouls: 20, claimed: false },
  { id: 'q_waves', title: 'Night Watchman', desc: 'Survive 5 cursed night waves', target: 5, current: 0, rewardGold: 80, rewardSouls: 25, claimed: false },
  { id: 'q_spells', title: 'God of Ruin', desc: 'Cast 3 God Rituals', target: 3, current: 0, rewardGold: 75, rewardSouls: 30, claimed: false },
  { id: 'q_upgrades', title: 'Master Craftsman', desc: 'Upgrade 3 placed defenders', target: 3, current: 0, rewardGold: 90, rewardSouls: 35, claimed: false },
];

// Scratch Vectors to eliminate garbage collection stutters
const _scratchDir = new THREE.Vector3();
const _scratchProj = new THREE.Vector3();

export class GameEngine {
  constructor(scene, onLevelChangedCallback = null) {
    this.scene = scene;
    this.onLevelChanged = onLevelChangedCallback;

    // Player Resources
    this.baseMaxHealth = 20;
    this.maxHealth = 20;
    this.health = 20;
    this.gold = 175;
    this.souls = 45;

    // Soul Forge Mastery Upgrades (Ranks 0 to 3)
    this.masteryRanks = {
      damage_boost: 0,
      hearth_hp: 0,
      starting_gold: 0,
      soul_magnet: 0,
      spell_discount: 0,
    };

    // Quests Progress
    this.quests = JSON.parse(JSON.stringify(INITIAL_QUESTS));
    this.spellsCastCount = 0;
    this.upgradesPerformedCount = 0;

    // Level Management & Infinite Progression
    this.currentLevelIndex = 0;
    this.currentLevelDef = generateLevelDefinition(1);
    this.levelRoutes = this.currentLevelDef.routes && this.currentLevelDef.routes.length > 0 ? this.currentLevelDef.routes : [LEVEL_PATHS[0]];
    this.pathWaypoints = this.levelRoutes[0];
    this.levelTasks = this.currentLevelDef.levelTasks ? JSON.parse(JSON.stringify(this.currentLevelDef.levelTasks)) : [];
    this.activeMutator = this.currentLevelDef.mutator || REALM_MUTATORS[0];
    this.lastStarsEarned = 0;

    // Game Objects
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.soulOrbs = [];
    this.particles = [];

    // Blood Moon Frenzy Buff
    this.frenzyTimer = 0;

    // Selected Tower to inspect
    this.selectedTower = null;

    // Active spell casting mode
    this.activeCastingSpell = null;

    // Stars, High Level, Milestones & Challenges Persistence
    this.loadSavedGameState();

    // Wave Progression
    this.currentWave = 0;
    this.maxWaves = this.currentLevelDef.totalWaves;
    this.isWaveActive = false;
    this.waveSpawnQueue = [];
    this.waveSpawnTimer = 0;
    this.totalEnemiesInWave = 0;
    this.enemiesRemaining = 0;

    // Game Speed & State
    this.gameSpeed = 1.0;
    this.isGameOver = false;
    this.isLevelVictory = false;
    this.isCampaignVictory = false;
  }

  saveGameState() {
    try {
      const data = {
        currentLevelIndex: this.currentLevelIndex,
        maxLevelUnlocked: this.maxLevelUnlocked,
        souls: this.souls,
        gold: this.gold,
        masteryRanks: this.masteryRanks,
        levelStars: this.levelStars,
        claimedMilestones: this.claimedMilestones,
        activeChallenges: this.activeChallenges,
        quests: this.quests,
        totalKills: this.totalKills,
        totalSoulsCollected: this.totalSoulsCollected,
      };
      localStorage.setItem('gargoyle_save_v2', JSON.stringify(data));
      localStorage.setItem('gargoyle_stars', JSON.stringify(this.levelStars));
      localStorage.setItem('gargoyle_max_lvl', String(this.maxLevelUnlocked));
    } catch {}
  }

  loadSavedGameState() {
    try {
      this.levelStars = JSON.parse(localStorage.getItem('gargoyle_stars') || '{}');
      this.maxLevelUnlocked = parseInt(localStorage.getItem('gargoyle_max_lvl') || '1', 10);
      this.claimedMilestones = JSON.parse(localStorage.getItem('gargoyle_milestones') || '[]');
      this.activeChallenges = JSON.parse(localStorage.getItem('gargoyle_challenges') || '[]');
      this.totalKills = 0;
      this.totalSoulsCollected = 0;

      const raw = localStorage.getItem('gargoyle_save_v2');
      if (raw) {
        const data = JSON.parse(raw);
        if (typeof data.currentLevelIndex === 'number' && data.currentLevelIndex >= 0) {
          this.currentLevelIndex = data.currentLevelIndex;
          this.currentLevelDef = generateLevelDefinition(this.currentLevelIndex + 1);
          this.levelRoutes = this.currentLevelDef.routes && this.currentLevelDef.routes.length > 0 ? this.currentLevelDef.routes : [LEVEL_PATHS[0]];
          this.pathWaypoints = this.levelRoutes[0];
          this.levelTasks = this.currentLevelDef.levelTasks ? JSON.parse(JSON.stringify(this.currentLevelDef.levelTasks)) : [];
          this.activeMutator = this.currentLevelDef.mutator || REALM_MUTATORS[0];
        }
        if (typeof data.maxLevelUnlocked === 'number') this.maxLevelUnlocked = Math.max(this.maxLevelUnlocked, data.maxLevelUnlocked);
        if (typeof data.souls === 'number') this.souls = data.souls;
        if (typeof data.gold === 'number') this.gold = Math.max(this.gold, data.gold);
        if (data.masteryRanks) this.masteryRanks = Object.assign(this.masteryRanks, data.masteryRanks);
        if (data.levelStars) this.levelStars = Object.assign(this.levelStars, data.levelStars);
        if (Array.isArray(data.claimedMilestones)) this.claimedMilestones = data.claimedMilestones;
        if (Array.isArray(data.activeChallenges)) this.activeChallenges = data.activeChallenges;
        if (Array.isArray(data.quests)) this.quests = data.quests;
        if (typeof data.totalKills === 'number') this.totalKills = data.totalKills;
        if (typeof data.totalSoulsCollected === 'number') this.totalSoulsCollected = data.totalSoulsCollected;
      }
      this.applyMasteryBuffs();
    } catch {
      this.levelStars = {};
      this.maxLevelUnlocked = 1;
      this.claimedMilestones = [];
      this.activeChallenges = [];
      this.totalKills = 0;
      this.totalSoulsCollected = 0;
      this.applyMasteryBuffs();
    }
  }

  resetAllProgress() {
    try {
      localStorage.removeItem('gargoyle_save_v2');
      localStorage.removeItem('gargoyle_stars');
      localStorage.removeItem('gargoyle_max_lvl');
      localStorage.removeItem('gargoyle_milestones');
      localStorage.removeItem('gargoyle_challenges');
      localStorage.removeItem('gargoyle_gpu_model');
      localStorage.removeItem('gargoyle_tut_seen');
    } catch {}
    this.currentLevelIndex = 0;
    this.maxLevelUnlocked = 1;
    this.souls = 45;
    this.gold = 175;
    this.levelStars = {};
    this.claimedMilestones = [];
    this.activeChallenges = [];
    this.masteryRanks = { damage_boost: 0, hearth_hp: 0, starting_gold: 0, soul_magnet: 0, spell_discount: 0 };
    this.quests = JSON.parse(JSON.stringify(INITIAL_QUESTS));
    this.loadLevel(0);
  }

  // Star & Level Helpers
  getTotalStars() {
    return Object.values(this.levelStars).reduce((sum, s) => sum + (typeof s === 'number' ? s : 0), 0);
  }

  getLevelStars(levelNum) {
    return this.levelStars[levelNum] || 0;
  }

  isLevelUnlocked(levelNum) {
    return levelNum === 1 || levelNum <= this.maxLevelUnlocked;
  }

  hasMilestone(id) {
    return this.claimedMilestones.includes(id);
  }

  claimMilestone(milestoneId) {
    const ms = REALM_STAR_MILESTONES.find((m) => m.id === milestoneId);
    if (!ms || this.hasMilestone(milestoneId)) return false;
    if (this.getTotalStars() < ms.starsRequired) return false;

    this.claimedMilestones.push(milestoneId);
    this.applyMasteryBuffs();
    this.saveGameState();
    sound.playSoulCollectSound();
    return true;
  }

  hasChallenge(id) {
    return this.activeChallenges.includes(id);
  }

  toggleChallenge(challengeId) {
    const idx = this.activeChallenges.indexOf(challengeId);
    if (idx > -1) {
      this.activeChallenges.splice(idx, 1);
    } else {
      this.activeChallenges.push(challengeId);
    }
    this.applyMasteryBuffs();
    this.saveGameState();
    return this.hasChallenge(challengeId);
  }

  // Soul Forge Purchase
  purchaseSoulForgeUpgrade(upgradeId) {
    const upDef = SOUL_FORGE_UPGRADES[upgradeId];
    if (!upDef) return false;
    const currentRank = this.masteryRanks[upgradeId] || 0;
    if (currentRank >= upDef.maxRank) return false;

    const cost = upDef.costs[currentRank];
    if (this.souls < cost) return false;

    this.souls -= cost;
    this.masteryRanks[upgradeId] = currentRank + 1;
    this.applyMasteryBuffs();
    this.saveGameState();
    sound.playBuildSound();
    return true;
  }

  applyMasteryBuffs() {
    // Hearth HP
    this.maxHealth = this.baseMaxHealth + this.masteryRanks.hearth_hp * 5 + (this.hasMilestone('ms_aegis') ? 5 : 0);
    if (this.hasChallenge('hardcore_hearth')) this.maxHealth = 1;
    this.health = Math.min(this.health, this.maxHealth);

    // Dynamic tower damage recalculation
    const dmgMultiplier = (1.0 + (this.masteryRanks?.damage_boost || 0) * 0.15) * (this.activeMutator?.dmgMod || 1.0);
    if (Array.isArray(this.towers)) {
      for (let t of this.towers) {
        t.damage = (t.config.damage + (t.rank - 1) * 15) * dmgMultiplier;
      }
    }
  }

  claimQuest(questId) {
    const q = this.quests.find((item) => item.id === questId);
    if (!q || q.claimed || q.current < q.target) return false;

    q.claimed = true;
    this.gold += q.rewardGold;
    this.souls += q.rewardSouls;
    this.saveGameState();
    sound.playSoulCollectSound();
    return true;
  }

  // Load a specific Level (Infinite 1 to ∞)
  loadLevel(levelIndex) {
    this.currentLevelIndex = levelIndex;
    this.currentLevelDef = generateLevelDefinition(levelIndex + 1);
    this.activeMutator = this.currentLevelDef.mutator || REALM_MUTATORS[0];
    this.levelRoutes = this.currentLevelDef.routes && this.currentLevelDef.routes.length > 0 ? this.currentLevelDef.routes : [LEVEL_PATHS[0]];
    this.pathWaypoints = this.levelRoutes[0];
    this.levelTasks = this.currentLevelDef.levelTasks ? JSON.parse(JSON.stringify(this.currentLevelDef.levelTasks)) : [];
    this.currentWave = 0;
    this.maxWaves = this.currentLevelDef.totalWaves;
    this.isWaveActive = false;
    this.isLevelVictory = false;
    this.waveSpawnQueue = [];

    // Clear existing enemies & projectiles
    for (let e of this.enemies) {
      if (e.mesh) this.scene.remove(e.mesh);
    }
    this.enemies = [];

    for (let p of this.projectiles) {
      if (p.mesh) this.scene.remove(p.mesh);
    }
    this.projectiles = [];

    for (let s of this.soulOrbs) {
      if (s.mesh) this.scene.remove(s.mesh);
    }
    this.soulOrbs = [];

    for (let t of this.towers) {
      if (t.mesh) this.scene.remove(t.mesh);
    }
    this.towers = [];
    this.selectedTower = null;

    // Starting resources with mastery, milestones & challenges
    this.maxHealth = this.baseMaxHealth + (this.masteryRanks.hearth_hp || 0) * 5 + (this.hasMilestone('ms_aegis') ? 5 : 0);
    if (this.hasChallenge('hardcore_hearth')) this.maxHealth = 1;
    this.health = this.maxHealth;

    const startGoldBonus = (this.masteryRanks.starting_gold || 0) * 40 + (this.hasMilestone('ms_gold') ? 60 : 0);
    this.gold = Math.max(160, 160 + this.currentLevelIndex * 35 + startGoldBonus);

    if (this.onLevelChanged) {
      this.onLevelChanged(this.currentLevelDef, this.levelRoutes);
    }
    this.saveGameState();
  }

  jumpToLevel(levelNumber) {
    this.loadLevel(levelNumber - 1);
  }

  nextLevel() {
    this.loadLevel(this.currentLevelIndex + 1);
  }

  // Build a tower at grid (gx, gz)
  buildTower(type, gx, gz) {
    const config = TOWER_CONFIGS[type];
    if (!config) return null;
    if (this.gold < config.cost) return null;

    const occupied = this.towers.some((t) => t.gx === gx && t.gz === gz);
    if (occupied) return null;

    this.gold -= config.cost;
    sound.playBuildSound();

    let mesh;
    if (type === 'gargoyle') mesh = createGargoyleTower(1);
    else if (type === 'cauldron') mesh = createCauldronTower(1);
    else if (type === 'crypt') mesh = createCryptTower(1);
    else if (type === 'tesla') mesh = createTeslaTower(1);

    mesh.position.set(gx, 0, gz);
    this.scene.add(mesh);

    const dmgMultiplier = (1.0 + (this.masteryRanks.damage_boost || 0) * 0.15) * (this.activeMutator.dmgMod || 1.0);
    const rangeMultiplier = (this.activeMutator.rangeMod || 1.0) * (this.hasMilestone('ms_range') ? 1.12 : 1.0);
    const hasteMilestone = this.hasMilestone('ms_haste') ? 0.85 : 1.0;
    const hasteChallenge = this.hasChallenge('overclocked') ? 0.8 : 1.0;
    const fireRateMultiplier = (this.activeMutator.hasteMod || 1.0) * hasteMilestone * hasteChallenge;

    const tower = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      config,
      mesh,
      gx,
      gz,
      rank: 1,
      damage: config.damage * dmgMultiplier,
      range: config.range * rangeMultiplier,
      fireRate: config.fireRate * fireRateMultiplier,
      fireCooldown: 0,
      kills: 0,
      damageDealt: 0,
      target: null,
      freezeTimer: 0,
    };

    this.towers.push(tower);
    this.saveGameState();
    return tower;
  }

  upgradeTower(tower) {
    const nextRank = tower.rank + 1;
    const upgradeConfig = tower.config.upgrades.find((u) => u.rank === nextRank);
    if (!upgradeConfig) return false;
    if (this.gold < upgradeConfig.cost) return false;

    this.gold -= upgradeConfig.cost;
    tower.rank = nextRank;
    const dmgMultiplier = (1.0 + (this.masteryRanks.damage_boost || 0) * 0.15) * (this.activeMutator.dmgMod || 1.0);
    const rangeMultiplier = (this.activeMutator.rangeMod || 1.0) * (this.hasMilestone('ms_range') ? 1.12 : 1.0);
    tower.damage += (upgradeConfig.dmgAdd || 0) * dmgMultiplier;
    tower.range += (upgradeConfig.rangeAdd || 0) * rangeMultiplier;
    if (upgradeConfig.slowAdd && tower.config.slowPercent) {
      tower.config.slowPercent += upgradeConfig.slowAdd;
    }
    if (upgradeConfig.chainAdd && tower.config.chainCount) {
      tower.config.chainCount += upgradeConfig.chainAdd;
    }

    // Quest: Upgrades
    this.upgradesPerformedCount++;
    const qUp = this.quests.find((q) => q.id === 'q_upgrades');
    if (qUp && !qUp.claimed) {
      qUp.current = Math.min(qUp.target, this.upgradesPerformedCount);
    }

    sound.playBuildSound();

    this.scene.remove(tower.mesh);
    let newMesh;
    if (tower.type === 'gargoyle') newMesh = createGargoyleTower(tower.rank);
    else if (tower.type === 'cauldron') newMesh = createCauldronTower(tower.rank);
    else if (tower.type === 'crypt') newMesh = createCryptTower(tower.rank);
    else if (tower.type === 'tesla') newMesh = createTeslaTower(tower.rank);

    newMesh.position.set(tower.gx, 0, tower.gz);
    this.scene.add(newMesh);
    tower.mesh = newMesh;
    this.saveGameState();

    return true;
  }

  sellTower(tower) {
    const idx = this.towers.indexOf(tower);
    if (idx === -1) return;

    const refund = Math.floor(tower.config.cost * 0.65 * tower.rank);
    this.gold += refund;

    this.scene.remove(tower.mesh);
    this.towers.splice(idx, 1);

    if (this.selectedTower === tower) {
      this.selectedTower = null;
    }
    this.saveGameState();
    sound.playSoulCollectSound();
  }

  petTower(tower) {
    if (!tower) return;
    sound.playPetSound(tower.type);
    tower.mesh.position.y += 0.25;
    setTimeout(() => {
      if (tower.mesh) tower.mesh.position.y = 0;
    }, 200);
  }

  // Wave definitions & Spawning per level hardness
  startNextWave() {
    if (this.isWaveActive || this.currentWave >= this.maxWaves || this.isGameOver) return;

    this.currentWave++;
    this.isWaveActive = true;
    this.waveSpawnQueue = [];

    const lvl = this.currentLevelIndex + 1;
    const w = this.currentWave;
    const isFinalWave = w === this.maxWaves;

    if (isFinalWave) {
      // Boss Wave for this Level!
      const boss = this.currentLevelDef.bossType;
      this.enqueueEnemies(boss, 1, 3.0);
      this.enqueueEnemies('golem', 2 + lvl, 1.8);
      this.enqueueEnemies('necromancer', 1 + Math.floor(lvl / 2), 2.2);
      this.enqueueEnemies('imp', 10 + lvl * 4, 0.6);
    } else if (lvl === 1) {
      // Level 1: Gloomstone
      if (w === 1) this.enqueueEnemies('skeleton', 7, 1.2);
      else if (w === 2) {
        this.enqueueEnemies('skeleton', 9, 1.0);
        this.enqueueEnemies('imp', 3, 1.2);
      } else if (w === 3) {
        this.enqueueEnemies('imp', 6, 0.9);
        this.enqueueEnemies('skeleton', 8, 0.8);
      } else if (w === 4) {
        this.enqueueEnemies('skeleton', 10, 0.7);
        this.enqueueEnemies('imp', 8, 0.8);
        this.enqueueEnemies('golem', 1, 2.5);
      }
    } else if (lvl === 2) {
      // Level 2: Crimson Nether (Hellhounds & Golems)
      if (w === 1) this.enqueueEnemies('hellhound', 6, 1.0);
      else if (w === 2) {
        this.enqueueEnemies('skeleton', 10, 0.7);
        this.enqueueEnemies('hellhound', 6, 0.8);
      } else if (w === 3) {
        this.enqueueEnemies('hellhound', 8, 0.7);
        this.enqueueEnemies('golem', 2, 2.0);
      } else if (w === 4) {
        this.enqueueEnemies('imp', 12, 0.6);
        this.enqueueEnemies('hellhound', 8, 0.6);
        this.enqueueEnemies('golem', 3, 1.8);
      } else if (w === 5) {
        this.enqueueEnemies('hellhound', 14, 0.5);
        this.enqueueEnemies('golem', 4, 1.5);
      }
    } else if (lvl === 3) {
      // Level 3: Frostfall (Frost Banshees & Armored Foes)
      if (w === 1) this.enqueueEnemies('banshee', 5, 1.2);
      else if (w === 2) {
        this.enqueueEnemies('banshee', 6, 1.0);
        this.enqueueEnemies('skeleton', 12, 0.6);
      } else if (w === 3) {
        this.enqueueEnemies('banshee', 8, 0.9);
        this.enqueueEnemies('hellhound', 8, 0.7);
      } else if (w === 4) {
        this.enqueueEnemies('banshee', 8, 0.8);
        this.enqueueEnemies('golem', 4, 1.6);
      } else if (w === 5) {
        this.enqueueEnemies('banshee', 10, 0.7);
        this.enqueueEnemies('hellhound', 12, 0.5);
        this.enqueueEnemies('golem', 4, 1.5);
      } else if (w === 6) {
        this.enqueueEnemies('banshee', 12, 0.6);
        this.enqueueEnemies('golem', 6, 1.4);
      }
    } else {
      // Level 4+: Toxic Mire & Endless (Necromancers & Nightmare swarms)
      this.enqueueEnemies('necromancer', 2 + Math.floor(w / 2), 2.2);
      this.enqueueEnemies('banshee', 6 + w, 0.8);
      this.enqueueEnemies('hellhound', 10 + w * 2, 0.5);
      this.enqueueEnemies('golem', 3 + Math.floor(w / 2), 1.6);
    }

    this.totalEnemiesInWave = this.waveSpawnQueue.length;
    this.enemiesRemaining = this.totalEnemiesInWave;
    this.waveSpawnTimer = 0.5;
  }

  enqueueEnemies(type, count, interval, routeIndex = -1) {
    for (let i = 0; i < count; i++) {
      const assigned = routeIndex >= 0 ? routeIndex : (i % this.levelRoutes.length);
      this.waveSpawnQueue.push({ type, delay: interval, routeIndex: assigned });
    }
  }

  spawnEnemy(type, customPos = null, routeIndex = 0) {
    let mesh;
    const lvl = this.currentLevelIndex + 1;
    const w = this.currentWave;

    let maxHp = 70;
    let speed = 1.1;
    let goldReward = 12;
    let soulDropChance = 0.55;
    let isBoss = false;

    if (type === 'skeleton') {
      mesh = createSkeletonMesh();
      maxHp = 55 + lvl * 20 + w * 10;
      speed = 1.25;
      goldReward = 9;
    } else if (type === 'imp') {
      mesh = createImpMesh();
      maxHp = 80 + lvl * 25 + w * 12;
      speed = 1.45;
      goldReward = 12;
    } else if (type === 'hellhound') {
      mesh = createHellhoundMesh();
      maxHp = 75 + lvl * 22 + w * 12;
      speed = 1.85; // Very fast rusher
      goldReward = 14;
    } else if (type === 'banshee') {
      mesh = createBansheeMesh();
      maxHp = 120 + lvl * 30 + w * 15;
      speed = 1.1;
      goldReward = 16;
      soulDropChance = 0.75;
    } else if (type === 'necromancer') {
      mesh = createNecromancerMesh();
      maxHp = 220 + lvl * 50 + w * 20;
      speed = 0.85;
      goldReward = 28;
      soulDropChance = 0.9;
    } else if (type === 'golem') {
      mesh = createGolemMesh();
      maxHp = 300 + lvl * 70 + w * 30;
      speed = 0.65;
      goldReward = 32;
    } else if (type === 'boss_pumpkin') {
      mesh = createBossPumpkinMesh();
      maxHp = 1300 + lvl * 400;
      speed = 0.55;
      goldReward = 110;
      soulDropChance = 1.0;
      isBoss = true;
    } else if (type === 'boss_demon') {
      mesh = createBossBloodDemonMesh();
      maxHp = 2000 + lvl * 500;
      speed = 0.65;
      goldReward = 150;
      soulDropChance = 1.0;
      isBoss = true;
    } else if (type === 'boss_frost') {
      mesh = createBossFrostColossusMesh();
      maxHp = 2400 + lvl * 600;
      speed = 0.5;
      goldReward = 180;
      soulDropChance = 1.0;
      isBoss = true;
    }

    // Apply Endless Spire procedural scaling for floors 5+
    if (lvl > 4) {
      const spireFloor = lvl - 4;
      const hpScale = Math.pow(1.055, spireFloor);
      maxHp = Math.round(maxHp * hpScale);
      goldReward = Math.round(goldReward * Math.min(2.5, 1.0 + spireFloor * 0.08));
    }

    // Apply Mutators, Milestones & Challenge modifiers
    const hpMult = (this.activeMutator.hpMod || 1.0) * (this.hasChallenge('blood_pact') ? 1.3 : 1.0);
    const spdMult = (this.activeMutator.speedMod || 1.0) * (this.hasChallenge('overclocked') ? 1.25 : 1.0);
    const goldMult = (this.activeMutator.goldMod || 1.0) * (this.hasChallenge('overclocked') ? 1.3 : 1.0) * (this.hasChallenge('hardcore_hearth') ? 2.0 : 1.0);
    const soulMult = (this.activeMutator.soulMod || 1.0) * (this.hasChallenge('blood_pact') ? 1.5 : 1.0) * (this.hasChallenge('hardcore_hearth') ? 2.5 : 1.0) * (this.hasMilestone('ms_souls') ? 1.25 : 1.0);

    maxHp = Math.round(maxHp * hpMult);
    speed = speed * spdMult;
    goldReward = Math.round(goldReward * goldMult);
    soulDropChance = Math.min(1.0, soulDropChance * soulMult);

    // 3D Billboard Health Bar
    const hbGroup = new THREE.Group();
    hbGroup.position.y = isBoss ? 2.3 : 1.25;

    const hbBg = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 0.08),
      new THREE.MeshBasicMaterial({ color: 0x0f172a, side: THREE.DoubleSide })
    );
    hbGroup.add(hbBg);

    const hbFill = new THREE.Mesh(
      new THREE.PlaneGeometry(0.68, 0.06),
      new THREE.MeshBasicMaterial({ color: isBoss ? 0xf59e0b : 0x10b981, side: THREE.DoubleSide })
    );
    hbFill.position.z = 0.005;
    hbGroup.add(hbFill);
    mesh.add(hbGroup);

    const route = this.levelRoutes[routeIndex % this.levelRoutes.length] || this.pathWaypoints;
    const startPos = customPos ? customPos : route[0];
    mesh.position.copy(startPos);
    this.scene.add(mesh);

    const enemy = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      mesh,
      waypoints: route,
      routeIndex: routeIndex % this.levelRoutes.length,
      healthBarGroup: hbGroup,
      healthBarFill: hbFill,
      maxHp,
      hp: maxHp,
      speed,
      currentSpeed: speed,
      goldReward,
      soulDropChance,
      isBoss,
      waypointIndex: 0,
      distanceTraveled: 0,
      freezeTimer: 0,
      slowTimer: 0,
      speedAuraTimer: 0,
      summonCooldown: 4.5, // for Necromancer
      shoutCooldown: 3.5,  // for Banshee
      alive: true,
      animTime: Math.random() * 10,
    };

    this.enemies.push(enemy);
    return enemy;
  }

  // God Rituals
  castSpell(spellName, targetPos = null) {
    const discount = 1.0 - (this.masteryRanks.spell_discount || 0) * 0.15;
    const meteorCost = Math.round(20 * discount);
    const freezeCost = Math.round(25 * discount);
    const frenzyCost = Math.round(30 * discount);

    if (spellName === 'meteor') {
      if (this.souls < meteorCost || !targetPos) return false;
      this.souls -= meteorCost;
      sound.playSpellSound('meteor');
      this.createMeteorImpact(targetPos);
      this.trackSpellCast();
      return true;
    } else if (spellName === 'freeze') {
      if (this.souls < freezeCost) return false;
      this.souls -= freezeCost;
      sound.playSpellSound('freeze');
      this.enemies.forEach((e) => {
        e.freezeTimer = 4.0;
        e.currentSpeed = 0;
      });
      this.trackSpellCast();
      return true;
    } else if (spellName === 'frenzy') {
      if (this.souls < frenzyCost) return false;
      this.souls -= frenzyCost;
      sound.playSpellSound('frenzy');
      this.frenzyTimer = 7.0;
      this.trackSpellCast();
      return true;
    }
    return false;
  }

  trackSpellCast() {
    this.spellsCastCount++;
    const qSpells = this.quests.find((q) => q.id === 'q_spells');
    if (qSpells && !qSpells.claimed) {
      qSpells.current = Math.min(qSpells.target, this.spellsCastCount);
    }
  }

  createMeteorImpact(targetPos) {
    const meteor = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.7, 1),
      new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 3.0 })
    );
    meteor.position.set(targetPos.x, 9.0, targetPos.z);
    this.scene.add(meteor);

    const startPos = meteor.position.clone();
    const endPos = new THREE.Vector3(targetPos.x, 0.4, targetPos.z);
    let progress = 0;

    const animateMeteor = (delta) => {
      progress += delta * 3.5;
      if (progress < 1.0) {
        meteor.position.lerpVectors(startPos, endPos, progress);
        requestAnimationFrame(() => animateMeteor(0.016 * this.gameSpeed));
      } else {
        this.scene.remove(meteor);
        this.createShockwave(endPos, 2.8, 0xff5500);

        this.enemies.forEach((e) => {
          const d = e.mesh.position.distanceTo(endPos);
          if (d <= 2.8) {
            e.hp -= 240;
            e.freezeTimer = 1.2;
            if (e.hp <= 0 && e.alive) {
              this.killEnemy(e);
            }
          }
        });
      }
    };
    animateMeteor(0.016);
  }

  createShockwave(pos, maxRadius, colorHex) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.2, 0.45, 24),
      new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    ring.position.copy(pos);
    ring.rotation.x = -Math.PI / 2;
    this.scene.add(ring);

    let scale = 0.5;
    const expand = () => {
      scale += 0.22 * this.gameSpeed;
      ring.scale.set(scale, scale, scale);
      ring.material.opacity -= 0.05 * this.gameSpeed;
      if (ring.material.opacity > 0) {
        requestAnimationFrame(expand);
      } else {
        this.scene.remove(ring);
      }
    };
    expand();
  }

  // Update Game Loop
  update(delta, camera = null) {
    if (this.isGameOver || this.isLevelVictory) return;

    const effectiveDelta = delta * this.gameSpeed;

    // 1. Spawning from queue
    if (this.isWaveActive && this.waveSpawnQueue.length > 0) {
      this.waveSpawnTimer -= effectiveDelta;
      if (this.waveSpawnTimer <= 0) {
        const next = this.waveSpawnQueue.shift();
        this.spawnEnemy(next.type, null, next.routeIndex || 0);
        this.waveSpawnTimer = next.delay;
      }
    }

    // 2. Frenzy Buff
    if (this.frenzyTimer > 0) {
      this.frenzyTimer -= effectiveDelta;
    }

    // 3. Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (!e.alive) {
        this.scene.remove(e.mesh);
        this.enemies.splice(i, 1);
        continue;
      }

      // Status effects: Freeze, Slow, and Speed Aura
      if (e.freezeTimer > 0) {
        e.freezeTimer -= effectiveDelta;
        e.currentSpeed = 0;
      } else if (e.speedAuraTimer > 0) {
        e.speedAuraTimer -= effectiveDelta;
        e.currentSpeed = e.speed * 1.45; // Haste buff
      } else if (e.slowTimer > 0) {
        e.slowTimer -= effectiveDelta;
        e.currentSpeed = e.speed * 0.55;
      } else {
        e.currentSpeed = e.speed;
      }

      // Enrage Boss behavior (below 40% HP)
      if (e.isBoss && e.hp < e.maxHp * 0.4 && e.freezeTimer <= 0) {
        e.currentSpeed = e.speed * 1.6;
      }

      // Unique Special Behavior: Necromancer Summoning
      if (e.type === 'necromancer' && e.freezeTimer <= 0) {
        e.summonCooldown -= effectiveDelta;
        if (e.summonCooldown <= 0) {
          e.summonCooldown = 5.0;
          sound.playShootSound('crypt');
          const spawnLoc = e.mesh.position.clone();
          spawnLoc.x += (Math.random() - 0.5) * 0.6;
          spawnLoc.z += (Math.random() - 0.5) * 0.6;
          const minion = this.spawnEnemy('skeleton', spawnLoc, e.routeIndex || 0);
          minion.waypointIndex = Math.min(e.waypointIndex, (e.waypoints || this.pathWaypoints).length - 2);
          this.createShockwave(spawnLoc, 1.2, 0xa855f7);
        }
      }

      // Unique Special Behavior: Banshee Screech Aura
      if (e.type === 'banshee' && e.freezeTimer <= 0) {
        e.shoutCooldown -= effectiveDelta;
        if (e.shoutCooldown <= 0) {
          e.shoutCooldown = 4.0;
          this.createShockwave(e.mesh.position, 2.2, 0x38bdf8);
          this.enemies.forEach((other) => {
            if (other !== e && other.alive && e.mesh.position.distanceTo(other.mesh.position) <= 2.5) {
              other.speedAuraTimer = 2.5;
            }
          });
        }
      }

      // Movement along Waypoints without per-frame allocations
      if (e.currentSpeed > 0) {
        const wpList = e.waypoints || this.pathWaypoints;
        const targetWp = wpList[e.waypointIndex + 1];
        if (targetWp) {
          _scratchDir.subVectors(targetWp, e.mesh.position);
          _scratchDir.y = 0;
          const dist = _scratchDir.length();
          const step = e.currentSpeed * effectiveDelta;

          if (dist <= step) {
            e.mesh.position.x = targetWp.x;
            e.mesh.position.z = targetWp.z;
            e.waypointIndex++;
            if (e.waypointIndex >= wpList.length - 1) {
              this.reachGoal(e);
              continue;
            }
          } else {
            _scratchDir.normalize();
            e.mesh.position.addScaledVector(_scratchDir, step);
            // Smoothly align with walking direction
            const targetAngle = Math.atan2(_scratchDir.x, _scratchDir.z);
            e.mesh.rotation.y = targetAngle;
          }
          e.distanceTraveled += step;
        }
      }

      // Update 3D billboard health bar orientation & fill
      if (camera && e.healthBarGroup) {
        e.healthBarGroup.lookAt(camera.position);
      }
      if (e.healthBarFill) {
        const pct = Math.max(0.001, e.hp / e.maxHp);
        e.healthBarFill.scale.x = pct;
        e.healthBarFill.position.x = -(1 - pct) * 0.34;
      }

      // Realistic walk strides & cadence along the road
      e.animTime += effectiveDelta * 7;
      if (e.type === 'skeleton') {
        if (e.mesh.userData.skull) e.mesh.userData.skull.position.y = 0.65 + Math.sin(e.animTime * 1.5) * 0.04;
        if (e.mesh.userData.leftLeg) e.mesh.userData.leftLeg.rotation.x = Math.sin(e.animTime) * 0.45;
        if (e.mesh.userData.rightLeg) e.mesh.userData.rightLeg.rotation.x = -Math.sin(e.animTime) * 0.45;
      } else if (e.type === 'hellhound') {
        if (e.mesh.userData.head) e.mesh.userData.head.position.y = 0.48 + Math.sin(e.animTime * 2) * 0.05;
        e.mesh.position.y = 0.04 + Math.abs(Math.sin(e.animTime * 2)) * 0.06;
      } else if (e.type === 'imp') {
        e.mesh.position.y = 0.25 + Math.sin(e.animTime * 2.2) * 0.08;
      } else if (e.type === 'banshee') {
        e.mesh.position.y = 0.45 + Math.sin(e.animTime * 0.8) * 0.14;
      } else if (e.type === 'golem') {
        e.mesh.position.y = 0.02 + Math.abs(Math.sin(e.animTime * 0.8)) * 0.04;
      }
    }

    // 4. Update Towers
    const fireRateMultiplier = this.frenzyTimer > 0 ? 0.5 : 1.0;

    for (let t of this.towers) {
      if (t.freezeTimer > 0) {
        t.freezeTimer -= effectiveDelta;
        continue;
      }

      t.fireCooldown -= effectiveDelta;
      t.target = null;
      let maxDistTraveled = -1;

      for (let e of this.enemies) {
        if (!e.alive) continue;
        const d = t.mesh.position.distanceTo(e.mesh.position);
        if (d <= t.range) {
          if (e.distanceTraveled > maxDistTraveled) {
            maxDistTraveled = e.distanceTraveled;
            t.target = e;
          }
        }
      }

      if (t.target && t.mesh.userData.upper) {
        t.mesh.userData.upper.lookAt(t.target.mesh.position.x, t.target.mesh.position.y + 1.1, t.target.mesh.position.z);
      }

      if (t.type === 'cauldron' && t.mesh.userData.spoonGroup) {
        t.mesh.userData.spoonGroup.rotation.y += effectiveDelta * 3;
      }

      if (t.type === 'tesla' && t.mesh.userData.crystal) {
        t.mesh.userData.crystal.rotation.y += effectiveDelta * 2.5;
      }

      if (t.target && t.fireCooldown <= 0) {
        this.fireTower(t);
        t.fireCooldown = t.fireRate * fireRateMultiplier;
      }
    }

    // 5. Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const target = p.target;

      if (!target || !target.alive) {
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
        continue;
      }

      _scratchProj.subVectors(target.mesh.position, p.mesh.position);
      _scratchProj.y += 0.4;
      const dist = _scratchProj.length();
      const step = p.speed * effectiveDelta;

      if (dist <= step) {
        this.hitEnemy(p.tower, target, p);
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      } else {
        _scratchProj.normalize();
        p.mesh.position.addScaledVector(_scratchProj, step);
      }
    }

    // 6. Update Soul Orbs
    for (let i = this.soulOrbs.length - 1; i >= 0; i--) {
      const orb = this.soulOrbs[i];
      orb.age += effectiveDelta;
      orb.mesh.position.y = 0.5 + Math.sin(orb.age * 3) * 0.18;
      orb.mesh.rotation.y += effectiveDelta * 2;

      if (orb.age > 9.0) {
        this.scene.remove(orb.mesh);
        this.soulOrbs.splice(i, 1);
      }
    }

    // 7. Check Wave & Level Completion
    if (this.isWaveActive && this.waveSpawnQueue.length === 0 && this.enemies.length === 0) {
      this.isWaveActive = false;
      this.gold += 35 + this.currentWave * 12 + this.currentLevelIndex * 15;
      sound.playSoulCollectSound();

      // Quest: Night waves survived
      const qWv = this.quests.find((q) => q.id === 'q_waves');
      if (qWv && !qWv.claimed) {
        qWv.current = Math.min(qWv.target, qWv.current + 1);
      }

      this.saveGameState();

      if (this.currentWave >= this.maxWaves) {
        this.triggerLevelVictory();
      }
    }
  }

  fireTower(tower) {
    sound.playShootSound(tower.type);

    if (tower.type === 'tesla') {
      this.createChainLightning(tower, tower.target);
    } else {
      let pColor = 0xff6600;
      let pSize = 0.18;
      if (tower.type === 'cauldron') {
        pColor = 0x22c55e;
        pSize = 0.22;
      } else if (tower.type === 'crypt') {
        pColor = 0x38bdf8;
        pSize = 0.16;
      }

      const pMesh = new THREE.Mesh(
        new THREE.SphereGeometry(pSize, 8, 8),
        new THREE.MeshBasicMaterial({ color: pColor })
      );
      pMesh.position.set(tower.mesh.position.x, 1.4, tower.mesh.position.z);
      this.scene.add(pMesh);

      const speed = tower.config.projectileSpeed || 8.0;

      this.projectiles.push({
        mesh: pMesh,
        tower,
        target: tower.target,
        speed,
      });

      if (tower.type === 'gargoyle' && tower.mesh.userData.leftWing) {
        tower.mesh.userData.leftWing.rotation.y = Math.PI - 0.7;
        tower.mesh.userData.rightWing.rotation.y = 0.7;
        setTimeout(() => {
          if (tower.mesh.userData.leftWing) {
            tower.mesh.userData.leftWing.rotation.y = Math.PI - 0.3;
            tower.mesh.userData.rightWing.rotation.y = 0.3;
          }
        }, 180);
      }
    }
  }

  createChainLightning(tower, primaryTarget) {
    const hits = [primaryTarget];
    let current = primaryTarget;
    const maxChain = (tower.config.chainCount || 4) + (this.hasMilestone('ms_chain') ? 1 : 0);
    const chainRange = tower.config.chainRange || 2.5;

    for (let c = 1; c < maxChain; c++) {
      let nextTarget = null;
      let closestDist = chainRange;

      for (let e of this.enemies) {
        if (!e.alive || hits.includes(e)) continue;
        const d = current.mesh.position.distanceTo(e.mesh.position);
        if (d < closestDist) {
          closestDist = d;
          nextTarget = e;
        }
      }

      if (nextTarget) {
        hits.push(nextTarget);
        current = nextTarget;
      } else {
        break;
      }
    }

    for (let i = 0; i < hits.length; i++) {
      const startPos = i === 0
        ? new THREE.Vector3(tower.mesh.position.x, 2.0, tower.mesh.position.z)
        : hits[i - 1].mesh.position.clone().add(new THREE.Vector3(0, 0.5, 0));
      const endPos = hits[i].mesh.position.clone().add(new THREE.Vector3(0, 0.5, 0));

      this.drawLightningArc(startPos, endPos);
      this.hitEnemy(tower, hits[i], null, tower.damage * (1 - i * 0.15));
    }
  }

  drawLightningArc(start, end) {
    const points = [start];
    const segs = 4;
    for (let i = 1; i < segs; i++) {
      const mid = new THREE.Vector3().lerpVectors(start, end, i / segs);
      mid.x += (Math.random() - 0.5) * 0.4;
      mid.y += (Math.random() - 0.5) * 0.4;
      mid.z += (Math.random() - 0.5) * 0.4;
      points.push(mid);
    }
    points.push(end);

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: 0xc084fc, linewidth: 2 });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    setTimeout(() => {
      this.scene.remove(line);
      geo.dispose();
      mat.dispose();
    }, 120);
  }

  hitEnemy(tower, target, projectile = null, customDmg = null) {
    let dmg = customDmg !== null ? customDmg : tower.damage;

    // Golems have 35% physical armor reduction against gargoyle
    if (target.type === 'golem' && tower.type === 'gargoyle') {
      dmg *= 0.65;
    }

    target.hp -= dmg;
    tower.damageDealt += dmg;
    sound.playHitSound();

    if (tower.type === 'cauldron' && tower.config.splashRadius) {
      const slowDur = (tower.config.slowDuration || 2.8) + (this.hasMilestone('ms_acid') ? 1.0 : 0);
      target.slowTimer = slowDur;
      this.enemies.forEach((other) => {
        if (other !== target && other.alive) {
          const d = target.mesh.position.distanceTo(other.mesh.position);
          if (d <= tower.config.splashRadius) {
            other.hp -= dmg * 0.65;
            other.slowTimer = slowDur;
            if (other.hp <= 0 && other.alive) {
              this.killEnemy(other, tower);
            }
          }
        }
      });
    }

    if (target.hp <= 0 && target.alive) {
      this.killEnemy(target, tower);
    }
  }

  killEnemy(enemy, tower = null) {
    enemy.alive = false;
    this.totalKills++;
    if (tower) tower.kills++;

    this.gold += enemy.goldReward;

    // Track Quests
    const qKills = this.quests.find((q) => q.id === 'q_kills');
    if (qKills && !qKills.claimed) {
      qKills.current = Math.min(qKills.target, this.totalKills);
    }

    // Track Level Tasks
    if (this.levelTasks) {
      for (let task of this.levelTasks) {
        if (!task.completed) {
          if (task.id.includes('garg') && (tower && tower.type === 'gargoyle')) {
            task.current = Math.min(task.target, task.current + 1);
          } else if (task.id.includes('slay') && enemy.type === 'hellhound') {
            task.current = Math.min(task.target, task.current + 1);
          } else if (task.id.includes('colossus') && enemy.type === 'boss_frost') {
            task.current = Math.min(task.target, task.current + 1);
          } else if (task.id.includes('purge') || task.id.includes('kill') || task.id.includes('banish')) {
            task.current = Math.min(task.target, task.current + 1);
          }
          if (task.current >= task.target) {
            task.completed = true;
            this.gold += task.rewardGold;
            this.souls += task.rewardSouls;
          }
        }
      }
    }

    // Drop Soul Orb with current theme coloring
    if (Math.random() < enemy.soulDropChance) {
      const orbMesh = createSoulOrb(this.currentLevelDef.theme);
      orbMesh.position.copy(enemy.mesh.position);
      orbMesh.position.y = 0.5;
      this.scene.add(orbMesh);

      this.soulOrbs.push({
        id: Math.random().toString(36).substr(2, 9),
        mesh: orbMesh,
        value: enemy.isBoss ? 30 : 6,
        age: 0,
      });
    }

    this.saveGameState();
  }

  collectSoulOrb(orb) {
    const idx = this.soulOrbs.indexOf(orb);
    if (idx === -1) return;

    const bonus = (this.masteryRanks.soul_magnet || 0) * 2;
    const finalVal = orb.value + bonus;
    this.souls += finalVal;
    this.totalSoulsCollected += finalVal;
    sound.playSoulCollectSound();

    // Quest: Souls
    const qSouls = this.quests.find((q) => q.id === 'q_souls');
    if (qSouls && !qSouls.claimed) {
      qSouls.current = Math.min(qSouls.target, this.totalSoulsCollected);
    }

    this.createShockwave(orb.mesh.position, 1.2, 0x10b981);
    this.scene.remove(orb.mesh);
    this.soulOrbs.splice(idx, 1);
    this.saveGameState();
  }

  reachGoal(enemy) {
    enemy.alive = false;
    this.createShockwave(enemy.mesh.position, 1.2, 0xef4444);
    const dmg = enemy.isBoss ? 5 : 1;
    this.health = Math.max(0, this.health - dmg);

    if (this.onCastleDamaged) {
      this.onCastleDamaged(dmg, enemy);
    }

    if (this.health <= 0) {
      this.triggerGameOver();
    }
  }

  triggerGameOver() {
    this.isGameOver = true;
    sound.playDefeatSound();
  }

  triggerLevelVictory() {
    this.isLevelVictory = true;
    sound.playVictorySound();

    const hpRatio = this.health / this.maxHealth;
    const stars = hpRatio >= 1.0 ? 3 : hpRatio >= 0.5 ? 2 : 1;
    this.lastStarsEarned = stars;
    const lvlNum = this.currentLevelDef.level;
    this.levelStars[lvlNum] = Math.max(this.levelStars[lvlNum] || 0, stars);
    this.maxLevelUnlocked = Math.max(this.maxLevelUnlocked, lvlNum + 1);

    this.saveGameState();
  }
}
