document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("canvas-container");
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const fusionGroup = new THREE.Group();
    scene.add(fusionGroup);

    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        roughness: 0.3,
        metalness: 0.8,
        emissive: 0xFFD700,
        emissiveIntensity: 0.2,
        flatShading: true
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    fusionGroup.add(core);

    const cageGeometry = new THREE.IcosahedronGeometry(1.8, 1);
    const cageMaterial = new THREE.MeshBasicMaterial({
        color: 0x8B0000,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const cage = new THREE.Mesh(cageGeometry, cageMaterial);
    fusionGroup.add(cage);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xFFD700, 2, 50);
    pointLight1.position.set(2, 3, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8B0000, 2, 50);
    pointLight2.position.set(-2, -3, 4);
    scene.add(pointLight2);

    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    function animate() {
        requestAnimationFrame(animate);

        core.rotation.y += 0.005;
        core.rotation.x += 0.002;
        cage.rotation.y -= 0.003;

        fusionGroup.rotation.y += 0.05 * (mouseX * 0.001 - fusionGroup.rotation.y);
        fusionGroup.rotation.x += 0.05 * (mouseY * 0.001 - fusionGroup.rotation.x);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
