import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PostFX } from './PostFX.js';

export class SceneManager {
    constructor(container) {
        this.container = container;

        // Core components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            100000 // Large far plane for solar system scale
        );
        this.renderer = new THREE.WebGLRenderer({
            canvas: container instanceof HTMLCanvasElement ? container : undefined,
            antialias: true,
            powerPreference: 'high-performance'
        });

        // Renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        if (!(container instanceof HTMLCanvasElement)) {
            this.container.appendChild(this.renderer.domElement);
        }

        // Scene setup
        this.scene.background = new THREE.Color(0x000000);
        const textureLoader = new THREE.TextureLoader();
        this.scene.background = textureLoader.load('/assets/textures/stars.jpg');

        this.initLights();
        this.initCamera();
        this.initControls();
        this.initStarfield();

        // Post Processing
        this.postFX = new PostFX(this.renderer, this.scene, this.camera);

        // Handle resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    initLights() {
        // Very low ambient light so the dark side of planets remains mostly shadowed
        // allowing the Sun's dynamic PointLight to create realistic day/night lighting.
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
        this.scene.add(ambientLight);

        // Sun light (Point light logic moved to SolarSystemModel or kept here? Kept sun light separate mostly, or attached to sun mesh?)
        // PRD says Sun is central body with emissive lighting.
        // SolarSystemModel adds a PointLight to the Sun mesh.
        // So we don't need a global light here, except maybe ambient.
        // But let's keep ambient.
    }

    initStarfield() {
        const starCount = 10000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const x = (Math.random() - 0.5) * 80000;
            const y = (Math.random() - 0.5) * 80000;
            const z = (Math.random() - 0.5) * 80000;
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, sizeAttenuation: true });
        const starField = new THREE.Points(geometry, material);
        this.scene.add(starField);
    }

    initCamera() {
        this.camera.position.set(0, 300, 500); // Start looking down at ecliptic
        this.camera.lookAt(0, 0, 0);
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2; // Allowing close zoom to planets?
        // Planets are small (radius ~3), so minDistance 5 is okay.
        this.controls.maxDistance = 60000;
        this.controls.target.set(0, 0, 0);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.postFX.onResize();
    }

    update() {
        this.controls.update(); // only required if controls.enableDamping = true, or if autoRotate = true
        // Use PostFX to render
        this.postFX.render();
    }

    // Helper to add objects
    add(object) {
        this.scene.add(object);
    }
}
