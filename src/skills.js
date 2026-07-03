import * as THREE from 'three';

// --- SKILL DATA DEFINITION WITH GRAPHICS AND STYLING DETAILS ---
const skills = [
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Supercharging web applications with modern ES6+ features, asynchronous systems, and clean, modular architecture.',
    color: '#eab308', // Yellow
    glowClass: 'bg-yellow-500/30',
    btnClass: 'bg-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.25)] text-black'
  },
  {
    id: 'react',
    name: 'React',
    description: 'Building highly interactive user interfaces with reusable functional components, state hooks, and virtual DOM performance.',
    color: '#06b6d4', // Cyan
    glowClass: 'bg-cyan-500/30',
    btnClass: 'bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.25)] text-black'
  },
  {
    id: 'flutter',
    name: 'Flutter',
    description: 'Crafting beautiful, natively compiled cross-platform applications for mobile, web, and desktop from a single codebase.',
    color: '#0284c7', // Sky Blue
    glowClass: 'bg-sky-500/30',
    btnClass: 'bg-sky-500 shadow-[0_0_30px_rgba(14,165,233,0.25)] text-white'
  },
  {
    id: 'csharp',
    name: 'C# / Backend',
    description: 'Developing low-latency backend architectures, API integration, and strong object-oriented architectures.',
    color: '#a855f7', // Purple
    glowClass: 'bg-purple-500/30',
    btnClass: 'bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.25)] text-white'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Building event-driven, non-blocking APIs and high-performance server microservices using Node & Express.',
    color: '#22c55e', // Green
    glowClass: 'bg-green-500/30',
    btnClass: 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.25)] text-black'
  },
  {
    id: 'python',
    name: 'Python / AI',
    description: 'Designing neural networks, custom dataset pipelines, and Claude/GPT LLM orchestration layers.',
    color: '#3b82f6', // Blue
    glowClass: 'bg-blue-500/30',
    btnClass: 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.25)] text-white'
  },
  {
    id: 'html5css3',
    name: 'HTML5 & CSS3',
    description: 'Styling complex mockups with Tailwind, CSS Grid/Flexbox, dynamic keyframe animations, and micro-interactions.',
    color: '#f97316', // Orange
    glowClass: 'bg-orange-500/30',
    btnClass: 'bg-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.25)] text-white'
  }
];

let activeSkillIndex = 0;
let isSwapping = false;
let swapDirection = -1; // -1 = scale down, 1 = scale up
let targetRingRotationY = Math.PI / 2; // initial position facing JS
let ringRotationY = Math.PI / 2;
let isAutoRotating = true;
let autoRotateTimer = null;

// --- DYNAMIC CANVAS TEXTURE GENERATOR FOR BADGES ---
const createBadgeTexture = (skill, isHovered) => {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Glassmorphic circle container
  ctx.fillStyle = 'rgba(12, 8, 24, 0.88)';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
  ctx.fill();

  // Glow border based on brand color and hover state
  ctx.shadowColor = skill.color;
  ctx.shadowBlur = isHovered ? 16 : 8;
  ctx.strokeStyle = skill.color;
  ctx.lineWidth = isHovered ? 5 : 3.5;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
  ctx.stroke();

  // Inner accent line
  ctx.shadowBlur = 0; // Reset shadow for inner graphics
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 12, 0, Math.PI * 2);
  ctx.stroke();

  // Draw vector-like representations on 2D context
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const id = skill.id;
  if (id === 'javascript') {
    ctx.fillStyle = '#facc15';
    ctx.fillRect(size * 0.32, size * 0.32, size * 0.36, size * 0.36);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('JS', size * 0.54, size * 0.56);
  } else if (id === 'react') {
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    const drawEllipse = (rx, ry, angle) => {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };
    drawEllipse(size * 0.23, size * 0.07, 0);
    drawEllipse(size * 0.23, size * 0.07, Math.PI / 3);
    drawEllipse(size * 0.23, size * 0.07, -Math.PI / 3);
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 4.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'flutter') {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(size * 0.36, size * 0.5);
    ctx.lineTo(size * 0.5, size * 0.36);
    ctx.lineTo(size * 0.64, size * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.36, size * 0.64);
    ctx.lineTo(size * 0.5, size * 0.5);
    ctx.lineTo(size * 0.64, size * 0.64);
    ctx.stroke();
  } else if (id === 'csharp') {
    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('C#', size / 2, size / 2);
  } else if (id === 'nodejs') {
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Node', size / 2, size / 2);
  } else if (id === 'python') {
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Py', size / 2, size / 2);
  } else if (id === 'html5css3') {
    ctx.fillStyle = '#fb923c';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText('HTML', size / 2, size / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

// --- CENTER 3D MODELS GENERATORS ---
const createCenterModel = (id) => {
  const modelGroup = new THREE.Group();

  if (id === 'javascript') {
    // JavaScript Rotating Cube
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 256;
    faceCanvas.height = 256;
    const fCtx = faceCanvas.getContext('2d');
    fCtx.fillStyle = '#facc15';
    fCtx.fillRect(0, 0, 256, 256);
    fCtx.fillStyle = '#000000';
    fCtx.font = 'bold 130px sans-serif';
    fCtx.textAlign = 'right';
    fCtx.textBaseline = 'bottom';
    fCtx.fillText('JS', 230, 230);

    const texture = new THREE.CanvasTexture(faceCanvas);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 90,
      specular: 0x555555
    });
    const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const cube = new THREE.Mesh(geometry, material);
    modelGroup.add(cube);

  } else if (id === 'react') {
    // React Atom Model
    const coreGeom = new THREE.SphereGeometry(0.24, 32, 32);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x22d3ee,
      emissive: 0x0891b2,
      shininess: 100
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    modelGroup.add(core);

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });

    const ringGeom = new THREE.TorusGeometry(0.72, 0.03, 16, 100);
    
    const ring1 = new THREE.Mesh(ringGeom, ringMat);
    const ring2 = new THREE.Mesh(ringGeom, ringMat);
    const ring3 = new THREE.Mesh(ringGeom, ringMat);

    ring1.rotation.set(Math.PI / 3, Math.PI / 4, 0);
    ring2.rotation.set(-Math.PI / 3, Math.PI / 4, 0);
    ring3.rotation.set(0, Math.PI / 2, 0);

    modelGroup.add(ring1, ring2, ring3);

    // Track active rotation animation in render loop
    modelGroup.userData.animate = (time) => {
      ring1.rotation.z += 0.015;
      ring2.rotation.z -= 0.015;
      ring3.rotation.y += 0.015;
    };

  } else if (id === 'flutter') {
    // Flutter crystal double chevrons
    const extrudeSettings = {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015
    };

    const topDiamond = new THREE.Shape();
    topDiamond.moveTo(-0.15, 0.15);
    topDiamond.lineTo(0.15, 0.45);
    topDiamond.lineTo(0.45, 0.45);
    topDiamond.lineTo(0.15, 0.15);
    topDiamond.closePath();

    const midDiamond = new THREE.Shape();
    midDiamond.moveTo(-0.35, -0.05);
    midDiamond.lineTo(0.05, 0.35);
    midDiamond.lineTo(0.2, 0.35);
    midDiamond.lineTo(-0.2, -0.05);
    midDiamond.closePath();

    const botDiamond = new THREE.Shape();
    botDiamond.moveTo(-0.15, -0.15);
    botDiamond.lineTo(0.15, -0.45);
    botDiamond.lineTo(0.45, -0.45);
    botDiamond.lineTo(0.15, -0.15);
    botDiamond.closePath();

    const matLight = new THREE.MeshPhongMaterial({
      color: 0x38bdf8,
      shininess: 90,
      flatShading: true
    });
    const matMid = new THREE.MeshPhongMaterial({
      color: 0x0284c7,
      shininess: 90,
      flatShading: true
    });
    const matDark = new THREE.MeshPhongMaterial({
      color: 0x0369a1,
      shininess: 90,
      flatShading: true
    });

    const mesh1 = new THREE.Mesh(new THREE.ExtrudeGeometry(topDiamond, extrudeSettings), matLight);
    const mesh2 = new THREE.Mesh(new THREE.ExtrudeGeometry(midDiamond, extrudeSettings), matMid);
    const mesh3 = new THREE.Mesh(new THREE.ExtrudeGeometry(botDiamond, extrudeSettings), matDark);

    mesh1.position.z = -0.06;
    mesh2.position.z = -0.06;
    mesh3.position.z = -0.06;

    modelGroup.add(mesh1, mesh2, mesh3);

  } else if (id === 'csharp') {
    // Purple Hexagonal Prism for C#
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 256;
    faceCanvas.height = 256;
    const fCtx = faceCanvas.getContext('2d');
    fCtx.fillStyle = '#a855f7';
    fCtx.fillRect(0, 0, 256, 256);
    fCtx.fillStyle = '#ffffff';
    fCtx.font = 'bold 110px sans-serif';
    fCtx.textAlign = 'center';
    fCtx.textBaseline = 'middle';
    fCtx.fillText('C#', 128, 128);

    const texture = new THREE.CanvasTexture(faceCanvas);
    const capMat = new THREE.MeshPhongMaterial({ map: texture, shininess: 85 });
    const sideMat = new THREE.MeshPhongMaterial({ color: 0x86198f, shininess: 80 });

    const materials = [sideMat, capMat, capMat];
    const geom = new THREE.CylinderGeometry(0.52, 0.52, 0.28, 6);
    const prism = new THREE.Mesh(geom, materials);
    prism.rotation.x = Math.PI / 2; // lay flat
    modelGroup.add(prism);

  } else if (id === 'nodejs') {
    // Green Hexagonal Prism for Node
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 256;
    faceCanvas.height = 256;
    const fCtx = faceCanvas.getContext('2d');
    fCtx.fillStyle = '#22c55e';
    fCtx.fillRect(0, 0, 256, 256);
    fCtx.fillStyle = '#0f172a';
    fCtx.font = 'bold 90px sans-serif';
    fCtx.textAlign = 'center';
    fCtx.textBaseline = 'middle';
    fCtx.fillText('Node', 128, 128);

    const texture = new THREE.CanvasTexture(faceCanvas);
    const capMat = new THREE.MeshPhongMaterial({ map: texture, shininess: 85 });
    const sideMat = new THREE.MeshPhongMaterial({ color: 0x14532d, shininess: 80 });

    const materials = [sideMat, capMat, capMat];
    const geom = new THREE.CylinderGeometry(0.52, 0.52, 0.28, 6);
    const prism = new THREE.Mesh(geom, materials);
    prism.rotation.x = Math.PI / 2;
    modelGroup.add(prism);

  } else if (id === 'python') {
    // Interlocking Snake Rings for Python (Blue & Yellow)
    const torusGeom = new THREE.TorusGeometry(0.48, 0.1, 16, 80);
    const blueMat = new THREE.MeshPhongMaterial({
      color: 0x3b82f6,
      shininess: 90
    });
    const yellowMat = new THREE.MeshPhongMaterial({
      color: 0xfacc15,
      shininess: 90
    });

    const torusBlue = new THREE.Mesh(torusGeom, blueMat);
    const torusYellow = new THREE.Mesh(torusGeom, yellowMat);

    torusBlue.position.set(-0.16, 0.08, 0);
    torusBlue.rotation.set(Math.PI / 4, Math.PI / 6, 0);

    torusYellow.position.set(0.16, -0.08, 0);
    torusYellow.rotation.set(-Math.PI / 4, -Math.PI / 6, 0);

    modelGroup.add(torusBlue, torusYellow);

    modelGroup.userData.animate = (time) => {
      torusBlue.rotation.z += 0.01;
      torusYellow.rotation.z -= 0.01;
    };

  } else if (id === 'html5css3') {
    // 3D overlapping crystals/shields for HTML5 & CSS3
    const extrudeSettings = {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012
    };

    const shieldPath = new THREE.Shape();
    shieldPath.moveTo(0, 0.5);
    shieldPath.lineTo(0.38, 0.38);
    shieldPath.lineTo(0.3, -0.15);
    shieldPath.lineTo(0, -0.45);
    shieldPath.lineTo(-0.3, -0.15);
    shieldPath.lineTo(-0.38, 0.38);
    shieldPath.closePath();

    const matHTML = new THREE.MeshPhongMaterial({
      color: 0xf97316,
      shininess: 90,
      flatShading: true
    });
    const matCSS = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
      shininess: 90,
      flatShading: true
    });

    const htmlShield = new THREE.Mesh(new THREE.ExtrudeGeometry(shieldPath, extrudeSettings), matHTML);
    const cssShield = new THREE.Mesh(new THREE.ExtrudeGeometry(shieldPath, extrudeSettings), matCSS);

    // Position offset to overlap beautifully
    htmlShield.position.set(-0.18, 0.08, 0.05);
    cssShield.position.set(0.18, -0.08, -0.05);

    modelGroup.add(htmlShield, cssShield);
  }

  return modelGroup;
};

// --- INITIALIZE INTERACTIVE SKILLS CAROUSEL ---
export const initInteractiveSkills = () => {
  const canvas = document.getElementById('canvas-skills-interactive');
  if (!canvas) return;

  const wrapper = document.getElementById('skills-3d-wrapper');
  if (!wrapper) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0.28, 4.05);
  camera.lookAt(0, -0.1, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ambient and directional lighting for material shine
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.25);
  dirLight1.position.set(5, 8, 5);
  scene.add(dirLight1);

  // Dynamic point light that casts colored glow on the center active model
  const colorPointLight = new THREE.PointLight(0xffffff, 1.8, 8);
  colorPointLight.position.set(0, 1.0, 1.2);
  scene.add(colorPointLight);

  // --- 1. Ring of Skill Badges Group ---
  const ringGroup = new THREE.Group();
  scene.add(ringGroup);

  const badgeRadius = 2.28; // Keep badges closer so the ring reads at a glance
  const tiltX = Math.PI / 7.2; // Slightly flatter tilt to prevent badge overlaps
  const badgeMeshes = [];

  skills.forEach((skill, index) => {
    const badgeGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.035, 32);
    
    // Side material is solid dark metallic
    const sideMat = new THREE.MeshPhongMaterial({ color: 0x1f1a3a, shininess: 60 });
    
    // Canvas texture for top/bottom caps
    const capTexture = createBadgeTexture(skill, false);
    const capMat = new THREE.MeshBasicMaterial({ map: capTexture, transparent: true });
    
    const materials = [sideMat, capMat, capMat];
    const badge = new THREE.Mesh(badgeGeom, materials);
    
    // Store metadata index
    badge.userData = { index };
    
    ringGroup.add(badge);
    badgeMeshes.push(badge);
  });

  // --- 2. Active Center Model Group ---
  const centerModelGroup = new THREE.Group();
  centerModelGroup.scale.set(0.95, 0.95, 0.95);
  scene.add(centerModelGroup);

  const centerHalo = new THREE.Mesh(
    new THREE.TorusGeometry(1.15, 0.04, 18, 120),
    new THREE.MeshBasicMaterial({ color: skills[0].color, transparent: true, opacity: 0.18 })
  );
  centerHalo.rotation.x = Math.PI / 2;
  centerHalo.position.y = -0.02;
  scene.add(centerHalo);

  const coreGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 24, 24),
    new THREE.MeshBasicMaterial({ color: skills[0].color, transparent: true, opacity: 0.05 })
  );
  coreGlow.position.set(0, -0.1, -0.5);
  scene.add(coreGlow);

  // Add the initial JavaScript model
  const initialModel = createCenterModel(skills[0].id);
  centerModelGroup.add(initialModel);
  colorPointLight.color.setHex(parseInt(skills[0].color.replace('#', '0x')));

  // --- Raycasting for mouse and touch interactions ---
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredIndex = null;
  const skillChipRail = document.getElementById('skills-chip-rail');
  const skillActiveCount = document.getElementById('skills-active-count');

  const syncSkillChipStates = () => {
    if (!skillChipRail) return;

    const chips = skillChipRail.querySelectorAll('button[data-skill-index]');
    chips.forEach((chip) => {
      const chipIndex = Number(chip.dataset.skillIndex);
      const isActive = chipIndex === activeSkillIndex;

      chip.className = isActive
        ? 'skill-transition inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold tracking-widest uppercase transition-all duration-300 bg-white text-black border-white shadow-[0_0_24px_rgba(255,255,255,0.16)]'
        : 'skill-transition inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold tracking-widest uppercase transition-all duration-300 bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20';

      chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (skillActiveCount) {
      const activeLabel = String(activeSkillIndex + 1).padStart(2, '0');
      const totalLabel = String(skills.length).padStart(2, '0');
      skillActiveCount.textContent = `${activeLabel} / ${totalLabel}`;
    }
  };

  const renderSkillChips = () => {
    if (!skillChipRail) return;

    skillChipRail.innerHTML = '';

    skills.forEach((skill, index) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.dataset.skillIndex = String(index);
      chip.textContent = skill.name;
      chip.addEventListener('click', () => {
        if (index !== activeSkillIndex && !isSwapping) {
          selectSkill(index);
        }
      });
      skillChipRail.appendChild(chip);
    });

    syncSkillChipStates();
  };

  const updateMouseCoords = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  };

  const handlePointerMove = (e) => {
    updateMouseCoords(e.clientX, e.clientY);
  };

  const handlePointerDown = (e) => {
    // If double touch or pinch, ignore
    if (e.touches && e.touches.length > 1) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    updateMouseCoords(clientX, clientY);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(badgeMeshes);

    if (intersects.length > 0) {
      const clickedBadge = intersects[0].object;
      const clickedIndex = clickedBadge.userData.index;
      
      if (clickedIndex !== activeSkillIndex && !isSwapping) {
        selectSkill(clickedIndex);
      }
    }
  };

  canvas.addEventListener('mousemove', handlePointerMove);
  canvas.addEventListener('mousedown', handlePointerDown);
  
  canvas.addEventListener('touchstart', handlePointerDown, { passive: true });
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      updateMouseCoords(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // --- TRIGGER SKILL SELECT ACTIONS AND THEME TRANSITIONS ---
  const selectSkill = (index) => {
    activeSkillIndex = index;
    isAutoRotating = false;

    // Reset auto rotation inactivity timer (resumes in 10 seconds of no clicks)
    if (autoRotateTimer) clearTimeout(autoRotateTimer);
    autoRotateTimer = setTimeout(() => {
      isAutoRotating = true;
    }, 10000);

    // 1. Calculate target rotation of ring to bring selected badge to front center
    const total = skills.length;
    const theta_i = (index / total) * Math.PI * 2;
    
    // We want: theta_i + ringRotationY = Math.PI / 2
    let targetRot = Math.PI / 2 - theta_i;
    
    // Interpolate using shortest path wrapping
    const currentRot = ringRotationY;
    const diff = (targetRot - currentRot) % (Math.PI * 2);
    const shortestDiff = ((2 * diff) % (Math.PI * 2)) - diff;
    targetRingRotationY = currentRot + shortestDiff;

    // 2. Start scale down swap transition for active center model
    isSwapping = true;
    swapDirection = -1;

    // 3. Update Point Light color
    const hexColorStr = skills[index].color.replace('#', '0x');
    colorPointLight.color.setHex(parseInt(hexColorStr));
    centerHalo.material.color.set(skills[index].color);
    coreGlow.material.color.set(skills[index].color);

    // 4. Smooth transition HTML elements
    const bgGlow = document.getElementById('skills-bg-glow');
    const actBtn = document.getElementById('skills-action-btn');
    const txtOverlay = document.getElementById('skills-text-overlay');
    const nameEl = document.getElementById('active-skill-name');
    const descEl = document.getElementById('active-skill-description');

    if (txtOverlay) {
      // Fade out text overlay
      txtOverlay.classList.remove('opacity-100', 'translate-y-0');
      txtOverlay.classList.add('opacity-0', 'translate-y-2');

      setTimeout(() => {
        if (nameEl) nameEl.textContent = skills[index].name;
        if (descEl) descEl.textContent = skills[index].description;
        
        // Fade in
        txtOverlay.classList.remove('opacity-0', 'translate-y-2');
        txtOverlay.classList.add('opacity-100', 'translate-y-0');
      }, 350);
    }

    if (bgGlow) {
      // Transition bg glow color class dynamically
      bgGlow.className = `absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] md:w-[750px] md:h-[750px] rounded-full blur-[140px] opacity-20 pointer-events-none transition-all duration-1000 ease-in-out ${skills[index].glowClass}`;
    }

    if (actBtn) {
      // Transition contact button background and shadow color
      actBtn.className = `skill-transition px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 active:scale-95 transition-all duration-300 ${skills[index].btnClass}`;
    }

    syncSkillChipStates();
  };

  // --- ANIMATION LOOP ---
  let time = 0;
  
  const animate = () => {
    time += 0.01;

    // Dynamic resolution and aspect ratio auto-check (fixes stretch and squish instantly)
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    }

    // 1. Handle auto rotation or Lerp to selected target
    if (isAutoRotating) {
      targetRingRotationY += 0.0028;
    }
    ringRotationY += (targetRingRotationY - ringRotationY) * 0.085;

    // 2. Raycast for badge hover states
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(badgeMeshes);
    
    if (intersects.length > 0) {
      const idx = intersects[0].object.userData.index;
      if (hoveredIndex !== idx) {
        hoveredIndex = idx;
        canvas.style.cursor = 'pointer';
        
        // Re-generate texture with hover styling
        const capMat = intersects[0].object.material[1];
        if (capMat.map) capMat.map.dispose();
        capMat.map = createBadgeTexture(skills[idx], true);
      }
    } else {
      if (hoveredIndex !== null) {
        // Reset texture on previously hovered badge
        const prevBadge = badgeMeshes[hoveredIndex];
        const capMat = prevBadge.material[1];
        if (capMat.map) capMat.map.dispose();
        capMat.map = createBadgeTexture(skills[hoveredIndex], false);
        
        hoveredIndex = null;
        canvas.style.cursor = 'grab';
      }
    }

    // 3. Position and rotate badges along tilted ring
    badgeMeshes.forEach((badge, index) => {
      const angle = (index / skills.length) * Math.PI * 2 + ringRotationY;
      
      // Ellipse equation matching the horizontal tilt
      badge.position.x = Math.cos(angle) * badgeRadius;
      badge.position.y = Math.sin(angle) * badgeRadius * Math.sin(tiltX) - 0.65; // Pushed down to clear the center model
      badge.position.z = Math.sin(angle) * badgeRadius * Math.cos(tiltX);

      // Billboarding (badge faces camera)
      badge.quaternion.copy(camera.quaternion);

      // Hover scale expansion LERP
      const targetScale = (hoveredIndex === index) ? 1.42 : 1.0;
      badge.scale.x += (targetScale - badge.scale.x) * 0.16;
      badge.scale.y += (targetScale - badge.scale.y) * 0.16;
      badge.scale.z += (targetScale - badge.scale.z) * 0.16;
    });

    // 4. Center Model float and spin
    if (centerModelGroup) {
      centerModelGroup.position.y = Math.sin(time * 1.6) * 0.05 + 0.1;
      centerModelGroup.rotation.y += 0.009;
      centerModelGroup.rotation.x = Math.sin(time * 0.4) * 0.05;
      centerHalo.position.y = -0.02 + Math.sin(time * 1.6) * 0.035;
      centerHalo.rotation.z += 0.003;
      coreGlow.position.y = -0.1 + Math.sin(time * 1.2) * 0.025;

      // Execute model-specific animations if present (React orbitals, Python helixes)
      if (centerModelGroup.children[0] && centerModelGroup.children[0].userData.animate) {
        centerModelGroup.children[0].userData.animate(time);
      }
    }

    // 5. Handle model swap transitions (scaling down old model, scaling up new model)
    if (isSwapping) {
      if (swapDirection === -1) {
        centerModelGroup.scale.x -= 0.1;
        centerModelGroup.scale.y -= 0.1;
        centerModelGroup.scale.z -= 0.1;
        if (centerModelGroup.scale.x <= 0.02) {
          centerModelGroup.scale.set(0, 0, 0);
          
          // Clear children
          while (centerModelGroup.children.length > 0) {
            const child = centerModelGroup.children[0];
            // Dispose geometries and materials
            child.traverse((node) => {
              if (node.isMesh) {
                node.geometry.dispose();
                if (Array.isArray(node.material)) {
                  node.material.forEach((m) => m.dispose());
                } else {
                  node.material.dispose();
                }
              }
            });
            centerModelGroup.remove(child);
          }
          
          // Create and add new model
          const newModel = createCenterModel(skills[activeSkillIndex].id);
          centerModelGroup.add(newModel);
          swapDirection = 1;
        }
      } else if (swapDirection === 1) {
        centerModelGroup.scale.x += 0.1;
        centerModelGroup.scale.y += 0.1;
        centerModelGroup.scale.z += 0.1;
        if (centerModelGroup.scale.x >= 0.95) {
          centerModelGroup.scale.set(0.95, 0.95, 0.95);
          isSwapping = false;
        }
      }
    }

    // Render Scene
    renderer.render(scene, camera);
  };

  // Only render canvas when it intersects the viewport to optimize GPU load
  let isVisible = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.05 });
  
  observer.observe(canvas);

  renderSkillChips();

  const loop = () => {
    if (isVisible) {
      animate();
    }
    requestAnimationFrame(loop);
  };
  loop();

  // Resize Listener
  const resizeCallback = () => {
    if (!canvas || !wrapper) return;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  };
  
  window.addEventListener('resize', resizeCallback);
};
