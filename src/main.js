// ==========================================================================
// GARGOYLE'S KEEP: SOULWARDEN — MAIN APPLICATION ENGINE
// Themes (Dark & Celestial Light), Soul Forge, Character Codex & Quests
// ==========================================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import confetti from 'canvas-confetti';
import { sound } from './audio.js';
import {
  createThemedFloatingIsland,
  createSoulHearth,
  createGothicCastle,
  createGothicHouse,
  createWatchtower,
  createStreetLantern,
  createPortalArchway,
  createStoneBridge,
  THEMES,
  Materials,
} from './models.js';
import {
  GameEngine,
  LEVEL_DEFINITIONS,
  generateLevelDefinition,
  REALM_MUTATORS,
  REALM_STAR_MILESTONES,
  CHALLENGE_MODIFIERS,
  isPositionOnCurrentPath,
  TOWER_CONFIGS,
  SOUL_FORGE_UPGRADES,
  CODEX_DATA,
} from './game.js';

// Setup Three.js Core with High-FPS Hardware Optimization
const canvas = document.getElementById('webgl-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
let isLightTheme = false;
let activeThemeKey = 'gothic';

const initialTheme = THEMES.gothic;
scene.background = new THREE.Color(initialTheme.skyColor);
scene.fog = new THREE.FogExp2(initialTheme.fogColor, initialTheme.fogDensity);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
const DEFAULT_CAM_POS = new THREE.Vector3(0, 15, 14);
camera.position.copy(DEFAULT_CAM_POS);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2.15;
controls.minDistance = 6;
controls.maxDistance = 26;
controls.target.set(0, 0.5, 0);

// Lighting setup (Optimized shadow map resolution for high FPS)
const ambientLight = new THREE.AmbientLight(initialTheme.ambientLight, initialTheme.ambientIntensity);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(initialTheme.moonLight, initialTheme.moonIntensity);
moonLight.position.set(-10, 18, -10);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 1024;
moonLight.shadow.mapSize.height = 1024;
moonLight.shadow.camera.near = 0.5;
moonLight.shadow.camera.far = 45;
moonLight.shadow.camera.left = -12;
moonLight.shadow.camera.right = 12;
moonLight.shadow.camera.top = 12;
moonLight.shadow.camera.bottom = -12;
moonLight.shadow.bias = -0.0005;
scene.add(moonLight);

// 3D Moon / Celestial Sun
const moonGeo = new THREE.SphereGeometry(3.5, 24, 24);
const moonMat = new THREE.MeshBasicMaterial({ color: initialTheme.moonColor });
const moonMesh = new THREE.Mesh(moonGeo, moonMat);
moonMesh.position.set(-22, 28, -32);
scene.add(moonMesh);

// Halo Glow
const haloGeo = new THREE.RingGeometry(3.6, 5.8, 32);
const haloMat = new THREE.MeshBasicMaterial({
  color: initialTheme.moonLight,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.28,
});
const haloMesh = new THREE.Mesh(haloGeo, haloMat);
haloMesh.position.copy(moonMesh.position);
haloMesh.lookAt(camera.position);
scene.add(haloMesh);

// Background Twinkling Stars
const starCount = 350;
const starGeo = new THREE.BufferGeometry();
const starPos = [];
for (let i = 0; i < starCount; i++) {
  starPos.push(
    (Math.random() - 0.5) * 120,
    10 + Math.random() * 60,
    (Math.random() - 0.5) * 120
  );
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.35, transparent: true, opacity: 0.8 });
const starPoints = new THREE.Points(starGeo, starMat);
scene.add(starPoints);

// Scene Element Holders
let currentIslandMesh = null;
let currentHearthMesh = null;
let instancedCobbles = null;
let pathCobblestones = [];
let gridTiles = [];
let portalArchways = [];
let envProps = [];

// Range Ring Preview
const rangeRing = new THREE.Mesh(
  new THREE.RingGeometry(0.1, 1, 32),
  new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })
);
rangeRing.rotation.x = -Math.PI / 2;
rangeRing.position.y = 0.1;
rangeRing.visible = false;
scene.add(rangeRing);

// Initialize Game Engine with Theme Transition Callback
const game = new GameEngine(scene, (levelDef, routes) => {
  const themeToApply = isLightTheme ? 'celestial' : levelDef.theme;
  rebuildWorldForLevel(levelDef, routes, themeToApply);
});

// Pedestal materials
const pedestalMat = new THREE.MeshStandardMaterial({
  color: 0x2e3442,
  roughness: 0.8,
  metalness: 0.2,
  flatShading: true,
});

const pedestalHoverMat = new THREE.MeshStandardMaterial({
  color: 0xf59e0b,
  emissive: 0xd97706,
  emissiveIntensity: 0.8,
  roughness: 0.4,
});

// ==========================================================================
// DYNAMIC REALM / THEME REBUILDING FUNCTION (High-Performance Instanced)
// ==========================================================================

function rebuildWorldForLevel(levelDef, routes, overrideThemeId = null) {
  const effectiveThemeId = overrideThemeId || (isLightTheme ? 'celestial' : levelDef.theme);
  activeThemeKey = effectiveThemeId;
  const theme = THEMES[effectiveThemeId] || THEMES.gothic;

  // 1. Update Sky, Fog, and Lights
  scene.background.setHex(theme.skyColor);
  scene.fog.color.setHex(theme.fogColor);
  scene.fog.density = theme.fogDensity;

  ambientLight.color.setHex(theme.ambientLight);
  ambientLight.intensity = theme.ambientIntensity;

  moonLight.color.setHex(theme.moonLight);
  moonLight.intensity = theme.moonIntensity;

  moonMat.color.setHex(theme.moonColor);
  haloMat.color.setHex(theme.moonLight);

  // 2. Remove Old Island & Rebuild with Space Type
  if (currentIslandMesh) scene.remove(currentIslandMesh);
  currentIslandMesh = createThemedFloatingIsland(effectiveThemeId, levelDef.spaceType || 'standard');
  scene.add(currentIslandMesh);

  // Normalize routes array
  const allRoutes = Array.isArray(routes[0]) && Array.isArray(routes[0][0]) ? routes : (routes[0] && Array.isArray(routes[0]) ? routes : [routes]);
  const primaryRoute = allRoutes[0];

  // 3. Rebuild Sacred Gothic Castle (Citadel at end of the path)
  if (currentHearthMesh) scene.remove(currentHearthMesh);
  currentHearthMesh = createGothicCastle(effectiveThemeId);
  const endPoint = primaryRoute[primaryRoute.length - 1];
  currentHearthMesh.position.copy(endPoint);
  if (primaryRoute.length >= 2) {
    const penult = primaryRoute[primaryRoute.length - 2];
    currentHearthMesh.lookAt(penult.x, currentHearthMesh.position.y, penult.z);
  }
  scene.add(currentHearthMesh);

  // 4. Remove & Rebuild 3D Portal Archways for each route
  for (let arch of portalArchways) {
    scene.remove(arch);
  }
  portalArchways = [];

  allRoutes.forEach((route, rIdx) => {
    const arch = createPortalArchway(rIdx);
    arch.position.copy(route[0]);
    if (route.length > 1) {
      arch.lookAt(route[1].x, arch.position.y, route[1].z);
    }
    scene.add(arch);
    portalArchways.push(arch);
  });

  // 5. Remove & Rebuild Environment Props (Houses, Watchtowers, Lanterns, Bridges)
  for (let prop of envProps) {
    scene.remove(prop);
  }
  envProps = [];

  // Stone Bridge for Dual Island levels
  if (levelDef.spaceType === 'dual') {
    const bridge = createStoneBridge(3.6);
    bridge.position.set(0, 0, -0.4);
    scene.add(bridge);
    envProps.push(bridge);
  }

  // 3D Gothic Houses
  const houseLocations = [
    { x: -3.8, z: 2.8, r: 0.2 },
    { x: 3.8, z: 2.6, r: -0.3 },
    { x: 3.5, z: -3.6, r: 0.5 },
  ];
  houseLocations.forEach((spot) => {
    if (!isPositionOnCurrentPath(spot.x, spot.z, allRoutes, 1.35)) {
      const house = createGothicHouse(effectiveThemeId);
      house.position.set(spot.x, 0, spot.z);
      house.rotation.y = spot.r;
      scene.add(house);
      envProps.push(house);
    }
  });

  // 3D Medieval Watchtowers
  const towerSpots = [
    { x: -4.8, z: -4.0 },
    { x: 4.8, z: -4.0 },
  ];
  towerSpots.forEach((spot) => {
    if (!isPositionOnCurrentPath(spot.x, spot.z, allRoutes, 1.35)) {
      const wt = createWatchtower(effectiveThemeId);
      wt.position.set(spot.x, 0, spot.z);
      scene.add(wt);
      envProps.push(wt);
    }
  });

  // 3D Street Lanterns along the waypoints
  allRoutes.forEach((route) => {
    for (let i = 1; i < route.length - 1; i += 2) {
      const wp = route[i];
      const lantern = createStreetLantern();
      lantern.position.set(wp.x + 0.65, 0, wp.z + 0.65);
      scene.add(lantern);
      envProps.push(lantern);
    }
  });

  // 6. High-Performance Instanced Cobblestones (Full 1.2-wide paved road!)
  if (instancedCobbles) scene.remove(instancedCobbles);
  for (let stone of pathCobblestones) {
    scene.remove(stone);
  }
  pathCobblestones = [];

  const cobbleMat = new THREE.MeshStandardMaterial({
    color: theme.cobbleColor,
    roughness: 0.85,
    metalness: 0.15,
    flatShading: true,
  });

  const stoneGeo = new THREE.BoxGeometry(0.44, 0.08, 0.44);
  const stonePoints = [];

  for (let route of allRoutes) {
    for (let i = 0; i < route.length - 1; i++) {
      const p1 = route[i];
      const p2 = route[i + 1];
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const dist = dir.length();
      dir.normalize();
      const norm = new THREE.Vector3(-dir.z, 0, dir.x);
      const segments = Math.ceil(dist / 0.45);

      for (let s = 0; s <= segments; s++) {
        const t = s / segments;
        const pt = new THREE.Vector3().lerpVectors(p1, p2, t);
        const offsets = [-0.36, 0, 0.36];
        for (let off of offsets) {
          stonePoints.push({
            x: pt.x + norm.x * off + (Math.sin(s * 7 + off * 5) * 0.03),
            z: pt.z + norm.z * off + (Math.cos(s * 5 + off * 7) * 0.03),
            rotY: (s % 3) * 0.2 + off * 0.1,
          });
        }
      }
    }
  }

  instancedCobbles = new THREE.InstancedMesh(stoneGeo, cobbleMat, stonePoints.length);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < stonePoints.length; i++) {
    dummy.position.set(stonePoints[i].x, 0.04, stonePoints[i].z);
    dummy.rotation.y = stonePoints[i].rotY;
    dummy.updateMatrix();
    instancedCobbles.setMatrixAt(i, dummy.matrix);
  }
  instancedCobbles.instanceMatrix.needsUpdate = true;
  instancedCobbles.receiveShadow = true;
  scene.add(instancedCobbles);

  // 7. Dedicated Single Build Podiums Flanking the Route (No overlapping, fixed positions)
  for (let p of gridTiles) {
    scene.remove(p);
  }
  gridTiles = [];

  const maxRadiusSq = levelDef.spaceType === 'grand' ? 56 : (levelDef.spaceType === 'compact' ? 26 : 38);
  const candidateSpots = [];

  allRoutes.forEach((route) => {
    for (let i = 0; i < route.length - 1; i++) {
      const p1 = route[i];
      const p2 = route[i + 1];
      const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
      const norm = new THREE.Vector3(-dir.z, 0, dir.x).normalize();

      const mid = new THREE.Vector3().lerpVectors(p1, p2, 0.5);
      const flankDist = 1.35;

      candidateSpots.push(
        new THREE.Vector3(mid.x + norm.x * flankDist, 0, mid.z + norm.z * flankDist),
        new THREE.Vector3(mid.x - norm.x * flankDist, 0, mid.z - norm.z * flankDist),
        new THREE.Vector3(p1.x + norm.x * flankDist, 0, p1.z + norm.z * flankDist),
        new THREE.Vector3(p1.x - norm.x * flankDist, 0, p1.z - norm.z * flankDist)
      );
    }
  });

  const validPositions = [];
  candidateSpots.forEach((spot) => {
    if (spot.x * spot.x + spot.z * spot.z > maxRadiusSq) return;
    if (isPositionOnCurrentPath(spot.x, spot.z, allRoutes, 0.95)) return;
    const tooClose = validPositions.some((v) => v.distanceTo(spot) < 1.25);
    if (tooClose) return;
    const onEndOrStart = allRoutes.some((r) => spot.distanceTo(r[0]) < 1.3 || spot.distanceTo(r[r.length - 1]) < 1.8);
    if (onEndOrStart) return;

    validPositions.push(spot);
  });

  validPositions.forEach((pos) => {
    const tileGroup = new THREE.Group();

    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.54, 0.16, 12), pedestalMat);
    plinth.position.y = 0.08;
    plinth.receiveShadow = true;
    plinth.castShadow = true;
    tileGroup.add(plinth);

    const rimMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
    const rim = new THREE.Mesh(new THREE.RingGeometry(0.44, 0.52, 16), rimMat);
    rim.rotation.x = -Math.PI / 2;
    rim.position.y = 0.165;
    tileGroup.add(rim);

    tileGroup.position.set(pos.x, 0, pos.z);
    tileGroup.userData = {
      isPedestal: true,
      gridX: pos.x,
      gridZ: pos.z,
      plinth,
      rim,
      occupied: false,
    };

    scene.add(tileGroup);
    gridTiles.push(tileGroup);
  });

  // 8. Update UI Labels
  document.getElementById('level-tag').textContent = `LEVEL ${levelDef.level}`;
  document.getElementById('realm-name').textContent = levelDef.name;
  document.getElementById('theme-pill').textContent = effectiveThemeId.toUpperCase();

  const mutator = levelDef.mutator || REALM_MUTATORS[0];
  const mutatorIcon = document.getElementById('mutator-icon');
  const mutatorText = document.getElementById('mutator-text');
  if (mutatorIcon) mutatorIcon.textContent = mutator.icon;
  if (mutatorText) mutatorText.textContent = mutator.name;
  const mutatorPill = document.getElementById('mutator-hud-pill');
  if (mutatorPill) mutatorPill.title = `Active Mutator: ${mutator.name} (${mutator.desc})`;
}

// Initial Build using saved level or initial definition
rebuildWorldForLevel(game.currentLevelDef, game.levelRoutes, isLightTheme ? 'celestial' : game.currentLevelDef.theme);

// Castle Damage Animation Callback
game.onCastleDamaged = (dmg) => {
  if (currentHearthMesh && currentHearthMesh.userData.castleLight) {
    currentHearthMesh.userData.castleLight.color.setHex(0xff0000);
    currentHearthMesh.userData.castleLight.intensity = 5.5;
    setTimeout(() => {
      if (currentHearthMesh && currentHearthMesh.userData.castleLight) {
        const theme = THEMES[activeThemeKey] || THEMES.gothic;
        currentHearthMesh.userData.castleLight.color.setHex(theme.accentGlow);
        currentHearthMesh.userData.castleLight.intensity = 2.8;
      }
    }, 280);
  }

  const badge = document.getElementById('health-badge');
  if (badge) {
    badge.classList.remove('damaged');
    void badge.offsetWidth;
    badge.classList.add('damaged');
    setTimeout(() => badge.classList.remove('damaged'), 500);
  }

  showFloatingText(`💔 Citadel -${dmg} Life!`, window.innerWidth / 2, 140);
  sound.playDefeatSound();
};

// ==========================================================================
// INTERACTIVE RAYCASTING (Weapon Adding, Inspect, Soul Grab, Spells)
// ==========================================================================

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredPedestal = null;
let selectedTowerType = null;

// UI DOM Elements
const healthFill = document.getElementById('health-bar-fill');
const healthText = document.getElementById('health-text');
const goldAmount = document.getElementById('gold-amount');
const soulAmount = document.getElementById('soul-amount');
const waveTitle = document.getElementById('wave-title');
const enemyCountText = document.getElementById('enemy-count-text');
const waveProgressBar = document.getElementById('wave-progress-bar');
const btnStartWave = document.getElementById('btn-start-wave');
const inspectorPanel = document.getElementById('inspector-panel');
const weaponBtns = document.querySelectorAll('.weapon-icon-btn');
const spellBtns = document.querySelectorAll('.spell-btn');

// Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Pointer Move: Hovering & Raycasting
window.addEventListener('pointermove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (event.target !== canvas) return;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(gridTiles, true);
  if (intersects.length > 0) {
    let hitGroup = intersects[0].object;
    while (hitGroup && !hitGroup.userData.isPedestal) {
      hitGroup = hitGroup.parent;
    }
    if (hitGroup && hitGroup.userData.isPedestal) {
      if (hoveredPedestal !== hitGroup) {
        if (hoveredPedestal && hoveredPedestal.userData.plinth) {
          hoveredPedestal.userData.plinth.material = pedestalMat;
        }
        hoveredPedestal = hitGroup;
        if (hoveredPedestal.userData.plinth) {
          hoveredPedestal.userData.plinth.material = pedestalHoverMat;
        }

        if (selectedTowerType && !hoveredPedestal.userData.occupied) {
          const cfg = TOWER_CONFIGS[selectedTowerType];
          rangeRing.visible = true;
          rangeRing.position.set(hitGroup.userData.gridX, 0.18, hitGroup.userData.gridZ);
          rangeRing.scale.set(cfg.range, cfg.range, 1);
        }
      }
    }
  } else {
    if (hoveredPedestal) {
      if (hoveredPedestal.userData.plinth) {
        hoveredPedestal.userData.plinth.material = pedestalMat;
      }
      hoveredPedestal = null;
      if (!game.selectedTower) rangeRing.visible = false;
    }
  }
});

// Click Interaction (Weapon Adding, Inspect, Harvest Soul, Cast Spell)
window.addEventListener('pointerdown', (event) => {
  if (event.target !== canvas) return;

  sound.init();
  raycaster.setFromCamera(mouse, camera);

  // 1. Click on Soul Orbs
  const orbMeshes = game.soulOrbs.map((o) => o.mesh.children[0]);
  const orbHits = raycaster.intersectObjects(orbMeshes);
  if (orbHits.length > 0) {
    const hitOrbMesh = orbHits[0].object.parent;
    const orbObj = game.soulOrbs.find((o) => o.mesh === hitOrbMesh);
    if (orbObj) {
      game.collectSoulOrb(orbObj);
      showFloatingText(`+${orbObj.value} 👻 Soul Harvested!`, event.clientX, event.clientY);
      updateHUD();
      return;
    }
  }

  // 2. Active Spell Targeting
  if (game.activeCastingSpell) {
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const targetPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, targetPoint);

    if (targetPoint) {
      const success = game.castSpell(game.activeCastingSpell, targetPoint);
      if (success) {
        showFloatingText(`✨ Cast ${game.activeCastingSpell.toUpperCase()}!`, event.clientX, event.clientY);
      }
      game.activeCastingSpell = null;
      spellBtns.forEach((b) => b.classList.remove('active-cast'));
      updateHUD();
    }
    return;
  }

  // 3. Click Placed Tower to Inspect
  const towerMeshes = game.towers.map((t) => t.mesh);
  const towerHits = raycaster.intersectObjects(towerMeshes, true);
  if (towerHits.length > 0) {
    let current = towerHits[0].object;
    while (current && !game.towers.find((t) => t.mesh === current)) {
      current = current.parent;
    }
    const matchedTower = game.towers.find((t) => t.mesh === current);
    if (matchedTower) {
      selectTowerForInspection(matchedTower);
      return;
    }
  }

  // 4. Place Selected Weapon on Dedicated Pedestal
  let targetPedestal = hoveredPedestal;
  if (!targetPedestal) {
    const hits = raycaster.intersectObjects(gridTiles, true);
    if (hits.length > 0) {
      let cur = hits[0].object;
      while (cur && !cur.userData?.isPedestal) cur = cur.parent;
      if (cur?.userData?.isPedestal) targetPedestal = cur;
    }
  }

  if (selectedTowerType && targetPedestal) {
    if (targetPedestal.userData.occupied) {
      showFloatingText('⚠️ Podium already occupied! Select an open stone plinth.', event.clientX, event.clientY);
      return;
    }
    const gx = targetPedestal.userData.gridX;
    const gz = targetPedestal.userData.gridZ;
    const newTower = game.buildTower(selectedTowerType, gx, gz);

    if (newTower) {
      targetPedestal.userData.occupied = true;
      newTower.pedestal = targetPedestal;
      showFloatingText(`🏰 ${newTower.config.name} Added!`, event.clientX, event.clientY);
      selectTowerForInspection(newTower);
      selectedTowerType = null;
      weaponBtns.forEach((c) => c.classList.remove('selected'));
      rangeRing.visible = false;
    }
    updateHUD();
  } else if (targetPedestal && targetPedestal.userData.occupied) {
    const t = game.towers.find((tow) => Math.hypot(tow.gx - targetPedestal.userData.gridX, tow.gz - targetPedestal.userData.gridZ) < 0.35);
    if (t) {
      selectTowerForInspection(t);
    }
  } else {
    closeInspector();
  }
});

// Floating Text Alert
function showFloatingText(text, clientX, clientY, isBossWarning = false) {
  const container = document.getElementById('floating-notifications');
  const el = document.createElement('div');
  el.className = isBossWarning ? 'float-msg warning-boss' : 'float-msg';
  el.textContent = text;
  container.appendChild(el);
  setTimeout(() => el.remove(), 2400);
}

// ==========================================================================
// TOWER INSPECTION DRAWER
// ==========================================================================

function selectTowerForInspection(tower) {
  game.selectedTower = tower;
  inspectorPanel.classList.remove('hidden');

  rangeRing.visible = true;
  rangeRing.position.set(tower.gx, 0.12, tower.gz);
  rangeRing.scale.set(tower.range, tower.range, 1);

  document.getElementById('inspector-name').textContent = tower.config.name;
  document.getElementById('inspector-tier').textContent = `Rank ${tower.rank} Sentinel`;
  document.getElementById('inspector-lore').textContent = tower.config.description;
  document.getElementById('stat-dmg').textContent = Math.round(tower.damage);
  document.getElementById('stat-rng').textContent = tower.range.toFixed(1);
  document.getElementById('stat-spd').textContent = `${tower.fireRate.toFixed(2)}s`;
  document.getElementById('stat-kills').textContent = tower.kills;

  const nextUpgrade = tower.config.upgrades.find((u) => u.rank === tower.rank + 1);
  const upBtn = document.getElementById('btn-upgrade-tower');
  const upText = document.getElementById('upgrade-btn-text');
  const upCost = document.getElementById('upgrade-cost-tag');

  if (nextUpgrade) {
    upBtn.disabled = game.gold < nextUpgrade.cost;
    upText.textContent = `Upgrade to ${nextUpgrade.name}`;
    upCost.textContent = `${nextUpgrade.cost} 🪙`;
    upBtn.style.display = 'inline-flex';
  } else {
    upBtn.style.display = 'none';
  }

  const refund = Math.floor(tower.config.cost * 0.65 * tower.rank);
  document.getElementById('sell-value').textContent = refund;
}

function closeInspector() {
  game.selectedTower = null;
  inspectorPanel.classList.add('hidden');
  if (!selectedTowerType) rangeRing.visible = false;
}

document.getElementById('inspector-close').addEventListener('click', closeInspector);

document.getElementById('btn-poke-tower').addEventListener('click', () => {
  if (game.selectedTower) {
    game.petTower(game.selectedTower);
    showFloatingText(`❤️ ${game.selectedTower.config.name} chirps happily!`, window.innerWidth / 2, window.innerHeight / 2);
  }
});

document.getElementById('btn-upgrade-tower').addEventListener('click', () => {
  if (game.selectedTower) {
    const ok = game.upgradeTower(game.selectedTower);
    if (ok) {
      selectTowerForInspection(game.selectedTower);
      updateHUD();
    }
  }
});

document.getElementById('btn-sell-tower').addEventListener('click', () => {
  if (game.selectedTower) {
    if (game.selectedTower.pedestal) {
      game.selectedTower.pedestal.userData.occupied = false;
    }
    game.sellTower(game.selectedTower);
    closeInspector();
    updateHUD();
  }
});

// ==========================================================================
// SOUL FORGE MODAL (PERMANENT UPGRADES)
// ==========================================================================
const modalForge = document.getElementById('modal-soul-forge');

function renderSoulForge() {
  const container = document.getElementById('forge-upgrades-grid');
  document.getElementById('forge-souls-avail').textContent = game.souls;
  container.innerHTML = '';

  Object.values(SOUL_FORGE_UPGRADES).forEach((upDef) => {
    const currentRank = game.masteryRanks[upDef.id] || 0;
    const isMax = currentRank >= upDef.maxRank;
    const cost = isMax ? null : upDef.costs[currentRank];

    const card = document.createElement('div');
    card.className = 'forge-card';

    // Ranks Notch Bar
    let notchesHtml = '';
    for (let r = 1; r <= upDef.maxRank; r++) {
      notchesHtml += `<div class="rank-notch ${r <= currentRank ? 'filled' : ''}"></div>`;
    }

    card.innerHTML = `
      <div class="forge-card-header">
        <span class="forge-card-icon">${upDef.icon}</span>
        <div>
          <div class="forge-card-title">${upDef.name}</div>
          <span style="font-size:0.65rem; color:var(--text-gold); font-weight:700;">Rank ${currentRank} / ${upDef.maxRank}</span>
        </div>
      </div>
      <div class="forge-card-desc">${upDef.desc}</div>
      <div class="forge-card-rank-bar">${notchesHtml}</div>
      <button class="forge-buy-btn" data-id="${upDef.id}" ${isMax || game.souls < cost ? 'disabled' : ''}>
        <span>${isMax ? 'MAXED OUT' : 'UNLOCK RANK'}</span>
        <span>${isMax ? '✔️' : `${cost} 👻`}</span>
      </button>
    `;

    container.appendChild(card);
  });

  // Attach buy listeners
  container.querySelectorAll('.forge-buy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const upId = btn.dataset.id;
      const ok = game.purchaseSoulForgeUpgrade(upId);
      if (ok) {
        showFloatingText(`✨ Mastery Upgrade Unlocked!`, window.innerWidth / 2, 220);
        renderSoulForge();
        updateHUD();
      }
    });
  });
}

document.getElementById('btn-open-forge').addEventListener('click', () => {
  sound.init();
  renderSoulForge();
  modalForge.classList.remove('hidden');
});
document.getElementById('modal-forge-close').addEventListener('click', () => modalForge.classList.add('hidden'));
document.getElementById('btn-close-forge').addEventListener('click', () => modalForge.classList.add('hidden'));

// ==========================================================================
// ARCANE CODEX MODAL (CHARACTERS & BESTIARY SECTION)
// ==========================================================================
const modalCodex = document.getElementById('modal-codex');
const tabDefenders = document.getElementById('tab-defenders');
const tabEnemies = document.getElementById('tab-enemies');
let activeCodexTab = 'defenders';

function renderCodex() {
  const container = document.getElementById('codex-content');
  container.innerHTML = '';

  if (activeCodexTab === 'defenders') {
    CODEX_DATA.defenders.forEach((def) => {
      const card = document.createElement('div');
      card.className = 'codex-card';
      card.innerHTML = `
        <div class="codex-card-header">
          <div class="codex-avatar">${def.glyph}</div>
          <div>
            <div class="codex-name">${def.name}</div>
            <div class="codex-role">${def.role}</div>
          </div>
        </div>
        <div class="codex-lore">${def.lore}</div>
        <div class="codex-stats-row">
          <span>💥 Dmg: ${def.stats.damage}</span>
          <span>🎯 Rng: ${def.stats.range}</span>
          <span>⚡ ${def.stats.speed || def.stats.slow || def.stats.chain || def.stats.bonus}</span>
        </div>
        <div style="font-size:0.68rem; color:var(--text-muted); margin-top:2px;">
          <strong>Evolution Ranks:</strong> ${def.tiers.join(' • ')}
        </div>
      `;
      container.appendChild(card);
    });
  } else {
    CODEX_DATA.enemies.forEach((foe) => {
      const card = document.createElement('div');
      card.className = 'codex-card';
      card.innerHTML = `
        <div class="codex-card-header">
          <div class="codex-avatar">${foe.glyph}</div>
          <div>
            <div class="codex-name">${foe.name}</div>
            <span class="threat-tag">${foe.threat}</span>
          </div>
        </div>
        <div class="codex-stats-row">
          <span>❤️ HP: ${foe.hp}</span>
          <span>👟 Speed: ${foe.speed}</span>
        </div>
        <div style="font-size:0.72rem; color:var(--text-muted); line-height:1.3;">
          <div>⚡ <strong>Trait:</strong> ${foe.trait}</div>
          <div style="color:var(--text-gold); margin-top:2px;">🎯 <strong>Weakness:</strong> ${foe.weakness}</div>
        </div>
      `;
      container.appendChild(card);
    });
  }
}

tabDefenders.addEventListener('click', () => {
  activeCodexTab = 'defenders';
  tabDefenders.classList.add('active');
  tabEnemies.classList.remove('active');
  renderCodex();
});

tabEnemies.addEventListener('click', () => {
  activeCodexTab = 'enemies';
  tabEnemies.classList.add('active');
  tabDefenders.classList.remove('active');
  renderCodex();
});

document.getElementById('btn-open-codex').addEventListener('click', () => {
  sound.init();
  renderCodex();
  modalCodex.classList.remove('hidden');
});
document.getElementById('modal-codex-close').addEventListener('click', () => modalCodex.classList.add('hidden'));
document.getElementById('btn-close-codex').addEventListener('click', () => modalCodex.classList.add('hidden'));

// ==========================================================================
// QUESTS & BOUNTIES MODAL
// ==========================================================================
const modalQuests = document.getElementById('modal-quests');

function renderQuests() {
  const container = document.getElementById('quests-list');
  container.innerHTML = '';
  let claimableCount = 0;

  game.quests.forEach((q) => {
    const isCompleted = q.current >= q.target;
    if (isCompleted && !q.claimed) claimableCount++;
    const pct = Math.min(100, Math.round((q.current / q.target) * 100));

    const card = document.createElement('div');
    card.className = 'quest-card';
    card.innerHTML = `
      <div class="quest-info">
        <div class="quest-title">${q.title}</div>
        <div class="quest-desc">${q.desc}</div>
        <div class="quest-progress-track">
          <div class="quest-progress-fill" style="width: ${pct}%;"></div>
        </div>
        <span style="font-size:0.68rem; color:var(--text-muted);">${q.current} / ${q.target}</span>
      </div>
      <div class="quest-rewards">
        <div class="reward-pills">
          <span>+${q.rewardGold} 🪙</span>
          <span>+${q.rewardSouls} 👻</span>
        </div>
        <button class="quest-claim-btn ${q.claimed ? 'claimed' : ''}" data-id="${q.id}" ${q.claimed || !isCompleted ? 'disabled' : ''}>
          ${q.claimed ? 'CLAIMED' : isCompleted ? 'CLAIM' : 'IN PROGRESS'}
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  const badge = document.getElementById('quest-alert-badge');
  if (claimableCount > 0) {
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }

  container.querySelectorAll('.quest-claim-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const qId = btn.dataset.id;
      const ok = game.claimQuest(qId);
      if (ok) {
        showFloatingText(`🏆 Bounty Claimed!`, window.innerWidth / 2, 220);
        renderQuests();
        updateHUD();
      }
    });
  });
}

document.getElementById('btn-open-quests').addEventListener('click', () => {
  sound.init();
  renderQuests();
  modalQuests.classList.remove('hidden');
});
document.getElementById('modal-quests-close').addEventListener('click', () => modalQuests.classList.add('hidden'));
document.getElementById('btn-close-quests').addEventListener('click', () => modalQuests.classList.add('hidden'));

// ==========================================================================
// LEVELS & ENDLESS SPIRE REALM PORTAL MODAL
// ==========================================================================
const modalLevels = document.getElementById('modal-levels');
const tabLvlCampaign = document.getElementById('tab-lvl-campaign');
const tabLvlEndless = document.getElementById('tab-lvl-endless');
const tabLvlMilestones = document.getElementById('tab-lvl-milestones');
const tabLvlChallenges = document.getElementById('tab-lvl-challenges');

const paneLvlCampaign = document.getElementById('pane-lvl-campaign');
const paneLvlEndless = document.getElementById('pane-lvl-endless');
const paneLvlMilestones = document.getElementById('pane-lvl-milestones');
const paneLvlChallenges = document.getElementById('pane-lvl-challenges');

let activeLevelsTab = 'campaign';
let currentSpireTierStart = 5;

function openLevelsModal(defaultTab = 'campaign') {
  sound.init();
  switchLevelsTab(defaultTab);
  modalLevels.classList.remove('hidden');
}

function switchLevelsTab(tabKey) {
  activeLevelsTab = tabKey;
  const tabs = [
    { key: 'campaign', btn: tabLvlCampaign, pane: paneLvlCampaign },
    { key: 'endless', btn: tabLvlEndless, pane: paneLvlEndless },
    { key: 'milestones', btn: tabLvlMilestones, pane: paneLvlMilestones },
    { key: 'challenges', btn: tabLvlChallenges, pane: paneLvlChallenges },
  ];

  tabs.forEach((t) => {
    if (t.key === tabKey) {
      t.btn.classList.add('active');
      t.pane.classList.remove('hidden');
    } else {
      t.btn.classList.remove('active');
      t.pane.classList.add('hidden');
    }
  });

  renderLevelsModal();
}

tabLvlCampaign.addEventListener('click', () => switchLevelsTab('campaign'));
tabLvlEndless.addEventListener('click', () => switchLevelsTab('endless'));
tabLvlMilestones.addEventListener('click', () => switchLevelsTab('milestones'));
tabLvlChallenges.addEventListener('click', () => switchLevelsTab('challenges'));

document.getElementById('modal-levels-close').addEventListener('click', () => modalLevels.classList.add('hidden'));
document.getElementById('btn-close-levels').addEventListener('click', () => modalLevels.classList.add('hidden'));
document.getElementById('btn-open-levels').addEventListener('click', () => openLevelsModal('campaign'));
document.getElementById('level-badge').addEventListener('click', () => openLevelsModal('campaign'));
document.getElementById('mutator-hud-pill').addEventListener('click', () => openLevelsModal('campaign'));

document.getElementById('btn-vic-open-levels').addEventListener('click', () => {
  document.getElementById('modal-level-cleared').classList.add('hidden');
  openLevelsModal('endless');
});

document.getElementById('btn-fail-levels').addEventListener('click', () => {
  document.getElementById('modal-gameover').classList.add('hidden');
  openLevelsModal('campaign');
});

// Jump to highest unlocked spire level
document.getElementById('btn-spire-highest').addEventListener('click', () => {
  sound.init();
  const highest = Math.max(5, game.maxLevelUnlocked);
  game.loadLevel(highest - 1);
  modalLevels.classList.add('hidden');
  showFloatingText(`🚀 Ascended to Spire Level ${highest}!`, window.innerWidth / 2, 220);
  updateHUD();
});

// Spire tier dropdown
const spireTierSelect = document.getElementById('spire-tier-select');
spireTierSelect.addEventListener('change', (e) => {
  sound.init();
  currentSpireTierStart = parseInt(e.target.value, 10);
  renderLevelsModal();
});

function renderLevelsModal() {
  document.getElementById('portal-stars-total').textContent = `⭐ ${game.getTotalStars()} Total Stars Collected`;
  document.getElementById('portal-max-level').textContent = `Highest Reached: Level ${game.maxLevelUnlocked}`;

  if (activeLevelsTab === 'campaign') {
    renderCampaignPane();
  } else if (activeLevelsTab === 'endless') {
    renderEndlessPane();
  } else if (activeLevelsTab === 'milestones') {
    renderMilestonesPane();
  } else if (activeLevelsTab === 'challenges') {
    renderChallengesPane();
  }
}

function renderCampaignPane() {
  const container = document.getElementById('campaign-levels-grid');
  container.innerHTML = '';

  LEVEL_DEFINITIONS.forEach((lvlDef, idx) => {
    const lvlNum = lvlDef.level;
    const stars = game.getLevelStars(lvlNum);
    const isUnlocked = game.isLevelUnlocked(lvlNum);
    const isCurrent = game.currentLevelIndex === idx;

    let starHtml = '';
    for (let s = 1; s <= 3; s++) {
      starHtml += `<span class="${s <= stars ? 'star-filled' : 'star-empty'}">⭐</span>`;
    }

    const card = document.createElement('div');
    card.className = `level-card ${isCurrent ? 'active-realm' : ''} ${!isUnlocked ? 'locked' : ''}`;
    card.innerHTML = `
      <div class="level-card-header">
        <div>
          <div class="level-card-num">CAMPAIGN REALM 0${lvlNum}</div>
          <div class="level-card-title">${lvlDef.name}</div>
        </div>
        <div class="level-card-stars">${starHtml}</div>
      </div>
      <span class="level-card-theme-tag ${lvlDef.theme}">${lvlDef.theme} Realm</span>
      <div class="level-card-mutator">
        ${lvlDef.mutator.icon} <strong>${lvlDef.mutator.name}:</strong> ${lvlDef.mutator.desc}
      </div>
      <div class="level-card-meta">
        <span>⚔️ ${lvlDef.totalWaves} Waves</span>
        <span>👑 Boss: ${lvlDef.bossName}</span>
      </div>
      <button class="level-enter-btn ${isCurrent ? 'active-btn' : ''}" data-idx="${idx}" ${!isUnlocked ? 'disabled' : ''}>
        ${isCurrent ? '● CURRENT REALM' : isUnlocked ? (stars > 0 ? 'REPLAY REALM' : 'ENTER REALM') : '🔒 LOCKED'}
      </button>
    `;

    container.appendChild(card);
  });

  container.querySelectorAll('.level-enter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (idx === game.currentLevelIndex) return;
      game.loadLevel(idx);
      modalLevels.classList.add('hidden');
      showFloatingText(`🌌 Teleported to Realm ${idx + 1}!`, window.innerWidth / 2, 220);
      updateHUD();
    });
  });
}

function renderEndlessPane() {
  const container = document.getElementById('endless-levels-grid');
  container.innerHTML = '';

  const tierCount = 10;
  for (let i = 0; i < tierCount; i++) {
    const lvlNum = currentSpireTierStart + i;
    const lvlDef = generateLevelDefinition(lvlNum);
    const stars = game.getLevelStars(lvlNum);
    const isUnlocked = game.isLevelUnlocked(lvlNum);
    const isCurrent = game.currentLevelIndex === (lvlNum - 1);

    let starHtml = '';
    for (let s = 1; s <= 3; s++) {
      starHtml += `<span class="${s <= stars ? 'star-filled' : 'star-empty'}">⭐</span>`;
    }

    const card = document.createElement('div');
    card.className = `level-card ${isCurrent ? 'active-realm' : ''} ${!isUnlocked ? 'locked' : ''}`;
    card.innerHTML = `
      <div class="level-card-header">
        <div>
          <div class="level-card-num">ENDLESS SPIRE • FLOOR ${lvlNum}</div>
          <div class="level-card-title">${lvlDef.name}</div>
        </div>
        <div class="level-card-stars">${starHtml}</div>
      </div>
      <span class="level-card-theme-tag ${lvlDef.theme}">${lvlDef.theme} Dimension</span>
      <div class="level-card-mutator">
        ${lvlDef.mutator.icon} <strong>${lvlDef.mutator.name}:</strong> ${lvlDef.mutator.desc}
      </div>
      <div class="level-card-meta">
        <span>⚔️ ${lvlDef.totalWaves} Waves</span>
        <span>👑 ${lvlDef.bossName}</span>
      </div>
      <button class="level-enter-btn ${isCurrent ? 'active-btn' : ''}" data-lvl="${lvlNum}" ${!isUnlocked ? 'disabled' : ''}>
        ${isCurrent ? '● ACTIVE FLOOR' : isUnlocked ? (stars > 0 ? 'RE-ENTER FLOOR' : 'ASCEND TO FLOOR') : `🔒 REACH LVL ${lvlNum}`}
      </button>
    `;

    container.appendChild(card);
  }

  container.querySelectorAll('.level-enter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lvlNum = parseInt(btn.dataset.lvl, 10);
      if (lvlNum - 1 === game.currentLevelIndex) return;
      game.jumpToLevel(lvlNum);
      modalLevels.classList.add('hidden');
      showFloatingText(`🌀 Ascended to Spire Floor ${lvlNum}!`, window.innerWidth / 2, 220);
      updateHUD();
    });
  });
}

function renderMilestonesPane() {
  const container = document.getElementById('milestones-list');
  container.innerHTML = '';
  const totalStars = game.getTotalStars();

  REALM_STAR_MILESTONES.forEach((ms) => {
    const isClaimed = game.hasMilestone(ms.id);
    const canClaim = totalStars >= ms.starsRequired && !isClaimed;

    const card = document.createElement('div');
    card.className = `milestone-card ${isClaimed ? 'claimed' : ''}`;
    card.innerHTML = `
      <div class="milestone-main">
        <div class="milestone-icon">${ms.icon}</div>
        <div class="milestone-title-group">
          <div class="milestone-title">${ms.name}</div>
          <div class="milestone-desc">${ms.desc}</div>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:0.78rem; font-weight:700; color:var(--text-gold);">${Math.min(ms.starsRequired, totalStars)} / ${ms.starsRequired} ⭐</span>
        <button class="milestone-claim-btn ${isClaimed ? 'claimed' : ''}" data-id="${ms.id}" ${isClaimed || !canClaim ? 'disabled' : ''}>
          ${isClaimed ? 'ACQUIRED' : canClaim ? 'CLAIM RELIC' : 'LOCKED'}
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  container.querySelectorAll('.milestone-claim-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const msId = btn.dataset.id;
      const ok = game.claimMilestone(msId);
      if (ok) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
        showFloatingText('⭐ Ancient Star Relic Claimed!', window.innerWidth / 2, 220);
        renderMilestonesPane();
        updateHUD();
      }
    });
  });
}

function renderChallengesPane() {
  const container = document.getElementById('challenges-list');
  container.innerHTML = '';

  CHALLENGE_MODIFIERS.forEach((ch) => {
    const isActive = game.hasChallenge(ch.id);

    const card = document.createElement('div');
    card.className = 'challenge-card';
    card.innerHTML = `
      <div class="challenge-main">
        <div class="challenge-icon">${ch.icon}</div>
        <div class="challenge-title-group">
          <div class="challenge-title">${ch.name}</div>
          <div class="challenge-desc">${ch.desc}</div>
        </div>
      </div>
      <button class="challenge-toggle-btn ${isActive ? 'active' : ''}" data-id="${ch.id}">
        ${isActive ? 'ACTIVATED' : 'ENABLE'}
      </button>
    `;

    container.appendChild(card);
  });

  container.querySelectorAll('.challenge-toggle-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chId = btn.dataset.id;
      const nowActive = game.toggleChallenge(chId);
      showFloatingText(nowActive ? `🩸 Challenge Enabled!` : `Challenge Disabled`, window.innerWidth / 2, 220);
      renderChallengesPane();
      updateHUD();
    });
  });
}

// ==========================================================================
// LIGHT / DARK THEME TOGGLE
// ==========================================================================
const btnThemeToggle = document.getElementById('btn-theme-toggle');
const themeBtnIcon = document.getElementById('theme-btn-icon');

btnThemeToggle.addEventListener('click', () => {
  sound.init();
  isLightTheme = !isLightTheme;
  document.body.classList.toggle('light-theme', isLightTheme);

  if (isLightTheme) {
    themeBtnIcon.textContent = '🌙 Dark';
    rebuildWorldForLevel(game.currentLevelDef, game.pathWaypoints, 'celestial');
    showFloatingText('☀️ Celestial Dawn: Light Theme Activated!', window.innerWidth / 2, 220);
  } else {
    themeBtnIcon.textContent = '☀️ Light';
    rebuildWorldForLevel(game.currentLevelDef, game.pathWaypoints, game.currentLevelDef.theme);
    showFloatingText('🌙 Gothic Midnight: Dark Theme Activated!', window.innerWidth / 2, 220);
  }
});

// ==========================================================================
// HUD UPDATES & CONTROLS BINDING
// ==========================================================================

function updateHUD() {
  const hpPct = Math.max(0, (game.health / game.maxHealth) * 100);
  healthFill.style.width = `${hpPct}%`;
  healthText.textContent = `${game.health} / ${game.maxHealth} HP`;

  // Render Hearts row (10 pips representing max health)
  const heartsEl = document.getElementById('hearts-display');
  if (heartsEl) {
    const totalHearts = Math.min(10, Math.ceil(game.maxHealth / 2));
    const currentHearts = Math.ceil((game.health / game.maxHealth) * totalHearts);
    let heartsHtml = '';
    for (let h = 1; h <= totalHearts; h++) {
      if (h <= currentHearts) {
        heartsHtml += `<span class="heart-pip">❤️</span>`;
      } else {
        heartsHtml += `<span class="heart-pip lost">🖤</span>`;
      }
    }
    heartsEl.innerHTML = heartsHtml;
  }

  goldAmount.textContent = game.gold;
  soulAmount.textContent = game.souls;

  // Spell Costs with discount
  const discount = 1.0 - (game.masteryRanks.spell_discount || 0) * 0.15;
  document.getElementById('cost-meteor').textContent = `${Math.round(20 * discount)} 👻`;
  document.getElementById('cost-freeze').textContent = `${Math.round(25 * discount)} 👻`;
  document.getElementById('cost-frenzy').textContent = `${Math.round(30 * discount)} 👻`;

  waveTitle.innerHTML = `WAVE ${game.currentWave} <span class="wave-max">/ ${game.maxWaves}</span>`;
  if (game.isWaveActive) {
    const total = game.totalEnemiesInWave || 1;
    const alive = game.enemies.length + game.waveSpawnQueue.length;
    const progress = Math.min(100, Math.round(((total - alive) / total) * 100));
    waveProgressBar.style.width = `${progress}%`;
    enemyCountText.textContent = `${alive} Horrors Remaining`;
    btnStartWave.disabled = true;
    btnStartWave.classList.remove('primary-glow');
  } else {
    waveProgressBar.style.width = '0%';
    enemyCountText.textContent = game.currentWave >= game.maxWaves ? 'Realm Purified!' : 'Ready for Nightfall';
    btnStartWave.disabled = game.currentWave >= game.maxWaves;
    btnStartWave.classList.add('primary-glow');
  }

  // Weapon Icon Buttons Affordability
  weaponBtns.forEach((btn) => {
    const type = btn.dataset.type;
    const cfg = TOWER_CONFIGS[type];
    if (cfg) {
      if (game.gold < cfg.cost) {
        btn.classList.add('disabled');
      } else {
        btn.classList.remove('disabled');
      }
    }
  });

  // Spell Buttons Affordability
  const spellMeteor = document.getElementById('spell-meteor');
  const spellFreeze = document.getElementById('spell-freeze');
  const spellFrenzy = document.getElementById('spell-frenzy');
  if (spellMeteor) spellMeteor.disabled = game.souls < Math.round(20 * discount);
  if (spellFreeze) spellFreeze.disabled = game.souls < Math.round(25 * discount);
  if (spellFrenzy) spellFrenzy.disabled = game.souls < Math.round(30 * discount);

  // Check Quests Alert Badge
  const hasClaimable = game.quests.some((q) => q.current >= q.target && !q.claimed);
  const badge = document.getElementById('quest-alert-badge');
  if (hasClaimable) badge.classList.remove('hidden');
  else badge.classList.add('hidden');

  // Update star counter badge on Levels button
  const starsBadge = document.getElementById('levels-stars-badge');
  if (starsBadge) starsBadge.textContent = `⭐ ${game.getTotalStars()}`;

  // Level Victory Modal (Confetti only fired once!)
  if (game.isLevelVictory) {
    const modal = document.getElementById('modal-level-cleared');
    const wasHidden = modal.classList.contains('hidden');
    if (wasHidden) {
      modal.classList.remove('hidden');
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }

    const starsEarned = game.lastStarsEarned || 3;
    let starsDisplay = '';
    for (let s = 1; s <= 3; s++) {
      starsDisplay += `<span class="${s <= starsEarned ? 'star-filled' : 'star-empty'}">⭐</span>`;
    }
    const victoryStarsEl = document.getElementById('victory-stars-display');
    if (victoryStarsEl) victoryStarsEl.innerHTML = starsDisplay;

    const hpPct = Math.round((game.health / game.maxHealth) * 100);
    const vicHpEl = document.getElementById('vic-hp-left');
    if (vicHpEl) vicHpEl.textContent = `❤️ Citadel HP: ${hpPct}%`;
    const vicSoulsEl = document.getElementById('vic-souls-gained');
    if (vicSoulsEl) vicSoulsEl.textContent = `+${game.currentLevelIndex * 15 + 25} 👻 Bonus Souls`;

    const nextIdx = game.currentLevelIndex + 1;
    const nextDef = generateLevelDefinition(nextIdx + 1);
    document.getElementById('next-realm-name').textContent = nextDef.name;
    document.getElementById('next-realm-theme').textContent = `(${nextDef.theme.toUpperCase()} • ${nextDef.totalWaves} Waves)`;
    const nextMutatorEl = document.getElementById('next-realm-mutator');
    if (nextMutatorEl) nextMutatorEl.textContent = `${nextDef.mutator.icon} ${nextDef.mutator.name}`;
  }

  // Game Over Modal
  if (game.isGameOver) {
    const modal = document.getElementById('modal-gameover');
    modal.classList.remove('hidden');
    document.getElementById('end-level').textContent = game.currentLevelDef.name;
    document.getElementById('end-kills').textContent = game.totalKills;
    document.getElementById('end-souls').textContent = game.totalSoulsCollected;
  }
}

// Next Realm Button Click
document.getElementById('btn-next-realm').addEventListener('click', () => {
  document.getElementById('modal-level-cleared').classList.add('hidden');
  game.nextLevel();
  updateHUD();
});

// Wave Start Trigger
btnStartWave.addEventListener('click', () => {
  sound.init();
  game.startNextWave();

  if (game.currentWave === game.maxWaves) {
    showFloatingText(`👑 BOSS ALERT: ${game.currentLevelDef.bossName} Emerges!`, window.innerWidth / 2, 200, true);
  } else if (game.currentLevelIndex === 1 && game.currentWave === 1) {
    showFloatingText('⚠️ HELLHOUNDS SPOTTED: Extreme speed!', window.innerWidth / 2, 200);
  } else if (game.currentLevelIndex === 2 && game.currentWave === 1) {
    showFloatingText('❄️ BANSHEES APPROACH: Emitting speed auras!', window.innerWidth / 2, 200);
  } else if (game.currentLevelIndex === 3 && game.currentWave === 1) {
    showFloatingText('💀 NECROMANCERS INCOMING: Raising the fallen!', window.innerWidth / 2, 200);
  }

  updateHUD();
});

// Blue Upgrade Button in Dock & Key [U]
function triggerUpgradeCard() {
  sound.init();
  if (game.selectedTower) {
    selectTowerForInspection(game.selectedTower);
  } else if (game.towers.length > 0) {
    selectTowerForInspection(game.towers[0]);
    showFloatingText(`⚡ Inspected ${game.towers[0].config.name}!`, window.innerWidth / 2, 220);
  } else {
    renderSoulForge();
    modalForge.classList.remove('hidden');
    showFloatingText('💡 Build defenders along the route, or forge Sanctum mastery here!', window.innerWidth / 2, 220);
  }
}

const dockBtnUpgrade = document.getElementById('dock-btn-upgrade');
if (dockBtnUpgrade) {
  dockBtnUpgrade.addEventListener('click', triggerUpgradeCard);
}

// Keyboard Shortcuts: Space for wave, 1-3 for spells, Q-R for weapons, U for upgrade, L for levels!
window.addEventListener('keydown', (e) => {
  const key = e.key.toUpperCase();
  if (e.code === 'Space') {
    e.preventDefault();
    sound.init();
    btnStartWave.click();
  } else if (e.key === '1') {
    triggerSpellSelection('meteor');
  } else if (e.key === '2') {
    triggerSpellSelection('freeze');
  } else if (e.key === '3') {
    triggerSpellSelection('frenzy');
  } else if (key === 'Q') {
    selectWeaponType('gargoyle');
  } else if (key === 'W') {
    selectWeaponType('cauldron');
  } else if (key === 'E') {
    selectWeaponType('crypt');
  } else if (key === 'R') {
    selectWeaponType('tesla');
  } else if (key === 'U') {
    triggerUpgradeCard();
  } else if (key === 'L') {
    openLevelsModal('campaign');
  }
});

// Weapon Adding Icon Click
function selectWeaponType(type) {
  sound.init();
  const cfg = TOWER_CONFIGS[type];
  if (game.gold < cfg.cost) return;

  const btn = document.getElementById(`wpn-${type}`);
  if (selectedTowerType === type) {
    selectedTowerType = null;
    weaponBtns.forEach((b) => b.classList.remove('selected'));
    rangeRing.visible = false;
  } else {
    selectedTowerType = type;
    weaponBtns.forEach((b) => b.classList.remove('selected'));
    if (btn) btn.classList.add('selected');
  }
}

weaponBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;
    selectWeaponType(type);
  });
});

// Spell Triggering
function triggerSpellSelection(spellName) {
  sound.init();
  const discount = 1.0 - (game.masteryRanks.spell_discount || 0) * 0.15;
  const meteorCost = Math.round(20 * discount);

  if (spellName === 'freeze' || spellName === 'frenzy') {
    const ok = game.castSpell(spellName);
    if (ok) {
      showFloatingText(`✨ Cast ${spellName.toUpperCase()}!`, window.innerWidth / 2, 200);
      updateHUD();
    }
  } else if (spellName === 'meteor') {
    if (game.souls >= meteorCost) {
      game.activeCastingSpell = 'meteor';
      spellBtns.forEach((b) => b.classList.remove('active-cast'));
      document.getElementById('spell-meteor').classList.add('active-cast');
      showFloatingText('☄️ Click anywhere on the island to call the meteor!', window.innerWidth / 2, 200);
    }
  }
}

spellBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    triggerSpellSelection(btn.dataset.spell);
  });
});

// Speed Controls
const speedBtns = [
  document.getElementById('btn-speed-1x'),
  document.getElementById('btn-speed-2x'),
  document.getElementById('btn-speed-4x'),
];

speedBtns.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    speedBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    game.gameSpeed = [1.0, 2.0, 4.0][idx];
  });
});

// Audio Toggle
const btnAudio = document.getElementById('btn-audio-toggle');
const audioIcon = document.getElementById('audio-icon');
btnAudio.addEventListener('click', () => {
  sound.init();
  const isMuted = sound.toggleMute();
  audioIcon.textContent = isMuted ? '🔇' : '🔊';
});

// Reset Camera
document.getElementById('btn-reset-cam').addEventListener('click', () => {
  camera.position.copy(DEFAULT_CAM_POS);
  controls.target.set(0, 0.5, 0);
  controls.update();
});

// Grimoire Modal
const modalGrimoire = document.getElementById('modal-grimoire');
document.getElementById('btn-help').addEventListener('click', () => {
  modalGrimoire.classList.remove('hidden');
});
document.getElementById('modal-grimoire-close').addEventListener('click', () => {
  modalGrimoire.classList.add('hidden');
});
document.getElementById('btn-close-guide').addEventListener('click', () => {
  modalGrimoire.classList.add('hidden');
  sound.init();
});

// Reset Player Progress Button
const btnResetProgress = document.getElementById('btn-reset-progress');
if (btnResetProgress) {
  btnResetProgress.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all saved progression and restart from Level 1?')) {
      game.resetAllProgress();
      window.location.reload();
    }
  });
}

// Interactive Starting Tutorial Overlay Card
const tutorialOverlay = document.getElementById('tutorial-overlay');
let tutStepIndex = 0;
const TUTORIAL_STEPS = [
  {
    title: '1. Protect The Sanctum Citadel',
    desc: 'The grand Citadel at the end of the stone road houses the Sacred Life Crystal. Monsters follow the road to breach the gates. If Citadel lives reach 0, the realm falls!',
    hint: '💡 Foes emerge from the swirling Rift Portals. Place defenses along the route!',
    icon: '🏰',
  },
  {
    title: '2. Deploy Defenses Along The Route',
    desc: 'Select a defender from the bottom dock [Q - R] and place it on any stone pedestal flanking the road. Each pedestal is a designated firing platform that foes cannot destroy!',
    hint: '💡 Gargoyles excel at single targets, Witch Cauldrons splash and slow!',
    icon: '🗿',
  },
  {
    title: '3. Upgrade Defenders & Soul Forge',
    desc: 'Click on any placed defender (or press [U] / click the blue upgrade icon) to inspect and upgrade its rank. Defeated foes drop Souls to forge permanent Sanctum masteries!',
    hint: '💡 Upgraded defenders gain extended range and devastating attack power!',
    icon: '⚡',
  },
  {
    title: '4. God Rituals & Infinite Realms',
    desc: 'Cast powerful God Rituals [1 - 3] like Eldritch Meteor, Frost Nova, and Blood Moon. Open the Levels Menu [L] to travel across infinite realms and conquer the Endless Spire!',
    hint: '💡 Press Spacebar when ready to unleash the next enemy wave!',
    icon: '🗺️',
  },
];

function updateTutorialStep(idx) {
  tutStepIndex = Math.max(0, Math.min(TUTORIAL_STEPS.length - 1, idx));
  const step = TUTORIAL_STEPS[tutStepIndex];
  document.getElementById('tut-step-title').textContent = step.title;
  document.getElementById('tut-step-desc').textContent = step.desc;
  document.getElementById('tut-illustration').textContent = step.icon;
  document.getElementById('tut-hint-pill').textContent = step.hint;
  document.getElementById('tut-step-count').textContent = `Step ${tutStepIndex + 1} of ${TUTORIAL_STEPS.length}`;
  document.querySelectorAll('.tut-dot').forEach((dot, dIdx) => {
    dot.classList.toggle('active', dIdx === tutStepIndex);
  });
  document.getElementById('tut-btn-next').textContent = tutStepIndex === TUTORIAL_STEPS.length - 1 ? 'START BATTLE ⚔️' : 'NEXT ▶';
}

function openTutorial() {
  tutorialOverlay.classList.remove('hidden');
  updateTutorialStep(0);
}

function closeTutorial() {
  tutorialOverlay.classList.add('hidden');
  localStorage.setItem('gargoyle_tut_seen', 'true');
}

document.getElementById('tut-btn-next').addEventListener('click', () => {
  if (tutStepIndex < TUTORIAL_STEPS.length - 1) {
    updateTutorialStep(tutStepIndex + 1);
  } else {
    closeTutorial();
  }
});
document.getElementById('tut-btn-skip').addEventListener('click', closeTutorial);
document.getElementById('tut-close').addEventListener('click', closeTutorial);
document.getElementById('btn-open-tutorial').addEventListener('click', openTutorial);

if (!localStorage.getItem('gargoyle_tut_seen')) {
  openTutorial();
}

// Restart Game
document.getElementById('btn-restart-game').addEventListener('click', () => {
  window.location.reload();
});

// ==========================================================================
// RENDER & ANIMATION LOOP (Optimized 60+ FPS)
// ==========================================================================

let lastTime = performance.now();
const startTime = performance.now();
let lastHudUpdate = 0;

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const delta = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  const elapsed = (now - startTime) / 1000;

  // Pass camera to update for 3D billboard health bar orientation
  game.update(delta, camera);
  controls.update();

  // Castle Citadel Hearth Crystal & Flag Animations
  if (currentHearthMesh && currentHearthMesh.userData.flameMesh) {
    currentHearthMesh.userData.flameMesh.position.y = currentHearthMesh.userData.baseY + Math.sin(elapsed * 3) * 0.08;
    currentHearthMesh.userData.flameMesh.rotation.y += 0.02;
    if (currentHearthMesh.userData.orbitRing) {
      currentHearthMesh.userData.orbitRing.rotation.z += 0.03;
    }
    if (currentHearthMesh.userData.heartGroup) {
      currentHearthMesh.userData.heartGroup.position.y = 3.75 + Math.sin(elapsed * 2) * 0.06;
      currentHearthMesh.userData.heartGroup.rotation.y += 0.015;
    }
    if (currentHearthMesh.userData.hearthLight) {
      currentHearthMesh.userData.hearthLight.intensity = 2.6 + Math.sin(elapsed * 5) * 0.5;
    }
  }

  // Animate Portal Archway vortex rings
  for (let arch of portalArchways) {
    if (arch.userData.ring) {
      arch.userData.ring.rotation.z += 0.04;
    }
  }

  starPoints.rotation.y += 0.0003;
  renderer.render(scene, camera);

  // Throttle DOM HUD updates to 10 FPS (every 100ms) to eliminate lag & DOM thrashing
  if (now - lastHudUpdate > 100) {
    lastHudUpdate = now;
    updateHUD();
  }
}

animate();
