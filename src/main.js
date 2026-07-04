import './index.css';
import * as THREE from 'three';
import { initInteractiveSkills } from './skills.js';
import { initInteractiveProjects } from './projects.js';

// --- STABLE STORYTELLER DRAWER LOGIC ---
const drawer = document.getElementById('story-drawer');
const video = document.getElementById('story-video');
const unmuteBtn = document.getElementById('unmute-btn');

if (drawer && video) {
    // Force sound attributes up front
    video.muted = false;
    video.volume = 1;

    const startStoryTimer = () => {
        setTimeout(() => {
            drawer.classList.remove('translate-y-0');
            drawer.classList.add('-translate-y-full');
            
            setTimeout(() => {
                video.pause();
            }, 1000); 
        }, 10000); // 10 seconds
    };

    const enableAudioAndPlay = () => {
        video.muted = false;
        video.volume = 1;
        if (unmuteBtn) {
            unmuteBtn.classList.add('hidden');
        }
        video.play().then(() => {
            startStoryTimer();
        }).catch((err) => {
            console.error('Playback failed even after click:', err);
        });
    };

    // Make the button directly kick off the video with sound if blocked
    if (unmuteBtn) {
        unmuteBtn.addEventListener('click', () => {
            enableAudioAndPlay();
        });
    }

    const startPlayback = () => {
        video.muted = false;
        
        // Attempt unmuted play
        video.play()
            .then(() => {
                // SUCCESS: User had active interaction state already, hide button
                if (unmuteBtn) unmuteBtn.classList.add('hidden');
                startStoryTimer();
            })
            .catch((error) => {
                // BLOCKED: Browser stopped the video because it had sound.
                console.log('Unmuted autoplay blocked. Waiting for click button interaction.');
                
                // Show the button clearly so users can click to start the video with sound
                if (unmuteBtn) {
                    unmuteBtn.classList.remove('hidden');
                    unmuteBtn.innerText = "Play with Sound"; // Update text dynamically to make sense
                }
            });
    };

    startPlayback();
}

// --- PINTEREST-STYLE MULTI-CANVAS WEBGL CONTROLLERS ---

const resizeCallbacks = [];

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

const attachHoverTracking = (canvasElement) => {
    const mouse = { x: 0, y: 0, isHovered: false };
    
    canvasElement.addEventListener('mouseenter', () => { mouse.isHovered = true; });
    canvasElement.addEventListener('mouseleave', () => {
        mouse.isHovered = false;
        mouse.x = 0; mouse.y = 0;
    });
    
    canvasElement.addEventListener('mousemove', (e) => {
        const rect = canvasElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
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

    const count = 160;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 4;
        const isHelixB = i % 2 === 0;
        const angle = t + (isHelixB ? Math.PI : 0);
        const radius = 0.65;

        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = (t - Math.PI * 2) * 0.45;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        const ratio = i / count;
        colors[i * 3] = 0.17;
        colors[i * 3 + 1] = 0.8 + ratio * 0.15;
        colors[i * 3 + 2] = 0.7 + ratio * 0.25;
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
        const targetSpeed = mouse.isHovered ? 0.025 : 0.005;
        speed += (targetSpeed - speed) * 0.1;
        points.rotation.y += speed;
        renderer.render(scene, camera);
    };

    observeCanvas(canvas, animate);
    resizeCallbacks.push(() => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
};

const initSkillsOrbit = () => {
    const canvas = document.getElementById('canvas-skills');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const mouse = attachHoverTracking(canvas);
    const nucleusGroup = new THREE.Group();
    scene.add(nucleusGroup);

    const nucleusWire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.38, 1),
        new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.6 })
    );
    nucleusGroup.add(nucleusWire);

    let time = 0;
    const animate = () => {
        time += 0.015;
        nucleusWire.rotation.y += 0.012;
        renderer.render(scene, camera);
    };

    observeCanvas(canvas, animate);
    resizeCallbacks.push(() => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
};

const initAuthXScanner = () => {
    const canvas = document.getElementById('canvas-authx');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const mouse = attachHoverTracking(canvas);
    const geometry = new THREE.IcosahedronGeometry(0.65, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x475569, wireframe: true, transparent: true, opacity: 0.45 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
        mesh.rotation.y += 0.008;
        renderer.render(scene, camera);
    };

    observeCanvas(canvas, animate);
    resizeCallbacks.push(() => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
};

const initAIChatbotWave = () => {
    const canvas = document.getElementById('canvas-chatbot');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const animate = () => {
        renderer.render(scene, camera);
    };

    observeCanvas(canvas, animate);
    resizeCallbacks.push(() => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
};

const initCredentialsTorus = () => {
    const canvas = document.getElementById('canvas-credentials');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambient);

    const geometry = new THREE.TorusKnotGeometry(0.4, 0.13, 64, 8, 2, 3);
    const material = new THREE.MeshPhongMaterial({ color: 0xf59e0b, flatShading: true });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    const animate = () => {
        torusKnot.rotation.y += 0.008;
        renderer.render(scene, camera);
    };

    observeCanvas(canvas, animate);
    resizeCallbacks.push(() => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
};

window.addEventListener('resize', () => {
    resizeCallbacks.forEach(cb => cb());
});

initHeroHelix();
initSkillsOrbit();
initAuthXScanner();
initAIChatbotWave();
initCredentialsTorus();
initInteractiveSkills();
initInteractiveProjects();