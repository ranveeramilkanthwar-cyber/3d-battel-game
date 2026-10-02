// ==========================================================================
// GARGOYLE'S KEEP: MULTI-THEME 3D PROCEDURAL ASSET GENERATOR
// Handcrafted stylized gothic 3D models with Themes & Expanded Bestiary
// ==========================================================================

import * as THREE from 'three';

// Dynamic Theme Presets
export const THEMES = {
  gothic: {
    id: 'gothic',
    name: 'Gloomstone Graveyard',
    sub: 'Chilled Midnight & Soul Hearth',
    skyColor: 0x060710,
    fogColor: 0x0a0d18,
    fogDensity: 0.038,
    ambientLight: 0x272b4c,
    ambientIntensity: 1.2,
    moonLight: 0x93c5fd,
    moonIntensity: 2.4,
    moonColor: 0xf1f5f9,
    accentGlow: 0x10b981,
    groundColor: 0x2d3a33,
    stoneColor: 0x3e4452,
    cobbleColor: 0x4f5466,
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Nethermaw',
    sub: 'Blood Moon & Molten Caverns',
    skyColor: 0x150406,
    fogColor: 0x1c0609,
    fogDensity: 0.042,
    ambientLight: 0x4a1217,
    ambientIntensity: 1.3,
    moonLight: 0xf87171,
    moonIntensity: 2.8,
    moonColor: 0xef4444, // Blood Moon!
    accentGlow: 0xdc2626,
    groundColor: 0x280e12,
    stoneColor: 0x1e1518,
    cobbleColor: 0x3b1c20,
  },
  frost: {
    id: 'frost',
    name: 'Frostfall Citadel',
    sub: 'Glacial Winds & Frozen Crypts',
    skyColor: 0x040c18,
    fogColor: 0x09192c,
    fogDensity: 0.035,
    ambientLight: 0x1e3a5f,
    ambientIntensity: 1.4,
    moonLight: 0x7dd3fc,
    moonIntensity: 2.6,
    moonColor: 0xe0f2fe,
    accentGlow: 0x38bdf8,
    groundColor: 0x1e293b,
    stoneColor: 0x334155,
    cobbleColor: 0x475569,
  },
  toxic: {
    id: 'toxic',
    name: 'Alchemist Mire',
    sub: 'Emerald Ooze & Toxic Horrors',
    skyColor: 0x03120b,
    fogColor: 0x061c12,
    fogDensity: 0.040,
    ambientLight: 0x0f3b25,
    ambientIntensity: 1.3,
    moonLight: 0x4ade80,
    moonIntensity: 2.5,
    moonColor: 0x86efac,
    accentGlow: 0x22c55e,
    groundColor: 0x142b1f,
    stoneColor: 0x20352a,
    cobbleColor: 0x2e4a3c,
  },
  celestial: {
    id: 'celestial',
    name: 'Sanctuary of the Sun',
    sub: 'Celestial Dawn & Sunfire Altar (Light Theme)',
    skyColor: 0xe0f2fe,
    fogColor: 0xbae6fd,
    fogDensity: 0.022,
    ambientLight: 0xfef9c3,
    ambientIntensity: 1.8,
    moonLight: 0xfde047,
    moonIntensity: 3.0,
    moonColor: 0xfef08a,
    accentGlow: 0xeab308,
    groundColor: 0x22c55e,
    stoneColor: 0xf1f5f9,
    cobbleColor: 0xe2e8f0,
  },
};

// Base Materials
export const Materials = {
  stone: new THREE.MeshStandardMaterial({ color: 0x3e4452, roughness: 0.85, metalness: 0.1, flatShading: true }),
  obsidian: new THREE.MeshStandardMaterial({ color: 0x181a24, roughness: 0.35, metalness: 0.4, flatShading: true }),
  mossStone: new THREE.MeshStandardMaterial({ color: 0x2d3a33, roughness: 0.9, metalness: 0.05, flatShading: true }),
  cobblestone: new THREE.MeshStandardMaterial({ color: 0x4f5466, roughness: 0.8, metalness: 0.15, flatShading: true }),
  iron: new THREE.MeshStandardMaterial({ color: 0x222530, roughness: 0.5, metalness: 0.8 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x4a2e1b, roughness: 0.8, flatShading: true }),
  gold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8, emissive: 0xd97706, emissiveIntensity: 0.2 }),
  glowAmber: new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 2.2, roughness: 0.2 }),
  glowJade: new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 2.0, roughness: 0.2 }),
  glowSlime: new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 1.8, roughness: 0.3 }),
  glowPurple: new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 2.4, roughness: 0.2 }),
  glowCrimson: new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 2.5, roughness: 0.2 }),
  glowFrost: new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 2.0, transparent: true, opacity: 0.85, roughness: 0.1 }),
  bone: new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.7, flatShading: true }),
  redImp: new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6, flatShading: true }),
  netherDemon: new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.5, metalness: 0.3, flatShading: true }),
  ghostTranslucent: new THREE.MeshStandardMaterial({ color: 0x818cf8, emissive: 0x4f46e5, emissiveIntensity: 1.2, transparent: true, opacity: 0.75, roughness: 0.1 }),
  iceCrystal: new THREE.MeshStandardMaterial({ color: 0xbae6fd, emissive: 0x0284c7, emissiveIntensity: 1.5, transparent: true, opacity: 0.8, roughness: 0.1 }),
};

// ==========================================================================
// ==========================================================================
// 1. 3D VILLAGE STRUCTURES & REAL-WORLD ASSETS (Houses, Towers, Lanterns)
// ==========================================================================

// 3D Gothic Village House / Cottage
export function createGothicHouse(themeId = 'gothic') {
  const group = new THREE.Group();

  // Stone Base & Timber Walls
  const wallMat = themeId === 'frost' ? Materials.stone : (themeId === 'crimson' ? Materials.obsidian : Materials.stone);
  const walls = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.4), wallMat);
  walls.position.y = 0.6;
  walls.castShadow = true;
  walls.receiveShadow = true;
  group.add(walls);

  // Timber Corner Beams
  for (let bx of [-0.8, 0.8]) {
    for (let bz of [-0.7, 0.7]) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.25, 0.12), Materials.wood);
      beam.position.set(bx, 0.625, bz);
      beam.castShadow = true;
      group.add(beam);
    }
  }

  // Pitched Roof
  const roofMat = themeId === 'frost' ? Materials.iceCrystal : (themeId === 'crimson' ? Materials.netherDemon : Materials.wood);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.9, 4), roofMat);
  roof.position.y = 1.65;
  roof.rotation.y = Math.PI / 4;
  roof.scale.set(1.15, 1.0, 1.0);
  roof.castShadow = true;
  group.add(roof);

  // Stone Chimney
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.3), Materials.stone);
  chimney.position.set(0.45, 1.8, 0.2);
  chimney.castShadow = true;
  group.add(chimney);

  // Glowing Warm Window
  const winMat = themeId === 'frost' ? Materials.glowFrost : (themeId === 'toxic' ? Materials.glowSlime : Materials.glowAmber);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.45), winMat);
  win.position.set(0, 0.7, 0.71);
  group.add(win);

  // Wooden Door
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.65), Materials.wood);
  door.position.set(-0.4, 0.35, 0.71);
  group.add(door);

  return group;
}

// 3D Medieval Watchtower
export function createWatchtower(themeId = 'gothic') {
  const group = new THREE.Group();

  // Tower Base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.85, 2.8, 8), Materials.stone);
  base.position.y = 1.4;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  // Watchtower Lookout Platform
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.7, 0.25, 8), Materials.wood);
  platform.position.y = 2.9;
  platform.castShadow = true;
  group.add(platform);

  // Crenelated Battlements
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const battle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.3, 0.12), Materials.stone);
    battle.position.set(Math.cos(angle) * 0.8, 3.15, Math.sin(angle) * 0.8);
    battle.castShadow = true;
    group.add(battle);
  }

  // Hanging Beacon Lantern
  const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.2), Materials.glowAmber);
  beacon.position.set(0, 3.4, 0);
  group.add(beacon);

  return group;
}

// 3D Gothic Street Lantern
export function createStreetLantern() {
  const group = new THREE.Group();

  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.8, 6), Materials.iron);
  post.position.y = 0.9;
  post.castShadow = true;
  group.add(post);

  const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.35), Materials.iron);
  bracket.position.set(0, 1.75, 0.15);
  group.add(bracket);

  const lantern = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16), Materials.glowAmber);
  lantern.position.set(0, 1.65, 0.3);
  group.add(lantern);

  return group;
}

// 3D Glowing Portal Gateway for Route Incursions
export function createPortalArchway(routeIndex = 0) {
  const group = new THREE.Group();

  const portalStyles = [
    { ring: 0xa855f7, mat: Materials.glowPurple, light: 0xc084fc }, // Portal Alpha: Violet Void
    { ring: 0xef4444, mat: Materials.glowCrimson, light: 0xf87171 }, // Portal Beta: Crimson Nether
    { ring: 0x38bdf8, mat: Materials.glowFrost, light: 0x7dd3fc },   // Portal Gamma: Frost Glacier
  ];
  const pCol = portalStyles[routeIndex % portalStyles.length];

  // Stone Gateway Pillars
  const pillarGeo = new THREE.BoxGeometry(0.35, 2.4, 0.35);
  const leftPillar = new THREE.Mesh(pillarGeo, Materials.stone);
  leftPillar.position.set(-0.85, 1.2, 0);
  leftPillar.castShadow = true;
  group.add(leftPillar);

  const rightPillar = new THREE.Mesh(pillarGeo, Materials.stone);
  rightPillar.position.set(0.85, 1.2, 0);
  rightPillar.castShadow = true;
  group.add(rightPillar);

  // Arched Top Lintel
  const archGeo = new THREE.BoxGeometry(2.1, 0.4, 0.4);
  const arch = new THREE.Mesh(archGeo, Materials.stone);
  arch.position.set(0, 2.5, 0);
  arch.castShadow = true;
  group.add(arch);

  // Swirling Portal Ring
  const ringGeo = new THREE.TorusGeometry(0.72, 0.12, 12, 24);
  const ring = new THREE.Mesh(ringGeo, pCol.mat);
  ring.position.set(0, 1.35, 0);
  group.add(ring);

  // Glowing Vortex Core
  const coreGeo = new THREE.CircleGeometry(0.65, 16);
  const coreMat = new THREE.MeshBasicMaterial({
    color: pCol.ring,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.set(0, 1.35, 0);
  group.add(core);

  // Portal Light
  const pLight = new THREE.PointLight(pCol.light, 2.5, 6);
  pLight.position.set(0, 1.4, 0.3);
  group.add(pLight);

  group.userData = { ring, core };
  return group;
}

// 3D Ancient Stone Connecting Bridge (For Dual Island spaces)
export function createStoneBridge(length = 4.5) {
  const group = new THREE.Group();

  // Bridge Span
  const span = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, length), Materials.stone);
  span.position.set(0, 0.05, 0);
  span.receiveShadow = true;
  group.add(span);

  // Side Railings / Parapets
  const railGeo = new THREE.BoxGeometry(0.2, 0.5, length);
  const leftRail = new THREE.Mesh(railGeo, Materials.cobblestone);
  leftRail.position.set(-1.0, 0.35, 0);
  leftRail.castShadow = true;
  group.add(leftRail);

  const rightRail = new THREE.Mesh(railGeo, Materials.cobblestone);
  rightRail.position.set(1.0, 0.35, 0);
  rightRail.castShadow = true;
  group.add(rightRail);

  return group;
}

// ==========================================================================
// 2. MULTI-SPACE & MULTI-THEME FLOATING ISLAND BUILDER
// ==========================================================================

export function createThemedFloatingIsland(themeId = 'gothic', spaceType = 'standard') {
  const theme = THEMES[themeId] || THEMES.gothic;
  const group = new THREE.Group();

  // Create theme-specific ground materials
  const groundMat = new THREE.MeshStandardMaterial({
    color: theme.groundColor,
    roughness: 0.9,
    metalness: 0.1,
    flatShading: true,
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    color: theme.stoneColor,
    roughness: 0.85,
    metalness: 0.15,
    flatShading: true,
  });

  // Calculate island dimensions based on Space Type
  let topRadius = 11.5;
  let underRadius = 9.5;
  let coneHeight = 9.0;
  let isDual = spaceType === 'dual';

  if (spaceType === 'compact') {
    topRadius = 8.0;
    underRadius = 6.8;
    coneHeight = 7.0;
  } else if (spaceType === 'grand') {
    topRadius = 15.0;
    underRadius = 12.5;
    coneHeight = 11.0;
  }

  if (isDual) {
    // DUAL ISLAND SPACE: Two floating island masses connected by stone bridge
    // Island 1: North Incursion Plateau
    const northTop = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 5.2, 1.2, 16), groundMat);
    northTop.position.set(0, -0.6, -4.8);
    northTop.receiveShadow = true;
    group.add(northTop);

    const northUnder = new THREE.Mesh(new THREE.ConeGeometry(5.2, 6.5, 14), stoneMat);
    northUnder.position.set(0, -4.5, -4.8);
    northUnder.rotation.x = Math.PI;
    northUnder.receiveShadow = true;
    group.add(northUnder);

    // Island 2: South Sanctum Plateau
    const southTop = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 5.2, 1.2, 16), groundMat);
    southTop.position.set(0, -0.6, 4.0);
    southTop.receiveShadow = true;
    group.add(southTop);

    const southUnder = new THREE.Mesh(new THREE.ConeGeometry(5.2, 6.5, 14), stoneMat);
    southUnder.position.set(0, -4.5, 4.0);
    southUnder.rotation.x = Math.PI;
    southUnder.receiveShadow = true;
    group.add(southUnder);

    // Connecting Stone Bridge across the void
    const bridge = createStoneBridge(3.8);
    bridge.position.set(0, 0, -0.4);
    group.add(bridge);

    // Village House & Watchtower on dual plateaus
    const house = createGothicHouse(themeId);
    house.position.set(-3.2, 0, -4.8);
    house.rotation.y = 0.3;
    group.add(house);

    const tower = createWatchtower(themeId);
    tower.position.set(3.2, 0, 4.0);
    group.add(tower);

    const lamp1 = createStreetLantern();
    lamp1.position.set(-1.4, 0, -0.4);
    group.add(lamp1);

    const lamp2 = createStreetLantern();
    lamp2.position.set(1.4, 0, -0.4);
    group.add(lamp2);
  } else {
    // SINGLE ISLAND SPACE: Compact, Standard, or Grand
    const topGeo = new THREE.CylinderGeometry(topRadius, underRadius, 1.2, 16);
    const topMesh = new THREE.Mesh(topGeo, groundMat);
    topMesh.position.y = -0.6;
    topMesh.receiveShadow = true;
    group.add(topMesh);

    const underGeo = new THREE.ConeGeometry(underRadius, coneHeight, 14);
    const underMesh = new THREE.Mesh(underGeo, stoneMat);
    underMesh.position.y = -coneHeight * 0.6;
    underMesh.rotation.x = Math.PI;
    underMesh.receiveShadow = true;
    group.add(underMesh);

    // Village Cottages according to space size
    const housePositions = spaceType === 'grand'
      ? [[-6.8, -5.2, 0.4], [6.8, -5.2, -0.4], [-7.5, 3.8, 0.8], [7.5, 3.8, -0.8]]
      : (spaceType === 'compact' ? [[-4.2, -2.5, 0.2]] : [[-5.2, -3.8, 0.3], [5.2, -3.8, -0.3]]);

    housePositions.forEach(([hx, hz, rot]) => {
      const house = createGothicHouse(themeId);
      house.position.set(hx, 0, hz);
      house.rotation.y = rot;
      group.add(house);
    });

    // Watchtowers
    const towerPositions = spaceType === 'grand'
      ? [[-9.5, 0, 0], [9.5, 0, 0], [0, -9.5, 0]]
      : [[-topRadius * 0.72, 0, 2.5]];

    towerPositions.forEach(([tx, tz]) => {
      const tower = createWatchtower(themeId);
      tower.position.set(tx, 0, tz);
      group.add(tower);
    });

    // Street Lanterns along the perimeter
    const lampPositions = spaceType === 'grand'
      ? [[-4.5, 3.2], [4.5, 3.2], [-4.5, -3.2], [4.5, -3.2]]
      : [[-3.5, 2.5], [3.5, 2.5]];

    lampPositions.forEach(([lx, lz]) => {
      const lamp = createStreetLantern();
      lamp.position.set(lx, 0, lz);
      group.add(lamp);
    });
  }

  // Floating peripheral debris/crystals
  const debrisCount = spaceType === 'grand' ? 12 : (spaceType === 'compact' ? 6 : 8);
  for (let i = 0; i < debrisCount; i++) {
    const angle = (i / debrisCount) * Math.PI * 2;
    const dist = (topRadius * 0.7) + Math.random() * 3.5;
    const rockGeo = new THREE.DodecahedronGeometry(0.6 + Math.random() * 0.7, 0);

    let debrisMat = Materials.obsidian;
    if (themeId === 'crimson') debrisMat = Materials.netherDemon;
    else if (themeId === 'frost') debrisMat = Materials.iceCrystal;
    else if (themeId === 'toxic') debrisMat = Materials.glowSlime;

    const rock = new THREE.Mesh(rockGeo, debrisMat);
    rock.position.set(
      Math.cos(angle) * dist,
      -3.0 - Math.random() * 4.5,
      Math.sin(angle) * dist
    );
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    group.add(rock);
  }

  // Atmospheric Props around Island Rim based on theme
  const decorGroup = new THREE.Group();
  const decorCount = spaceType === 'grand' ? 18 : (spaceType === 'compact' ? 10 : 14);
  for (let i = 0; i < decorCount; i++) {
    const angle = (i / decorCount) * Math.PI * 2 + 0.1;
    const dist = (topRadius * 0.85) + (i % 2) * 0.8;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    if (themeId === 'crimson') {
      // Magma Horns & Spikes
      const spikeGeo = new THREE.ConeGeometry(0.25, 1.6 + (i % 3) * 0.4, 5);
      const spike = new THREE.Mesh(spikeGeo, Materials.obsidian);
      spike.position.set(x, 0.8, z);
      spike.rotation.z = (Math.random() - 0.5) * 0.3;
      spike.castShadow = true;
      decorGroup.add(spike);

      // Glowing Magma Crack
      if (i % 2 === 0) {
        const glow = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), Materials.glowCrimson);
        glow.position.set(x, 0.1, z);
        decorGroup.add(glow);
      }
    } else if (themeId === 'frost') {
      // Frozen Ice Crystals / Icicles
      const iceGeo = new THREE.ConeGeometry(0.3, 1.8 + (i % 2) * 0.6, 5);
      const ice = new THREE.Mesh(iceGeo, Materials.iceCrystal);
      ice.position.set(x, 0.9, z);
      ice.rotation.x = (Math.random() - 0.5) * 0.2;
      ice.castShadow = true;
      decorGroup.add(ice);
    } else if (themeId === 'toxic') {
      // Giant Glowing Toxic Mushrooms
      const stemGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.8, 6);
      const stem = new THREE.Mesh(stemGeo, Materials.stone);
      stem.position.set(x, 0.4, z);
      decorGroup.add(stem);

      const capGeo = new THREE.SphereGeometry(0.4, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      const cap = new THREE.Mesh(capGeo, Materials.glowSlime);
      cap.position.set(x, 0.8, z);
      decorGroup.add(cap);
    } else if (themeId === 'celestial') {
      // White Marble Spires with Golden Sun Orbs
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 1.8, 8), Materials.bone);
      pillar.position.set(x, 0.9, z);
      pillar.castShadow = true;
      decorGroup.add(pillar);

      const sunOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.2), Materials.gold);
      sunOrb.position.set(x, 1.9, z);
      decorGroup.add(sunOrb);
    } else {
      // Gothic Tombstones & Pine Trees
      if (i % 3 === 0) {
        const tree = createTwistedTree();
        tree.position.set(x, 0, z);
        decorGroup.add(tree);
      } else {
        const tomb = createTombstone(i % 2 === 0);
        tomb.position.set(x, 0, z);
        tomb.rotation.y = angle + Math.PI / 2;
        decorGroup.add(tomb);
      }
    }
  }

  group.add(decorGroup);
  return group;
}

export function createTwistedTree() {
  const group = new THREE.Group();
  const trunkGeo = new THREE.CylinderGeometry(0.18, 0.35, 2.2, 5);
  const trunk = new THREE.Mesh(trunkGeo, Materials.wood);
  trunk.position.y = 1.1;
  trunk.rotation.z = (Math.random() - 0.5) * 0.25;
  trunk.castShadow = true;
  group.add(trunk);

  const cone1 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.4, 5), Materials.mossStone);
  cone1.position.y = 2.0;
  cone1.castShadow = true;
  group.add(cone1);

  const cone2 = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.2, 5), Materials.mossStone);
  cone2.position.y = 2.8;
  cone2.castShadow = true;
  group.add(cone2);
  return group;
}

export function createTombstone(isCross = false) {
  const group = new THREE.Group();
  if (isCross) {
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 0.12), Materials.stone);
    v.position.y = 0.6;
    v.castShadow = true;
    group.add(v);

    const h = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.12), Materials.stone);
    h.position.y = 0.85;
    h.castShadow = true;
    group.add(h);
  } else {
    const arch = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.9, 0.14), Materials.stone);
    arch.position.y = 0.45;
    arch.castShadow = true;
    group.add(arch);

    const rune = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.25), Materials.glowPurple);
    rune.position.set(0, 0.5, 0.08);
    group.add(rune);
  }
  return group;
}

// ==========================================================================
// SACRED SANCTUM CITADEL / GOTHIC CASTLE (End of the Route)
// Fortified twin towers, crenellations, portcullis gate & Hearth Crystal
// ==========================================================================
export function createGothicCastle(themeId = 'gothic') {
  const group = new THREE.Group();
  const theme = THEMES[themeId] || THEMES.gothic;

  let accentMat = Materials.glowJade;
  let accentColor = theme.accentGlow;
  if (themeId === 'crimson') accentMat = Materials.glowCrimson;
  else if (themeId === 'frost') accentMat = Materials.glowFrost;
  else if (themeId === 'toxic') accentMat = Materials.glowSlime;
  else if (themeId === 'celestial') accentMat = Materials.gold;

  // 1. Heavy Stone Citadel Base & Ramparts
  const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.8, 2.2), Materials.stone);
  baseMesh.position.y = 0.9;
  baseMesh.receiveShadow = true;
  baseMesh.castShadow = true;
  group.add(baseMesh);

  // Rampart corbels / stone trims
  const trimGeo = new THREE.BoxGeometry(3.2, 0.18, 2.4);
  const trim = new THREE.Mesh(trimGeo, Materials.cobblestone);
  trim.position.y = 1.85;
  trim.castShadow = true;
  group.add(trim);

  // 2. Gateway Arch & Iron Portcullis (Where enemies approach and breach)
  const gateFrame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.5, 0.4), Materials.obsidian);
  gateFrame.position.set(0, 0.75, 1.05);
  group.add(gateFrame);

  const gateOpening = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.25, 0.42), new THREE.MeshBasicMaterial({ color: 0x030308 }));
  gateOpening.position.set(0, 0.65, 1.06);
  group.add(gateOpening);

  // Iron Portcullis Grate
  const grateMat = Materials.iron;
  const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.06), grateMat);
  hBar.position.set(0, 0.85, 1.12);
  group.add(hBar);
  const hBar2 = hBar.clone();
  hBar2.position.y = 0.55;
  group.add(hBar2);

  for (let b = -3; b <= 3; b++) {
    const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.1, 0.05), grateMat);
    vBar.position.set(b * 0.13, 0.65, 1.12);
    group.add(vBar);
  }

  // Glowing Arcane Crest above the Gate
  const crestGeo = new THREE.OctahedronGeometry(0.22);
  const crest = new THREE.Mesh(crestGeo, accentMat);
  crest.position.set(0, 1.6, 1.22);
  group.add(crest);

  // 3. Left & Right Flanking Watchtowers
  const towerPositions = [-1.45, 1.45];
  towerPositions.forEach((posX) => {
    // Tower Main Column
    const towerCol = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 2.8, 12), Materials.stone);
    towerCol.position.set(posX, 1.4, 0.1);
    towerCol.castShadow = true;
    towerCol.receiveShadow = true;
    group.add(towerCol);

    // Tower Overhang Battlement
    const battlement = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.6, 0.35, 12), Materials.cobblestone);
    battlement.position.set(posX, 2.9, 0.1);
    battlement.castShadow = true;
    group.add(battlement);

    // Crenellations (Merlons around top)
    for (let m = 0; m < 6; m++) {
      const angle = (m / 6) * Math.PI * 2;
      const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.18), Materials.cobblestone);
      merlon.position.set(posX + Math.cos(angle) * 0.58, 3.12, 0.1 + Math.sin(angle) * 0.58);
      merlon.castShadow = true;
      group.add(merlon);
    }

    // High Conical Slate Roof Spire
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.72, 1.25, 12), Materials.obsidian);
    roof.position.set(posX, 3.7, 0.1);
    roof.castShadow = true;
    group.add(roof);

    // Flagpole with Fluttering Pennant
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 6), Materials.iron);
    pole.position.set(posX, 4.4, 0.1);
    group.add(pole);

    const flagGeo = new THREE.BufferGeometry();
    const flagVertices = new Float32Array([
      0, 0.25, 0,
      0.35, 0.15, 0,
      0, 0.05, 0,
    ]);
    flagGeo.setAttribute('position', new THREE.BufferAttribute(flagVertices, 3));
    const flagMat = new THREE.MeshStandardMaterial({
      color: themeId === 'crimson' ? 0xef4444 : (themeId === 'frost' ? 0x38bdf8 : 0x10b981),
      side: THREE.DoubleSide,
    });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(posX, 4.35, 0.1);
    group.add(flag);
  });

  // 4. Central Grand Balcony & Sanctum Hearth Spire
  const centralBalcony = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.35, 1.2), Materials.cobblestone);
  centralBalcony.position.set(0, 2.05, 0.1);
  group.add(centralBalcony);

  // 4 Balcony Corner Pillars
  for (let c = 0; c < 4; c++) {
    const cx = c % 2 === 0 ? -0.55 : 0.55;
    const cz = c < 2 ? -0.45 : 0.45;
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.7, 0.16), Materials.obsidian);
    pillar.position.set(cx, 2.45, cz);
    pillar.castShadow = true;
    group.add(pillar);
  }

  // 5. The Sacred Hearth Crystal (Citadel Life Force)
  const crystalGeo = new THREE.OctahedronGeometry(0.48, 1);
  const crystal = new THREE.Mesh(crystalGeo, accentMat);
  crystal.position.set(0, 2.65, 0.0);
  crystal.castShadow = true;
  group.add(crystal);

  // Runic Orbiting Ring around Crystal
  const orbitRingGeo = new THREE.TorusGeometry(0.65, 0.04, 8, 24);
  const orbitRing = new THREE.Mesh(orbitRingGeo, accentMat);
  orbitRing.position.copy(crystal.position);
  orbitRing.rotation.x = Math.PI / 3;
  group.add(orbitRing);

  // Light Source
  const castleLight = new THREE.PointLight(accentColor, 2.8, 8);
  castleLight.position.set(0, 2.7, 0.3);
  group.add(castleLight);

  // 3D Floating Heart Emblem over Castle
  const heartGroup = new THREE.Group();
  heartGroup.position.set(0, 3.75, 0);

  const heartMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0x991b1b,
    emissiveIntensity: 0.8,
    roughness: 0.3,
  });
  const hLeft = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), heartMat);
  hLeft.position.set(-0.11, 0.1, 0);
  hLeft.scale.set(1, 1.2, 0.7);
  heartGroup.add(hLeft);

  const hRight = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), heartMat);
  hRight.position.set(0.11, 0.1, 0);
  hRight.scale.set(1, 1.2, 0.7);
  heartGroup.add(hRight);

  const hTip = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.35, 12), heartMat);
  hTip.rotation.z = Math.PI;
  hTip.position.set(0, -0.06, 0);
  hTip.scale.set(1, 1, 0.7);
  heartGroup.add(hTip);

  group.add(heartGroup);

  group.userData = {
    isCastle: true,
    flameMesh: crystal,
    orbitRing,
    heartGroup,
    crest,
    castleLight,
    hearthLight: castleLight,
    baseY: 2.65,
    flashRedTimer: 0,
  };

  return group;
}

// Backwards-compatible export that delivers the 3D Gothic Castle
export function createSoulHearth(themeId = 'gothic') {
  return createGothicCastle(themeId);
}

// ==========================================================================
// 2. THE LOVABLE GOTHIC DEFENDERS (TOWERS)
// ==========================================================================

export function createGargoyleTower(rank = 1) {
  const group = new THREE.Group();
  const mat = rank >= 2 ? Materials.obsidian : Materials.stone;

  const pedBase = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.25, 8), mat);
  pedBase.position.y = 0.125;
  pedBase.castShadow = true;
  group.add(pedBase);

  const pedPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.45, 0.85, 8), mat);
  pedPillar.position.y = 0.65;
  pedPillar.castShadow = true;
  group.add(pedPillar);

  const runeBand = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 8), Materials.glowAmber);
  runeBand.position.y = 0.65;
  group.add(runeBand);

  const gargoyleUpper = new THREE.Group();
  gargoyleUpper.position.y = 1.1;

  const body = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32, 0), mat);
  body.castShadow = true;
  gargoyleUpper.add(body);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.32), mat);
  head.position.set(0, 0.26, 0.12);
  head.castShadow = true;
  gargoyleUpper.add(head);

  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.16), mat);
  snout.position.set(0, 0.22, 0.32);
  gargoyleUpper.add(snout);

  const hornGeo = new THREE.ConeGeometry(0.06, 0.22, 4);
  const leftHorn = new THREE.Mesh(hornGeo, mat);
  leftHorn.position.set(-0.12, 0.45, 0.08);
  leftHorn.rotation.z = -0.3;
  gargoyleUpper.add(leftHorn);

  const rightHorn = new THREE.Mesh(hornGeo, mat);
  rightHorn.position.set(0.12, 0.45, 0.08);
  rightHorn.rotation.z = 0.3;
  gargoyleUpper.add(rightHorn);

  const eyeGeo = new THREE.SphereGeometry(0.045, 6, 6);
  const leftEye = new THREE.Mesh(eyeGeo, Materials.glowAmber);
  leftEye.position.set(-0.08, 0.3, 0.27);
  gargoyleUpper.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, Materials.glowAmber);
  rightEye.position.set(0.08, 0.3, 0.27);
  gargoyleUpper.add(rightEye);

  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.lineTo(0.3, 0.4);
  wingShape.lineTo(0.15, 0.55);
  wingShape.lineTo(0.4, 0.65);
  wingShape.lineTo(0, 0.3);
  wingShape.closePath();

  const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.04, bevelEnabled: false });

  const leftWing = new THREE.Mesh(wingGeo, mat);
  leftWing.position.set(-0.15, 0.05, -0.05);
  leftWing.rotation.y = Math.PI - 0.3;
  leftWing.castShadow = true;
  gargoyleUpper.add(leftWing);

  const rightWing = new THREE.Mesh(wingGeo, mat);
  rightWing.position.set(0.15, 0.05, -0.05);
  rightWing.rotation.y = 0.3;
  rightWing.castShadow = true;
  gargoyleUpper.add(rightWing);

  group.add(gargoyleUpper);

  group.userData = { upper: gargoyleUpper, leftWing, rightWing, head, rank };
  return group;
}

export function createCauldronTower(rank = 1) {
  const group = new THREE.Group();

  const woodBase = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.72, 0.3, 6), Materials.wood);
  woodBase.position.y = 0.15;
  woodBase.castShadow = true;
  group.add(woodBase);

  const potMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), Materials.iron);
  potMesh.position.y = 0.72;
  potMesh.scale.set(1.1, 0.85, 1.1);
  potMesh.castShadow = true;
  group.add(potMesh);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.06, 8, 16), Materials.iron);
  rim.position.y = 1.05;
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  const liquid = new THREE.Mesh(new THREE.CircleGeometry(0.44, 16), Materials.glowSlime);
  liquid.position.y = 1.02;
  liquid.rotation.x = -Math.PI / 2;
  group.add(liquid);

  const spoonGroup = new THREE.Group();
  spoonGroup.position.set(0, 1.05, 0);

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6), Materials.wood);
  handle.position.set(0.12, 0.3, 0);
  handle.rotation.z = -0.4;
  spoonGroup.add(handle);
  group.add(spoonGroup);

  const cauldronLight = new THREE.PointLight(0x22c55e, 1.8, 4.5);
  cauldronLight.position.y = 1.2;
  group.add(cauldronLight);

  group.userData = { spoonGroup, liquid, cauldronLight, rank };
  return group;
}

export function createCryptTower(rank = 1) {
  const group = new THREE.Group();

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.2), Materials.stone);
  base.position.y = 0.15;
  base.castShadow = true;
  group.add(base);

  const walls = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.9), Materials.stone);
  walls.position.y = 0.65;
  walls.castShadow = true;
  group.add(walls);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.8, 0.6, 4), Materials.obsidian);
  roof.position.y = 1.35;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  group.add(roof);

  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.55), Materials.glowFrost);
  door.position.set(0, 0.55, 0.46);
  group.add(door);

  const wispGroup = new THREE.Group();
  wispGroup.position.set(0, 1.8, 0);
  wispGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), Materials.ghostTranslucent));
  group.add(wispGroup);

  group.userData = { wispGroup, rank };
  return group;
}

export function createTeslaTower(rank = 1) {
  const group = new THREE.Group();

  const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 0.25, 8), Materials.obsidian);
  b1.position.y = 0.125;
  group.add(b1);

  const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.35, 1.4, 6), Materials.stone);
  spire.position.y = 0.95;
  spire.castShadow = true;
  group.add(spire);

  for (let i = 0; i < 3; i++) {
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.28 - i * 0.04, 0.035, 8, 16), Materials.gold);
    coil.position.y = 0.6 + i * 0.35;
    coil.rotation.x = Math.PI / 2;
    group.add(coil);
  }

  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), Materials.glowPurple);
  crystal.position.y = 1.95;
  crystal.scale.set(0.8, 1.6, 0.8);
  group.add(crystal);

  const teslaLight = new THREE.PointLight(0xa855f7, 2.0, 5);
  teslaLight.position.y = 2.0;
  group.add(teslaLight);

  group.userData = { crystal, teslaLight, rank };
  return group;
}

// ==========================================================================
// 3. EXPANDED ENEMY MENAGERIE (TIERED BY LEVEL HARDNESS)
// ==========================================================================

// 3A: Skeleton Creeper (Basic)
export function createSkeletonMesh() {
  const group = new THREE.Group();
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), Materials.bone);
  skull.position.y = 0.65;
  skull.castShadow = true;
  group.add(skull);

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), Materials.glowFrost);
  eyeL.position.set(-0.08, 0.66, 0.2);
  group.add(eyeL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), Materials.glowFrost);
  eyeR.position.set(0.08, 0.66, 0.2);
  group.add(eyeR);

  const ribs = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.25, 6), Materials.bone);
  ribs.position.y = 0.38;
  group.add(ribs);

  group.userData = { skull };
  return group;
}

// 3B: Imp Fiend (Fast)
export function createImpMesh() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8), Materials.redImp);
  body.position.y = 0.55;
  body.castShadow = true;
  group.add(body);

  const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 4), Materials.obsidian);
  hornL.position.set(-0.1, 0.75, 0.05);
  hornL.rotation.z = -0.3;
  group.add(hornL);

  const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 4), Materials.obsidian);
  hornR.position.set(0.1, 0.75, 0.05);
  hornR.rotation.z = 0.3;
  group.add(hornR);

  const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.02), Materials.obsidian);
  wingL.position.set(-0.25, 0.6, -0.1);
  group.add(wingL);

  const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.02), Materials.obsidian);
  wingR.position.set(0.25, 0.6, -0.1);
  group.add(wingR);

  group.userData = { wingL, wingR, body };
  return group;
}

// 3C: Hellhound (Fast Rusher - Crimson theme)
export function createHellhoundMesh() {
  const group = new THREE.Group();

  // Muscular Canine Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.3, 0.65), Materials.netherDemon);
  body.position.y = 0.35;
  body.castShadow = true;
  group.add(body);

  // Fierce Head with Magma Jaws
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.22, 0.3), Materials.obsidian);
  head.position.set(0, 0.48, 0.38);
  group.add(head);

  // Glowing Fiery Eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), Materials.glowCrimson);
  eyeL.position.set(-0.08, 0.52, 0.5);
  group.add(eyeL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), Materials.glowCrimson);
  eyeR.position.set(0.08, 0.52, 0.5);
  group.add(eyeR);

  // Spined Back Ridge
  for (let i = 0; i < 3; i++) {
    const spine = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 4), Materials.glowAmber);
    spine.position.set(0, 0.56, 0.18 - i * 0.18);
    group.add(spine);
  }

  group.userData = { head, body };
  return group;
}

// 3D: Necromancer Cultist (Summoner)
export function createNecromancerMesh() {
  const group = new THREE.Group();

  // Dark Robed Body
  const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 0.9, 8), Materials.obsidian);
  robe.position.y = 0.45;
  robe.castShadow = true;
  group.add(robe);

  // Skull Mask
  const mask = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), Materials.bone);
  mask.position.set(0, 0.95, 0.05);
  group.add(mask);

  // Horned Hood Crown
  const crown = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.4, 6), Materials.obsidian);
  crown.position.set(0, 1.2, -0.05);
  group.add(crown);

  // Eldritch Skull Staff
  const staffPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 6), Materials.wood);
  staffPole.position.set(0.3, 0.6, 0.15);
  group.add(staffPole);

  const staffGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), Materials.glowPurple);
  staffGem.position.set(0.3, 1.25, 0.15);
  group.add(staffGem);

  const staffLight = new THREE.PointLight(0xa855f7, 1.5, 3);
  staffLight.position.set(0.3, 1.25, 0.15);
  group.add(staffLight);

  group.userData = { staffGem, robe };
  return group;
}

// 3E: Frost Banshee / Screamer
export function createBansheeMesh() {
  const group = new THREE.Group();

  const ghost = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.9, 8), Materials.iceCrystal);
  ghost.position.y = 0.75;
  ghost.rotation.x = Math.PI;
  group.add(ghost);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), Materials.iceCrystal);
  head.position.y = 0.95;
  group.add(head);

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), Materials.glowFrost);
  eyeL.position.set(-0.07, 0.96, 0.18);
  group.add(eyeL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), Materials.glowFrost);
  eyeR.position.set(0.07, 0.96, 0.18);
  group.add(eyeR);

  group.userData = { ghost, head };
  return group;
}

// 3F: Crypt Crusher (Armored Golem)
export function createGolemMesh() {
  const group = new THREE.Group();
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.5), Materials.obsidian);
  torso.position.y = 0.75;
  torso.castShadow = true;
  group.add(torso);

  const armL = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 0), Materials.stone);
  armL.position.set(-0.52, 0.7, 0);
  group.add(armL);

  const armR = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 0), Materials.stone);
  armR.position.set(0.52, 0.7, 0);
  group.add(armR);

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.08), Materials.glowAmber);
  visor.position.set(0, 0.88, 0.26);
  group.add(visor);

  group.userData = { armL, armR, torso };
  return group;
}

// 3G: Boss: Pumpkin Lord Jack (Level 1)
export function createBossPumpkinMesh() {
  const group = new THREE.Group();
  const pumpMat = new THREE.MeshStandardMaterial({ color: 0xe65100, roughness: 0.6, flatShading: true });
  const pumpkin = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 10), pumpMat);
  pumpkin.position.y = 1.25;
  pumpkin.scale.set(1.2, 0.95, 1.1);
  pumpkin.castShadow = true;
  group.add(pumpkin);

  const eyeL = new THREE.Mesh(new THREE.TetrahedronGeometry(0.12), Materials.glowAmber);
  eyeL.position.set(-0.25, 1.35, 0.65);
  group.add(eyeL);

  const eyeR = new THREE.Mesh(new THREE.TetrahedronGeometry(0.12), Materials.glowAmber);
  eyeR.position.set(0.25, 1.35, 0.65);
  group.add(eyeR);

  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.12, 0.1), Materials.glowAmber);
  mouth.position.set(0, 1.05, 0.68);
  group.add(mouth);

  const cloak = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.9, 1.1, 8), Materials.obsidian);
  cloak.position.y = 0.55;
  cloak.castShadow = true;
  group.add(cloak);

  const pLight = new THREE.PointLight(0xffaa00, 3.5, 7);
  pLight.position.set(0, 1.25, 0.4);
  group.add(pLight);

  group.userData = { pumpkin, cloak, pLight };
  return group;
}

// 3H: Boss: Blood Demon Overlord (Level 2)
export function createBossBloodDemonMesh() {
  const group = new THREE.Group();

  // Heavy Crimson Demon Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.9, 0.6), Materials.netherDemon);
  torso.position.y = 0.9;
  torso.castShadow = true;
  group.add(torso);

  // Head with Demonic Curled Horns
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.4, 0.4), Materials.obsidian);
  head.position.set(0, 1.5, 0.1);
  group.add(head);

  // Huge Curved Horns
  const hornL = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 6, 12, Math.PI * 0.9), Materials.glowCrimson);
  hornL.position.set(-0.35, 1.7, 0.1);
  hornL.rotation.y = 0.4;
  group.add(hornL);

  const hornR = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 6, 12, Math.PI * 0.9), Materials.glowCrimson);
  hornR.position.set(0.35, 1.7, 0.1);
  hornR.rotation.y = -0.4;
  group.add(hornR);

  // Glowing Crimson Core
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), Materials.glowCrimson);
  core.position.set(0, 1.0, 0.32);
  group.add(core);

  const dLight = new THREE.PointLight(0xdc2626, 3.8, 8);
  dLight.position.set(0, 1.2, 0.5);
  group.add(dLight);

  group.userData = { torso, head, dLight };
  return group;
}

// 3I: Boss: Frost Colossus (Level 3)
export function createBossFrostColossusMesh() {
  const group = new THREE.Group();

  const torso = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8, 1), Materials.iceCrystal);
  torso.position.y = 1.0;
  torso.castShadow = true;
  group.add(torso);

  const head = new THREE.Mesh(new THREE.OctahedronGeometry(0.4), Materials.iceCrystal);
  head.position.set(0, 1.8, 0);
  group.add(head);

  const fLight = new THREE.PointLight(0x38bdf8, 3.5, 8);
  fLight.position.set(0, 1.5, 0);
  group.add(fLight);

  group.userData = { torso, head, fLight };
  return group;
}

// ==========================================================================
// 4. FLOATING SOUL ORB (Interactive Collectible)
// ==========================================================================
export function createSoulOrb(themeId = 'gothic') {
  const group = new THREE.Group();

  let coreMat = Materials.glowJade;
  let ringColor = 0x10b981;
  if (themeId === 'crimson') {
    coreMat = Materials.glowCrimson;
    ringColor = 0xef4444;
  } else if (themeId === 'frost') {
    coreMat = Materials.glowFrost;
    ringColor = 0x38bdf8;
  } else if (themeId === 'toxic') {
    coreMat = Materials.glowSlime;
    ringColor = 0x22c55e;
  }

  const core = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), coreMat);
  group.add(core);

  const haloGeo = new THREE.RingGeometry(0.28, 0.44, 16);
  const haloMat = new THREE.MeshBasicMaterial({
    color: ringColor,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.rotation.x = Math.PI / 2;
  group.add(halo);

  group.userData = { core, halo, age: 0 };
  return group;
}
