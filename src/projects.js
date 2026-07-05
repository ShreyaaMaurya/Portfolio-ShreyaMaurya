import * as THREE from 'three';

// --- FEATURED PROJECTS DATABASE ---
const projects = [
 {
    id: 'llm',
    title: 'E bill generator ',
    description: 'Built a full-stack React.js application that generates invoices and bills using Claude API for natural language processing, enabling users to create professional documents with AI-assisted content generation and formatting.',
    tags: ['React.js', 'Claude API'],
    techStack: 'React.js / Express.js / Claude API',
    year: 'Mar 2026',
    image: '/ebill.png',
    color: '#10b981',
    glowClass: 'bg-emerald-500/30',
    btnClass: 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.25)] text-black',
    link: 'https://ebillgenerator.com/'
  },

  {
    id: 'ledger',
    title: 'EternalFlame - E-Commerce Platform',
    description: 'Developed a full-stack e-commerce platform with product catalog, shopping cart, and order management; implemented CRUD APIs with a responsive Tailwind UI.',
    tags: ['Node.js', 'Tailwind CSS'],
    techStack: 'Node.js / Express.js / MongoDB / Tailwind CSS',
    year: 'Nov 2025',
    image: '/EternalFlames.png',
    color: '#8b5cf6', // Purple
    glowClass: 'bg-purple-500/30',
    btnClass: 'bg-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.25)] text-white',
    link: 'https://eternal-flames-ten.vercel.app/'
  },

  {
    id: 'authx',
    title: 'AuthX - AI Image Scanner',
    description: 'Engineered a full-stack AI security platform that detects AI-generated images from Stable Diffusion, Midjourney, and DALL-E by identifying synthetic fingerprints with a custom CNN and low-latency inference.',
    tags: ['React.js', 'Node.js'],
    techStack: 'React.js / Node.js / Express.js / MongoDB',
    year: 'Apr 2026',
    image: '/AuthX.png',
    color: '#0d9488', 
    glowClass: 'bg-teal-500/30',
    btnClass: 'bg-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.25)] text-black',
    link: 'https://github.com/ShreyaaMaurya'
  },
 
  {
    id: 'eternal',
    title: 'NiftelInfra - Property Management Portal',
    description: 'Designed secure RESTful APIs for real-estate data with image and document storage via Multer and Google Maps integration for real-time asset tracking.',
    tags: ['Node.js', 'Express.js'],
    techStack: 'Node.js / Express.js / MongoDB / Google Maps API',
    year: 'Apr 2025',
    image: '/NiftelInfra.png',
    color: '#f97316', // Orange
    glowClass: 'bg-orange-500/30',
    btnClass: 'bg-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.25)] text-white',
    link: 'https://niftelinfra.com/'
  }
];

// --- VECTOR CARDS CANVAS TEXTURE GENERATOR ---
const drawCardIllustration = (ctx, id, w, h, color) => {
  // Background gradient inside the illustration area
  const gradient = ctx.createLinearGradient(w * 0.1, h * 0.3, w * 0.9, h * 0.7);
  gradient.addColorStop(0, '#0c0a1a');
  gradient.addColorStop(1, '#05030d');
  ctx.fillStyle = gradient;
  ctx.fillRect(w * 0.1, h * 0.44, w * 0.8, h * 0.48);
  
  // Draw bounding box for the tech art
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  ctx.strokeRect(w * 0.1, h * 0.44, w * 0.8, h * 0.48);
  
  // Core Graphics
  const cx = w / 2;
  const cy = h * 0.6;
  
  ctx.save();
  if (id === 'authx') {
    // Radar Screen / Scanner
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, 75, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.4)';
    ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 25, 0, Math.PI * 2); ctx.stroke();
    
    // Grid crosslines
    ctx.beginPath(); ctx.moveTo(cx - 85, cy); ctx.lineTo(cx + 85, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - 85); ctx.lineTo(cx, cy + 85); ctx.stroke();
    
    // Scanning sweeping line
    const sweepAngle = (Date.now() / 700) % (Math.PI * 2);
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweepAngle) * 75, cy + Math.sin(sweepAngle) * 75);
    ctx.stroke();
    
    // Scanning glow wedge
    ctx.fillStyle = 'rgba(20, 184, 166, 0.08)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 75, sweepAngle - 0.4, sweepAngle);
    ctx.closePath();
    ctx.fill();

    // Targets
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(cx - 35, cy + 30, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 40, cy - 25, 3.5, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'llm') {
    // AI Soundwave sinusoidal layers
    const time = Date.now() / 400;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = i === 0 ? 'rgba(16, 185, 129, 0.9)' : i === 1 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(52, 211, 153, 0.35)';
      ctx.beginPath();
      for (let x = w * 0.15; x <= w * 0.85; x++) {
        const angle = (x / (w * 0.7)) * Math.PI * 3 + time + i * Math.PI / 3;
        const amplitude = 32 - i * 8;
        const y = cy + Math.sin(angle) * Math.cos(angle * 0.3) * amplitude;
        if (x === w * 0.15) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  } else if (id === 'eternal') {
    // Fire Emblem / Line charts
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.12)';
    ctx.lineWidth = 1;
    // Chart grid vertical lines
    for (let x = w * 0.18; x < w * 0.82; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, cy - 70); ctx.lineTo(x, cy + 70); ctx.stroke();
    }
    // Chart grid horizontal lines
    for (let y = cy - 60; y < cy + 70; y += 25) {
      ctx.beginPath(); ctx.moveTo(w * 0.15, y); ctx.lineTo(w * 0.85, y); ctx.stroke();
    }
    
    // Floating orange Flame geometries in center
    ctx.fillStyle = 'rgba(249, 115, 22, 0.15)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 50);
    ctx.quadraticCurveTo(cx - 35, cy + 5, cx - 10, cy - 35);
    ctx.quadraticCurveTo(cx - 28, cy - 10, cx - 4, cy - 55);
    ctx.quadraticCurveTo(cx + 28, cy - 10, cx + 4, cy + 5);
    ctx.quadraticCurveTo(cx + 35, cy + 15, cx, cy + 50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (id === 'ledger') {
    // Digital Cryptographic lock
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    // Hexagonal block rings
    const drawHex = (ox, oy, r) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = ox + Math.cos(angle) * r;
        const y = oy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    };
    drawHex(cx, cy, 65);
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
    drawHex(cx, cy, 45);
    
    // Padlock body in the center
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.fillRect(cx - 18, cy - 10, 36, 32);
    ctx.strokeRect(cx - 18, cy - 10, 36, 32);
    
    // Padlock shackle
    ctx.beginPath();
    ctx.arc(cx, cy - 10, 12, Math.PI, 0);
    ctx.lineTo(cx + 12, cy - 10);
    ctx.stroke();
    
    // Keyhole
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy + 2, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - 1.8, cy + 2, 3.6, 9);
  }
  ctx.restore();
};

const drawCardImage = (ctx, project, w, h, texture) => {
  const image = new Image();
  image.src = project.image;

  const drawImageFrame = () => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();
    const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    const offsetX = (w - drawWidth) / 2;
    const offsetY = (h - drawHeight) / 2;
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, w, h);

    if (texture) {
      texture.needsUpdate = true;
    }
  };

  if (image.complete && image.naturalWidth > 0) {
    drawImageFrame();
    return;
  }

  image.onload = drawImageFrame;
  image.onerror = () => {
    drawCardIllustration(ctx, project.id, w, h, project.color);
    if (texture) {
      texture.needsUpdate = true;
    }
  };
};

const wrapText = (ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  lines.slice(0, maxLines).forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });

  return Math.min(lines.length, maxLines);
};

const createCardTexture = (project, isHovered) => {
  const w = 920; // Wider canvas for a rectangular, poster-style card
  const h = 620;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Glassmorphic dark card base
  ctx.fillStyle = 'rgba(10, 8, 22, 0.94)';
  ctx.fillRect(0, 0, w, h);

  // Outer border with neon highlight
  ctx.strokeStyle = project.color;
  ctx.lineWidth = isHovered ? 8 : 4;
  ctx.strokeRect(0, 0, w, h);

  if (project.image) {
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    drawCardImage(ctx, project, w, h, texture);
    return texture;
  }

  // Subtle inner card margin border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  // Card Header: Section index
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('CORE ECOSYSTEM // SYSTEM_0' + (projects.indexOf(project) + 1), 40, 60);

  // Card Title with auto-scaling font size to prevent overflow clipping
  ctx.fillStyle = '#ffffff';
  let fontSize = 34;
  ctx.font = `bold ${fontSize}px sans-serif`;
  const maxTextWidth = w - 80;
  while (ctx.measureText(project.title.toUpperCase()).width > maxTextWidth && fontSize > 20) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px sans-serif`;
  }
  ctx.fillText(project.title.toUpperCase(), 40, 115);

  // Description and metadata row
  ctx.font = '500 18px sans-serif';
  ctx.fillStyle = 'rgba(226, 232, 240, 0.88)';
  wrapText(ctx, project.description, 40, 164, 500, 26, 3);

  ctx.font = 'bold 11px monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillText('TECH STACK', 40, 238);
  ctx.fillText('YEAR', 540, 238);

  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = project.color;
  ctx.fillText(project.techStack.toUpperCase(), 40, 266);
  ctx.fillText(project.year, 540, 266);

  // Decorative header line divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 292);
  ctx.lineTo(w - 40, 292);
  ctx.stroke();

  // Draw the custom tech artwork illustration
  drawCardIllustration(ctx, project.id, w, h, project.color);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

// --- INITIALIZE STICKY SCROLL PROJECTS SLIDER ---
export const initInteractiveProjects = () => {
  const canvas = document.getElementById('canvas-projects-3d');
  if (!canvas) return;

  const section = document.getElementById('work');
  if (!section) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 6.7);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
  dirLight.position.set(6, 10, 8);
  scene.add(dirLight);

  // Core Group for Cards
  const cardsGroup = new THREE.Group();
  scene.add(cardsGroup);

  // Create Project Card Meshes (Wider rectangular proportions and larger size)
  const cardWidth = 4.25;
  const cardHeight = 2.85;
  const cardSpacing = 5.05;
  const cardMeshes = [];
  const texturesMap = new Map(); // cache textures to avoid recreation

  projects.forEach((proj, index) => {
    // Front face geometry
    const geom = new THREE.PlaneGeometry(cardWidth, cardHeight);
    
    const standardTex = createCardTexture(proj, false);
    const hoverTex = createCardTexture(proj, true);
    texturesMap.set(proj.id, { standard: standardTex, hover: hoverTex });

    const material = new THREE.MeshPhongMaterial({
      map: standardTex,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      shininess: 90,
      specular: 0x666666
    });

    const card = new THREE.Mesh(geom, material);
    card.userData = { index, id: proj.id };
    
    cardsGroup.add(card);
    cardMeshes.push(card);
  });

  // Track coordinates for interactions
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredIndex = null;
  let activeIndex = 0;
  let currentScrollProgress = 0;
  let targetScrollProgress = 0;

  // Track mouse coordinates relative to canvas
  const updateMouseCoords = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  };

  canvas.addEventListener('mousemove', (e) => {
    updateMouseCoords(e.clientX, e.clientY);
  });

  canvas.addEventListener('mousedown', (e) => {
    updateMouseCoords(e.clientX, e.clientY);
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cardMeshes);
    if (intersects.length > 0) {
      const idx = intersects[0].object.userData.index;
      window.open(projects[idx].link, '_blank');
    }
  });

  // Support mobile touch clicks
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      updateMouseCoords(e.touches[0].clientX, e.touches[0].clientY);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cardMeshes);
      if (intersects.length > 0) {
        const idx = intersects[0].object.userData.index;
        window.open(projects[idx].link, '_blank');
      }
    }
  }, { passive: true });

  // --- TRIGGER TEXT OVERLAYS AND BACKGROUND GLOW SWAP ---
  const updateActiveProjectPanel = (index) => {
    activeIndex = index;

    const bgGlow = document.getElementById('projects-bg-glow');
    const infoPanel = document.getElementById('project-info-panel');
    const tag1 = document.getElementById('project-tag-1');
    const tag2 = document.getElementById('project-tag-2');
    const titleEl = document.getElementById('project-title');
    const descEl = document.getElementById('project-description');
    const linkBtn = document.getElementById('project-link-btn');

    if (infoPanel) {
      // Fade out
      infoPanel.classList.remove('opacity-100', 'translate-y-0');
      infoPanel.classList.add('opacity-0', 'translate-y-2');

      setTimeout(() => {
        if (titleEl) titleEl.textContent = projects[index].title;
        if (descEl) descEl.textContent = projects[index].description;
        if (tag1) tag1.textContent = projects[index].techStack;
        if (tag2) tag2.textContent = projects[index].year;
        
        // Fade in
        infoPanel.classList.remove('opacity-0', 'translate-y-2');
        infoPanel.classList.add('opacity-100', 'translate-y-0');
      }, 350);
    }

    if (bgGlow) {
      bgGlow.className = `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full blur-[160px] opacity-15 pointer-events-none transition-all duration-1000 ease-in-out ${projects[index].glowClass}`;
    }

    if (linkBtn) {
      linkBtn.href = projects[index].link;
      linkBtn.className = `skill-transition inline-flex items-center justify-center gap-2 w-fit shrink-0 whitespace-nowrap overflow-hidden px-6 py-3 rounded-full text-[11px] font-bold tracking-widest uppercase hover:scale-105 active:scale-95 transition-all duration-300 ${projects[index].btnClass}`;
    }
  };

  updateActiveProjectPanel(0);

  // --- ANIMATION FRAME ---
  const animate = () => {
    // 1. Calculate scroll progress of section
    const rect = section.getBoundingClientRect();
    const sectionTop = window.pageYOffset + rect.top;
    const sectionHeight = rect.height;
    const scrollRange = sectionHeight - window.innerHeight;
    
    if (scrollRange > 0) {
      let rawProgress = (window.pageYOffset - sectionTop) / scrollRange;
      targetScrollProgress = Math.max(0, Math.min(1, rawProgress));
    }

    // Smoothly interpolate scroll progress for lag-free motion
    currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.095;

    // Update progress bar
    const scrollBar = document.getElementById('project-scroll-bar');
    if (scrollBar) {
      scrollBar.style.width = `${currentScrollProgress * 100}%`;
    }

    // 2. Auto-detect resizing to prevent squishing
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    }

    // 3. Determine active project index closest to center focus
    const newActiveIndex = Math.max(0, Math.min(projects.length - 1, Math.round(currentScrollProgress * (projects.length - 1))));
    if (newActiveIndex !== activeIndex) {
      updateActiveProjectPanel(newActiveIndex);
    }

    // 4. Raycast for card hover states
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cardMeshes);
    let intersectedIndex = null;

    if (intersects.length > 0) {
      const card = intersects[0].object;
      intersectedIndex = card.userData.index;

      if (hoveredIndex !== intersectedIndex) {
        // Reset old hover
        if (hoveredIndex !== null) {
          const oldCard = cardMeshes[hoveredIndex];
          const oldProj = projects[hoveredIndex];
          oldCard.material.map = texturesMap.get(oldProj.id).standard;
        }
        hoveredIndex = intersectedIndex;
        canvas.style.cursor = 'pointer';

        // Set new hover map texture
        const newProj = projects[intersectedIndex];
        card.material.map = texturesMap.get(newProj.id).hover;
      }

      // Parallax Tilt Action: Calculate pointer relative coordinates on card
      const uv = intersects[0].uv;
      const rx = (uv.y - 0.5) * 0.45; // rotation around X
      const ry = -(uv.x - 0.5) * 0.55; // rotation around Y
      
      card.userData.tiltX = rx;
      card.userData.tiltY = ry;
      card.userData.targetScale = 1.08;
    } else {
      if (hoveredIndex !== null) {
        const oldCard = cardMeshes[hoveredIndex];
        const oldProj = projects[hoveredIndex];
        oldCard.material.map = texturesMap.get(oldProj.id).standard;
        hoveredIndex = null;
        canvas.style.cursor = 'grab';
      }
    }

    // 5. Position, Curve, and Rotate all project card meshes
    cardMeshes.forEach((card, index) => {
      // Offset index relative to scroll progress
      const offsetProgress = index - currentScrollProgress * (projects.length - 1);
      
      // Target positions (curving cards horizontally)
      const tx = offsetProgress * cardSpacing;
      const tz = -Math.abs(offsetProgress) * 0.95; // Card retreats back at sides
      const ty = -Math.abs(offsetProgress) * 0.18; // Card sinks down at sides
      
      card.position.x = tx;
      card.position.y = ty;
      card.position.z = tz;

      // Base rotation looking slightly towards screen center (carousel look)
      const baseRotY = -offsetProgress * 0.35;
      
      // Smooth scale and tilt LERPing
      const scaleTarget = (hoveredIndex === index) ? (card.userData.targetScale || 1.0) : 1.0;
      card.scale.x += (scaleTarget - card.scale.x) * 0.15;
      card.scale.y += (scaleTarget - card.scale.y) * 0.15;
      card.scale.z += (scaleTarget - card.scale.z) * 0.15;

      const targetRx = (hoveredIndex === index) ? (card.userData.tiltX || 0) : 0;
      const targetRy = (hoveredIndex === index) ? (baseRotY + (card.userData.tiltY || 0)) : baseRotY;

      card.rotation.x += (targetRx - card.rotation.x) * 0.15;
      card.rotation.y += (targetRy - card.rotation.y) * 0.15;

      // Fade card opacity out as they slide far off-screen
      const distance = Math.abs(offsetProgress);
      const targetOpacity = Math.max(0, Math.min(1, 1.8 - distance * 1.25));
      card.material.opacity += (targetOpacity - card.material.opacity) * 0.15;
    });

    // Render Scene
    renderer.render(scene, camera);
  };

  // Only render when the container intersects viewport
  let isVisible = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      }
    });
  }, { threshold: 0.02 });

  observer.observe(canvas);

  const loop = () => {
    if (isVisible) {
      animate();
    }
    requestAnimationFrame(loop);
  };
  loop();

  // Resize Fallback
  window.addEventListener('resize', () => {
    if (!canvas) return;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  });
};
