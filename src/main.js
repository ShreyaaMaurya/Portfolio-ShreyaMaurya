import './index.css';
import * as THREE from 'three';
import { initInteractiveSkills } from './skills.js';
import { initInteractiveProjects } from './projects.js';

// --- STABLE STORYTELLER DRAWER LOGIC ---
const drawer = document.getElementById('story-drawer');
const video = document.getElementById('story-video');
const unmuteBtn = document.getElementById('unmute-btn');

if (drawer && video) {
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.volume = 1;

    // Function to handle the 10-second countdown and slide up
    const startStoryTimer = () => {
        setTimeout(() => {
            drawer.classList.remove('translate-y-0');
            drawer.classList.add('-translate-y-full');
            
            setTimeout(() => {
                video.pause();
            }, 1000); 
        }, 10000); // 10 seconds
    };

    const enableAudio = () => {
        video.muted = false;
        video.defaultMuted = false;
        video.removeAttribute('muted');
        video.volume = 1;
        if (unmuteBtn) {
            unmuteBtn.classList.add('hidden');
        }
    };

    if (unmuteBtn) {
        unmuteBtn.addEventListener('click', () => {
            enableAudio();
            video.play().catch((error) => {
                console.log('Unable to resume sound-on playback.', error);
            });
        });
    }

    const startPlayback = () => {
        video.play()
            .then(() => {
                startStoryTimer();
            })
            .catch((error) => {
                console.log('Muted autoplay failed.', error);
            });
    };

    startPlayback();
}

// --- PINTEREST-STYLE MULTI-CANVAS WEBGL CONTROLLERS ---

const resizeCallbacks = [];

// 1. GPU Optimization: Intersection Observer to only render when canvas is in viewport
const observeCanvas = (canvasElement, renderCallback) => {
    let isVisible = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
        });
    }, { threshold: 0.05 });
    
    observer.observe(canvasElement);
    
    const loop = () => {
        if (isVisible) {
            renderCallback();
        }
        requestAnimationFrame(loop);
    };
    loop();
};

// 2. Interactive Input: Attach mouse and touch hover and coordinate trackers locally
const attachHoverTracking = (canvasElement) => {
    const mouse = { x: 0, y: 0, isHovered: false };
    
    canvasElement.addEventListener('mouseenter', () => {
        mouse.isHovered = true;
    });
    
    canvasElement.addEventListener('mouseleave', () => {
        mouse.isHovered = false;
        mouse.x = 0;
        mouse.y = 0;
    });
    
    canvasElement.addEventListener('mousemove', (e) => {
        const rect = canvasElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });
    
    // Mobile Touch interaction support
    canvasElement.addEventListener('touchstart', (e) => {
        mouse.isHovered = true;
        if (e.touches.length > 0) {
            const rect = canvasElement.getBoundingClientRect();
            mouse.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
        }
    }, { passive: true });
    
    canvasElement.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const rect = canvasElement.getBoundingClientRect();
            mouse.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
        }
    }, { passive: true });
    
    canvasElement.addEventListener('touchend', () => {
        mouse.isHovered = false;
        mouse.x = 0;
        mouse.y = 0;
    });
    
    return mouse;
};

// 3. Initializer: HERO HELIX PARTICLE VISUALIZER
const initHeroHelix = () => {
    const canvas = document.getElementById('canvas-hero');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const mouse = attachHoverTracking(canvas);

    // Create Double Helix geometry
    const count = 160;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 4; // 2 full loops
        const isHelixB = i % 2 === 0;
        const angle = t + (isHelixB ? Math.PI : 0);
        const radius = 0.65;

        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = (t - Math.PI * 2) * 0.45; // Stretched vertically
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        // Custom Teal to Cyan gradient coloring
        const ratio = i / count;
        colors[i * 3] = 0.17; // R
        colors[i * 3 + 1] = 0.8 + ratio * 0.15; // G
        colors[i * 3 + 2] = 0.7 + ratio * 0.25; // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.065,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let speed = 0.005;
    const animate = () => {
        // Accelerate helix twisting on hover
        const targetSpeed = mouse.isHovered ? 0.025 : 0.005;
        speed += (targetSpeed - speed) * 0.1;

        points.rotation.y += speed;
        points.rotation.x = mouse.y * 0.3;
        points.rotation.z = mouse.x * 0.2;

        renderer.render(scene, camera);
    };

    observeCanvas(canvas, animate);
    resizeCallbacks.push(() => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
};

// 4. Initializer: TECH STACK ORBITAL VISUALIZER
const initSkillsOrbit = () => {
    const canvas = document.getElementById('canvas-skills');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const mouse = attachHoverTracking(canvas);

    // Central core node
    const nucleusGroup = new THREE.Group();
    scene.add(nucleusGroup);

    const nucleusWire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.38, 1),
        new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.6 })
    );
    nucleusGroup.add(nucleusWire);

    const nucleusCore = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.18, 1),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
    );
    nucleusGroup.add(nucleusCore);

    // 4 Orbiting nodes (Frontend, Backend, Databases, AI/Cloud)
    const orbiters = [
        { color: 0x2dd4bf, radius: 1.05, speed: 1.1, offset: 0 },         // Frontend (Teal)
        { color: 0xa855f7, radius: 1.35, speed: 0.75, offset: Math.PI },  // Backend (Purple)
        { color: 0xec4899, radius: 0.8, speed: 1.6, offset: Math.PI/2 },  // Database (Pink)
        { color: 0x06b6d4, radius: 1.6, speed: 0.55, offset: -Math.PI/2 }, // AI/Cloud (Cyan)
    ];

    const orbiterMeshes = [];

    orbiters.forEach(orb => {
        const group = new THREE.Group();
        scene.add(group);

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.11, 12, 12),
            new THREE.MeshBasicMaterial({ color: orb.color })
        );
        group.add(sphere);

        // Circular ring orbit path visual
        const ringPoints = [];
        const segments = 64;
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            ringPoints.push(new THREE.Vector3(Math.cos(theta) * orb.radius, 0, Math.sin(theta) * orb.radius));
        }
        const ringGeom = new THREE.BufferGeometry().setFromPoints(ringPoints);
        const ring = new THREE.Line(
            ringGeom,
            new THREE.LineBasicMaterial({ color: orb.color, transparent: true, opacity: 0.12 })
        );
        // Tilt ring orbit path
        ring.rotation.x = Math.PI / 2.3;
        ring.rotation.y = (Math.random() - 0.5) * 0.25;
        scene.add(ring);

        orbiterMeshes.push({ group, orb, ring });
    });

    let time = 0;
    let speedMultiplier = 1.0;

    const animate = () => {
        const targetMult = mouse.isHovered ? 2.5 : 1.0;
        speedMultiplier += (targetMult - speedMultiplier) * 0.08;

        time += 0.015 * speedMultiplier;

        nucleusWire.rotation.y += 0.012;
        nucleusWire.rotation.x += 0.006;

        // Nucleus floating motion
        nucleusGroup.position.y = Math.sin(time) * 0.06;

        // Position orbiters on tilted ring pathways
        orbiterMeshes.forEach(item => {
            const angle = time * item.orb.speed + item.orb.offset;
            const x = Math.cos(angle) * item.orb.radius;
            const z = Math.sin(angle) * item.orb.radius;

            item.group.position.x = x;
            item.group.position.z = z * Math.sin(item.ring.rotation.x);
            item.group.position.y = z * Math.cos(item.ring.rotation.x);

            item.group.rotation.y -= 0.01;
        });

        renderer.render(scene, camera);
    };

    observeCanvas(canvas, animate);
    resizeCallbacks.push(() => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
};

// 5. Initializer: AUTHX SCANNER SWEET VISUALIZER
const initAuthXScanner = () => {
    const canvas = document.getElementById('canvas-authx');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const mouse = attachHoverTracking(canvas);

    // Inner wireframe sphere representing scanned asset
    const geometry = new THREE.IcosahedronGeometry(0.65, 2);
    const material = new THREE.MeshBasicMaterial({
        color: 0x475569, // slate-600
        wireframe: true,
        transparent: true,
        opacity: 0.45
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Scanner laser line disc
    const scanGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.02, 24, 1, true);
    const scanMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee, // Cyan
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    const scanDisc = new THREE.Mesh(scanGeom, scanMat);
    scene.add(scanDisc);

    let time = 0;
    const animate = () => {
        const rotationSpeed = mouse.isHovered ? 0.025 : 0.008;
        mesh.rotation.y += rotationSpeed;
        mesh.rotation.x += rotationSpeed * 0.4;

        // Shift color and sweep speed when hovered
        scanMat.color.setHex(mouse.isHovered ? 0x10b981 : 0x22d3ee); // Green on hover, Cyan on standard
        
        time += mouse.isHovered ? 0.045 : 0.025;
        scanDisc.position.y = Math.sin(time) * 0.6;

        renderer.render(scene, camera);
    };

    observeCanvas(canvas, animate);
    resizeCallbacks.push(() => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
};

// 6. Initializer: AI CHATBOT STREAMING SOUNDWAVE
const initAIChatbotWave = () => {
    const canvas = document.getElementById('canvas-chatbot');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const mouse = attachHoverTracking(canvas);

    // Soundwave visualizer bars (3D cylinders)
    const bars = [];
    const barCount = 13;
    const spacing = 0.22;

    for (let i = 0; i < barCount; i++) {
        const geom = new THREE.BoxGeometry(0.09, 1.0, 0.09);
        const mat = new THREE.MeshBasicMaterial({
            color: 0x10b981, // Emerald
            transparent: true,
            opacity: 0.6
        });
        const bar = new THREE.Mesh(geom, mat);
        bar.position.x = (i - (barCount - 1) / 2) * spacing;
        scene.add(bar);
        bars.push(bar);
    }

    let time = 0;
    const animate = () => {
        const mult = mouse.isHovered ? 2.2 : 1.0;
        time += 0.035 * mult;

        bars.forEach((bar, index) => {
            const offset = index * 0.28;
            const wave = Math.sin(time + offset) * Math.cos(time * 0.4 + offset * 0.3);
            const scaleY = 0.15 + Math.abs(wave) * (mouse.isHovered ? 1.5 : 0.95);

            bar.scale.y = scaleY;

            // Change colors and opacity on hover
            if (mouse.isHovered) {
                bar.material.color.setHex(0x06b6d4); // Cyan
                bar.material.opacity = 0.85;
            } else {
                bar.material.color.setHex(0x10b981); // Emerald
                bar.material.opacity = 0.6;
            }
        });

        renderer.render(scene, camera);
    };

    observeCanvas(canvas, animate);
    resizeCallbacks.push(() => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
};

// 7. Initializer: EDUCATION TORUS VISUALIZER
const initCredentialsTorus = () => {
    const canvas = document.getElementById('canvas-credentials');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const mouse = attachHoverTracking(canvas);

    // Warm directional lights for glossy shading on Torus Knot
    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambient);

    const light1 = new THREE.DirectionalLight(0xf59e0b, 1.2); // Amber light
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.4);
    light2.position.set(-5, -5, -5);
    scene.add(light2);

    // Revolving Torus Knot geometry
    const geometry = new THREE.TorusKnotGeometry(0.4, 0.13, 64, 8, 2, 3);
    const material = new THREE.MeshPhongMaterial({
        color: 0xf59e0b, // Amber
        shininess: 90,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.15,
        flatShading: true
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    const animate = () => {
        const speed = mouse.isHovered ? 0.022 : 0.008;
        torusKnot.rotation.y += speed;
        torusKnot.rotation.x += speed * 0.4;

        // Dynamic scale expansion on hover
        const scale = mouse.isHovered ? 1.25 : 1.0;
        torusKnot.scale.setScalar(scale);

        // Increase emissive glow on hover
        material.emissiveIntensity = mouse.isHovered ? 0.38 : 0.15;

        // Interactive cursor tilt parallax
        torusKnot.rotation.z = mouse.x * 0.35;

        renderer.render(scene, camera);
    };

    observeCanvas(canvas, animate);
    resizeCallbacks.push(() => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
};

// 8. Global Resize Manager
window.addEventListener('resize', () => {
    resizeCallbacks.forEach(cb => cb());
});

// 9. Boot up all widget visualizers on load
initHeroHelix();
initSkillsOrbit();
initAuthXScanner();
initAIChatbotWave();
initCredentialsTorus();
initInteractiveSkills();
initInteractiveProjects();