/**
 * Bellari Business College — Immersive 3D Background Engine
 * Creates particle systems, floating geometries, and mouse-reactive 3D scenes
 */

class BellariScene {
  constructor(containerId = 'canvas-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.mouse = { x: 0, y: 0 };
    this.clock = new THREE.Clock();
    this.particles = [];
    this.floatingShapes = [];

    this.init();
    this.createParticleField();
    this.createFloatingGeometries();
    this.createGlowOrb();
    this.addEventListeners();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050505, 0.035);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 30;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }); // Disabled antialias for higher FPS
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25)); // Lowered pixel ratio limit to boost FPS
    this.container.appendChild(this.renderer.domElement);

    // Ambient light
    const ambient = new THREE.AmbientLight(0x222222, 0.5);
    this.scene.add(ambient);

    // Point lights
    this.goldLight = new THREE.PointLight(0xFFD700, 2, 60);
    this.goldLight.position.set(10, 10, 10);
    this.scene.add(this.goldLight);

    this.redLight = new THREE.PointLight(0x8B0000, 1.5, 50);
    this.redLight.position.set(-10, -5, 10);
    this.scene.add(this.redLight);
  }

  createParticleField() {
    const count = 800; // Reduced from 1500 for better performance
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      // Gold/white particles
      const isGold = Math.random() > 0.7;
      colors[i * 3] = isGold ? 1.0 : 0.8;
      colors[i * 3 + 1] = isGold ? 0.84 : 0.8;
      colors[i * 3 + 2] = isGold ? 0.0 : 0.8;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  createFloatingGeometries() {
    const geometries = [
      new THREE.IcosahedronGeometry(1.5, 1),
      new THREE.OctahedronGeometry(1.2, 0),
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.TorusGeometry(1, 0.3, 8, 16),
      new THREE.TorusKnotGeometry(0.8, 0.25, 64, 8)
    ];

    const goldMat = new THREE.MeshPhongMaterial({
      color: 0xFFD700, wireframe: true, transparent: true, opacity: 0.3
    });
    const redMat = new THREE.MeshPhongMaterial({
      color: 0x8B0000, wireframe: true, transparent: true, opacity: 0.25
    });

    for (let i = 0; i < 12; i++) {
      const geo = geometries[i % geometries.length];
      const mat = i % 3 === 0 ? redMat.clone() : goldMat.clone();
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30 - 10
      );

      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      mesh.userData = {
        rotSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01 },
        floatSpeed: Math.random() * 0.5 + 0.2,
        floatOffset: Math.random() * Math.PI * 2,
        originalY: mesh.position.y
      };

      this.floatingShapes.push(mesh);
      this.scene.add(mesh);
    }
  }

  createGlowOrb() {
    const geo = new THREE.SphereGeometry(2, 32, 32);
    const mat = new THREE.MeshPhongMaterial({
      color: 0xFFD700, emissive: 0xFFD700, emissiveIntensity: 0.3,
      transparent: true, opacity: 0.08, wireframe: false
    });
    this.glowOrb = new THREE.Mesh(geo, mat);
    this.glowOrb.position.set(0, 0, -5);
    this.scene.add(this.glowOrb);

    // Wireframe ring
    const ringGeo = new THREE.TorusGeometry(3.5, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.15 });
    this.ring = new THREE.Mesh(ringGeo, ringMat);
    this.ring.position.set(0, 0, -5);
    this.scene.add(this.ring);
  }

  addEventListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const t = this.clock.getElapsedTime();

    // Rotate particle field
    if (this.particleSystem) {
      this.particleSystem.rotation.y += 0.0003;
      this.particleSystem.rotation.x += 0.0001;
    }

    // Animate floating shapes
    this.floatingShapes.forEach(shape => {
      const d = shape.userData;
      shape.rotation.x += d.rotSpeed.x;
      shape.rotation.y += d.rotSpeed.y;
      shape.position.y = d.originalY + Math.sin(t * d.floatSpeed + d.floatOffset) * 1.5;
    });

    // Glow orb pulse
    if (this.glowOrb) {
      const scale = 1 + Math.sin(t * 0.8) * 0.15;
      this.glowOrb.scale.set(scale, scale, scale);
      this.glowOrb.material.opacity = 0.05 + Math.sin(t * 0.5) * 0.03;
    }

    if (this.ring) {
      this.ring.rotation.x = Math.sin(t * 0.3) * 0.5;
      this.ring.rotation.y += 0.003;
    }

    // Mouse reactivity
    this.camera.position.x += (this.mouse.x * 3 - this.camera.position.x) * 0.02;
    this.camera.position.y += (this.mouse.y * 2 - this.camera.position.y) * 0.02;
    this.camera.lookAt(0, 0, 0);

    // Animate lights
    this.goldLight.position.x = Math.sin(t * 0.5) * 15;
    this.goldLight.position.y = Math.cos(t * 0.3) * 10;
    this.redLight.position.x = Math.cos(t * 0.4) * 12;

    this.renderer.render(this.scene, this.camera);
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D Background
  if (document.getElementById('canvas-container')) {
    window.bellariScene = new BellariScene();
  }

  // Inject and Initialize Lenis for buttery smooth scrolling (High FPS scrolling)
  const lenisScript = document.createElement('script');
  lenisScript.src = 'https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js';
  lenisScript.onload = () => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard ease-out
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  };
  document.head.appendChild(lenisScript);
});
