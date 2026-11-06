import * as THREE from 'three';
import { feature } from 'topojson-client';
import land from 'world-atlas/land-110m.json';

const RACE = 5.2; // seconds from lights out to the flag
const LAND_START = RACE - 0.9;
const LAND_TIME = 2.3;
const LAND_FADE = 1.9; // tell the page to reveal the hero this far into the landing
const CHASE_HEIGHT = 0.26;

const STOPS = [
  { name: 'Monza, Italy', lat: 45.62, lon: 9.28 },
  { name: 'Interlagos, Brazil', lat: -23.7, lon: -46.7 },
  { name: 'Austin, USA', lat: 30.13, lon: -97.64 },
  { name: 'Suzuka, Japan', lat: 34.84, lon: 136.54 },
  { name: 'Lipa, Philippines', lat: 13.94, lon: 121.16 },
];

const CAR_COLOR = '#e10600';

const clamp01 = v => Math.min(1, Math.max(0, v));
const smooth = v => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

const toVector = (lat, lon) => {
  const phi = (lat * Math.PI) / 180;
  const lam = (lon * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(phi) * Math.sin(lam), Math.sin(phi), Math.cos(phi) * Math.cos(lam));
};

const slerp = (a, b, t) => {
  const angle = a.angleTo(b);
  if (angle < 1e-5) return a.clone();
  const s = Math.sin(angle);
  return a
    .clone()
    .multiplyScalar(Math.sin((1 - t) * angle) / s)
    .addScaledVector(b, Math.sin(t * angle) / s);
};

// The race line: great-circle legs between circuits, smoothed and evenly spaced
function buildRoute() {
  const stops = STOPS.map(s => toVector(s.lat, s.lon));
  const runUp = toVector(47.2, 15.4);
  const runOff = toVector(12.2, 126.5);
  const anchors = [runUp, ...stops, runOff];
  const points = [];
  anchors.slice(0, -1).forEach((a, i) => {
    const steps = Math.max(3, Math.round(a.angleTo(anchors[i + 1]) * 9));
    for (let k = 0; k < steps; k++) points.push(slerp(a, anchors[i + 1], k / steps));
  });
  points.push(runOff);

  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
  const count = 2400;
  const dirs = curve.getSpacedPoints(count).map(p => p.normalize());
  const tangents = dirs.map((_, i) => {
    const a = dirs[Math.max(0, i - 10)];
    const b = dirs[Math.min(count, i + 10)];
    return b.clone().sub(a).normalize();
  });
  const nearest = target => {
    let best = 0;
    let bestDot = -2;
    dirs.forEach((d, i) => {
      const dot = d.dot(target);
      if (dot > bestDot) {
        bestDot = dot;
        best = i;
      }
    });
    return best / count;
  };

  return { dirs, tangents, count, stopAt: stops.map(nearest) };
}

function sample(route, u, dir, tangent) {
  const f = clamp01(u) * route.count;
  const i = Math.min(route.count - 1, Math.floor(f));
  const k = f - i;
  dir.copy(route.dirs[i]).lerp(route.dirs[i + 1], k).normalize();
  tangent.copy(route.tangents[i]).lerp(route.tangents[i + 1], k);
  tangent.addScaledVector(dir, -tangent.dot(dir)).normalize();
}

function landMask() {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const shapes = feature(land, land.objects.land);
  const rings = [];
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  for (const item of shapes.features) {
    const polygons = item.geometry.type === 'Polygon' ? [item.geometry.coordinates] : item.geometry.coordinates;
    for (const polygon of polygons) {
      for (const ring of polygon) {
        rings.push(ring);
        ring.forEach(([lon, lat], i) => {
          const x = ((lon + 180) / 360) * width;
          const y = ((90 - lat) / 180) * height;
          if (i) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        });
        ctx.closePath();
      }
    }
  }
  ctx.fill('evenodd');
  const { data } = ctx.getImageData(0, 0, width, height);
  const isLand = (lat, lon) => {
    const x = Math.min(width - 1, Math.floor(((lon + 180) / 360) * width));
    const y = Math.min(height - 1, Math.floor(((90 - lat) / 180) * height));
    return data[(y * width + x) * 4] > 128;
  };
  return { isLand, rings };
}

function dotTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 32;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(16, 16, 14, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

function glowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.25, 'rgba(255,255,255,0.45)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

function checkerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 8; x++) {
      ctx.fillStyle = (x + y) % 2 ? '#111' : '#fff';
      ctx.fillRect(x * 16, y * 16, 16, 16);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  return texture;
}

function buildGlobe(scene) {
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1, 96, 96),
    new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          vec4 p = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-p.xyz);
          gl_Position = projectionMatrix * p;
        }`,
      fragmentShader: `
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          float rim = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 3.0);
          gl_FragColor = vec4(mix(vec3(0.028, 0.018, 0.055), vec3(0.3, 0.17, 0.62), rim), 1.0);
        }`,
    })
  );
  scene.add(globe);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.17, 64, 64),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          vec4 p = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-p.xyz);
          gl_Position = projectionMatrix * p;
        }`,
      fragmentShader: `
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          float d = abs(dot(normalize(vN), normalize(vV)));
          float glow = pow(smoothstep(0.0, 0.52, d), 4.0) * 0.42;
          gl_FragColor = vec4(vec3(0.5, 0.3, 1.0) * glow, glow);
        }`,
    })
  );
  scene.add(atmosphere);

  const { isLand, rings } = landMask();

  // land as a fine dot matrix
  const total = 120000;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const positions = [];
  for (let i = 0; i < total; i++) {
    const y = 1 - (i / (total - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.sin(theta) * radius;
    const z = Math.cos(theta) * radius;
    const lat = (Math.asin(y) * 180) / Math.PI;
    const lon = (Math.atan2(x, z) * 180) / Math.PI;
    if (isLand(lat, lon)) positions.push(x * 1.001, y * 1.001, z * 1.001);
  }
  const dots = new THREE.BufferGeometry();
  dots.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  scene.add(
    new THREE.Points(
      dots,
      new THREE.PointsMaterial({
        size: 0.0062,
        map: dotTexture(),
        alphaTest: 0.5,
        color: '#a48fe0',
      })
    )
  );

  // crisp coastlines
  const coast = [];
  for (const ring of rings) {
    for (let i = 0; i < ring.length - 1; i++) {
      const a = toVector(ring[i][1], ring[i][0]).multiplyScalar(1.0015);
      const b = toVector(ring[i + 1][1], ring[i + 1][0]).multiplyScalar(1.0015);
      coast.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
  const coastGeometry = new THREE.BufferGeometry();
  coastGeometry.setAttribute('position', new THREE.Float32BufferAttribute(coast, 3));
  scene.add(
    new THREE.LineSegments(
      coastGeometry,
      new THREE.LineBasicMaterial({ color: '#d9ccff', transparent: true, opacity: 0.55 })
    )
  );

  // faint stars
  const stars = [];
  for (let i = 0; i < 1400; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(9 + Math.random() * 7);
    stars.push(v.x, v.y, v.z);
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
  scene.add(
    new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ size: 0.028, color: '#cfc6e6', transparent: true, opacity: 0.7 })
    )
  );
}

// A static band along the race line
function buildRouteRibbon(scene, route, finishU) {
  const dir = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();
  const steps = 900;
  const positions = [];
  const index = [];
  for (let i = 0; i <= steps; i++) {
    sample(route, (i / steps) * finishU, dir, tangent);
    side.crossVectors(dir, tangent).multiplyScalar(0.012);
    const a = dir.clone().multiplyScalar(1.0028).add(side);
    const b = dir.clone().multiplyScalar(1.0028).sub(side);
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    if (i < steps) {
      const v = i * 2;
      index.push(v, v + 1, v + 2, v + 1, v + 3, v + 2);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(index);
  scene.add(
    new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        color: '#ff2a1f',
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
  );
}

function placeOnSurface(object, dir, tangent, altitude) {
  const side = new THREE.Vector3().crossVectors(dir, tangent);
  object.matrixAutoUpdate = false;
  object.matrix.makeBasis(side, dir, tangent);
  object.matrix.setPosition(dir.clone().multiplyScalar(altitude));
}

function buildMarkers(scene, route, finishU, startU) {
  const dir = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const checker = checkerTexture();

  for (const u of [startU, finishU]) {
    sample(route, u, dir, tangent);
    const geometry = new THREE.PlaneGeometry(0.06, 0.015).rotateX(-Math.PI / 2);
    const line = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: checker, side: THREE.DoubleSide }));
    placeOnSurface(line, dir, tangent, 1.0034);
    scene.add(line);
  }

  // beacon over the finish so it reads from far away
  sample(route, finishU, dir, tangent);
  const beacon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0035, 0.0035, 0.42, 10).translate(0, 0.21, 0),
    new THREE.MeshBasicMaterial({
      color: '#ff2a1f',
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  placeOnSurface(beacon, dir, tangent, 1);
  scene.add(beacon);
  return beacon;
}

// Low-poly single-seater, nose along +Z, length about 1
function buildCar(color, glow) {
  const car = new THREE.Group();
  const paint = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.25, emissive: color, emissiveIntensity: 0.15 });
  const dark = new THREE.MeshStandardMaterial({ color: '#0d0d11', roughness: 0.7 });

  const outline = new THREE.Shape();
  [
    [0.03, 0.5],
    [0.06, 0.16],
    [0.15, 0.02],
    [0.17, -0.26],
    [0.09, -0.46],
    [-0.09, -0.46],
    [-0.17, -0.26],
    [-0.15, 0.02],
    [-0.06, 0.16],
    [-0.03, 0.5],
  ].forEach(([x, z], i) => (i ? outline.lineTo(x, z) : outline.moveTo(x, z)));
  const body = new THREE.ExtrudeGeometry(outline, { depth: 0.09, bevelEnabled: false }).rotateX(Math.PI / 2).translate(0, 0.14, 0);
  car.add(new THREE.Mesh(body, paint));

  const box = (w, h, d, x, y, z, material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    car.add(mesh);
  };
  box(0.46, 0.025, 0.09, 0, 0.05, 0.5, paint); // front wing
  box(0.4, 0.03, 0.09, 0, 0.26, -0.47, paint); // rear wing
  box(0.02, 0.13, 0.08, 0.15, 0.2, -0.47, dark);
  box(0.02, 0.13, 0.08, -0.15, 0.2, -0.47, dark);
  box(0.07, 0.09, 0.2, 0, 0.18, -0.08, dark); // cockpit

  const tyre = new THREE.CylinderGeometry(0.075, 0.075, 0.075, 12).rotateZ(Math.PI / 2);
  for (const [x, z, s] of [
    [0.22, 0.28, 1],
    [-0.22, 0.28, 1],
    [0.24, -0.32, 1.2],
    [-0.24, -0.32, 1.2],
  ]) {
    const wheel = new THREE.Mesh(tyre, dark);
    wheel.position.set(x, 0.075 * s, z);
    wheel.scale.setScalar(s);
    car.add(wheel);
  }

  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glow,
      color,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  halo.scale.setScalar(1.1);
  halo.position.set(0, 0.2, -0.3);
  car.add(halo);
  return car;
}

function buildTrail(scene, color) {
  const segments = 56;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array((segments + 1) * 6);
  const colors = new Float32Array((segments + 1) * 6);
  const tint = new THREE.Color(color);
  const index = [];
  for (let i = 0; i <= segments; i++) {
    const fade = Math.pow(i / segments, 2);
    for (let k = 0; k < 2; k++) {
      colors.set([tint.r * fade, tint.g * fade, tint.b * fade], i * 6 + k * 3);
    }
    if (i < segments) {
      const v = i * 2;
      index.push(v, v + 1, v + 2, v + 1, v + 3, v + 2);
    }
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(index);
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  mesh.frustumCulled = false;
  scene.add(mesh);
  return { positions, geometry, segments };
}

export function createGlobeRace({ canvas, onStop, onLand }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor('#060409');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.004, 40);

  scene.add(new THREE.HemisphereLight('#ffffff', '#3a2a66', 1.6));
  const sun = new THREE.DirectionalLight('#ffffff', 1.6);
  scene.add(sun);

  const route = buildRoute();
  const startU = route.stopAt[0];
  const finishU = route.stopAt[route.stopAt.length - 1];
  buildGlobe(scene);
  buildRouteRibbon(scene, route, finishU);
  const beacon = buildMarkers(scene, route, finishU, startU);

  const glow = glowTexture();
  const car = buildCar(CAR_COLOR, glow);
  car.matrixAutoUpdate = false;
  scene.add(car);
  const trail = buildTrail(scene, CAR_COLOR);

  const dir = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();
  const spot = new THREE.Vector3();
  const scale = new THREE.Vector3(0.036, 0.036, 0.036);
  const basis = new THREE.Matrix4();

  // Trapezoid speed profile: launch, flat out, then brake onto the finish line
  const carAt = t => {
    const s = clamp01(t / RACE);
    const accel = 0.12;
    const brake = 0.2;
    const top = 1 / (1 - accel / 2 - brake / 2);
    let done;
    if (s < accel) done = (0.5 * top * s * s) / accel;
    else if (s < 1 - brake) done = top * (s - accel / 2);
    else done = 1 - (0.5 * top * (1 - s) * (1 - s)) / brake;
    return startU + (finishU - startU) * done;
  };

  const placeCar = u => {
    sample(route, u, dir, tangent);
    side.crossVectors(dir, tangent);
    spot.copy(dir).multiplyScalar(1.0035);
    basis.makeBasis(side, dir, tangent);
    car.matrix.copy(basis).scale(scale).setPosition(spot);

    // the trail grows off the line and collapses as the car brakes to a stop
    const length = 0.075 * smooth((u - startU) / 0.03) * smooth((finishU - u) / 0.02);
    const { positions, geometry, segments } = trail;
    for (let i = 0; i <= segments; i++) {
      const k = i / segments;
      sample(route, u - length * (1 - k), dir, tangent);
      side.crossVectors(dir, tangent);
      const width = 0.0015 + 0.0055 * k;
      const centre = dir.multiplyScalar(1.0042);
      positions.set(
        [
          centre.x + side.x * width,
          centre.y + side.y * width,
          centre.z + side.z * width,
          centre.x - side.x * width,
          centre.y - side.y * width,
          centre.z - side.z * width,
        ],
        i * 6
      );
    }
    geometry.attributes.position.needsUpdate = true;
  };

  const eye = new THREE.Vector3();
  const aim = new THREE.Vector3();
  const up = new THREE.Vector3();
  const eyeB = new THREE.Vector3();
  const aimB = new THREE.Vector3();
  const upB = new THREE.Vector3();
  const wideDir = new THREE.Vector3();
  const north = new THREE.Vector3();
  const lipa = new THREE.Vector3();
  const lipaTangent = new THREE.Vector3();
  sample(route, finishU, lipa, lipaTangent);
  north.set(0, 1, 0).addScaledVector(lipa, -lipa.y).normalize();

  let portrait = 1;

  const frameCamera = (t, now, lead) => {
    // wide shot of the whole globe on the grid
    sample(route, startU, dir, tangent);
    wideDir.copy(dir).applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.5 + Math.sin(now * 0.00022) * 0.05);
    wideDir.y -= 0.18;
    wideDir.normalize();
    eye.copy(wideDir).multiplyScalar(1 + 2.3 * portrait);
    aim.set(0, 0.2, 0);
    up.set(0, 1, 0);

    // chase cam, just behind and above the leader
    const chase = smooth(t / 1.4);
    if (chase > 0) {
      sample(route, lead, dir, tangent);
      const height = CHASE_HEIGHT * portrait;
      eyeB.copy(dir).multiplyScalar(1 + height).addScaledVector(tangent, -height * 1.15);
      upB.copy(dir);
      sample(route, lead + 0.012, dir, tangent);
      aimB.copy(dir);
      eye.lerp(eyeB, chase);
      aim.lerp(aimB, chase);
      up.lerp(upB, chase).normalize();
    }

    // rise over the flag, then drop onto Lipa
    const tau = t - LAND_START;
    const land = smooth(tau / 1);
    if (land > 0) {
      const rise = smooth(tau);
      const fall = clamp01((tau - 1) / (LAND_TIME - 1));
      const height = (CHASE_HEIGHT + (0.8 - CHASE_HEIGHT) * rise) * portrait * (1 - fall * fall * fall) + 0.1;
      eyeB.copy(lipa).multiplyScalar(1 + height).addScaledVector(north, -height * 0.35);
      aimB.copy(lipa);
      upB.copy(north);
      eye.lerp(eyeB, land);
      aim.lerp(aimB, land);
      up.lerp(upB, land).normalize();
    }

    beacon.visible = tau < 0.2;
    camera.position.copy(eye);
    camera.up.copy(up);
    camera.lookAt(aim);
    sun.position.copy(eye).add(up);
  };

  const resize = () => {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    portrait = Math.max(1, 1.25 / camera.aspect);
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize);
  resize();

  let started = 0;
  let raf = 0;
  let stop = 0;
  let landed = false;

  const tick = now => {
    raf = requestAnimationFrame(tick);
    const t = started ? (now - started) / 1000 : 0;
    const lead = carAt(t);
    placeCar(lead);
    frameCamera(t, now, lead);

    if (started) {
      while (stop + 1 < route.stopAt.length && lead >= route.stopAt[stop + 1]) {
        stop += 1;
        onStop?.(STOPS[stop].name);
      }
      if (!landed && t - LAND_START >= LAND_FADE) {
        landed = true;
        onLand?.();
      }
    }
    renderer.render(scene, camera);
  };
  onStop?.(STOPS[0].name);
  raf = requestAnimationFrame(tick);

  return {
    start() {
      started = performance.now();
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      scene.traverse(item => {
        item.geometry?.dispose();
        item.material?.map?.dispose();
        item.material?.dispose();
      });
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
