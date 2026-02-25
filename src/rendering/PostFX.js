import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

export class PostFX {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        this.composer = new EffectComposer(renderer);
        this.initPasses();

        // Handle resize
        window.addEventListener('resize', this.onResize.bind(this));
    }

    initPasses() {
        // 1. Render Pass
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // 2. Outline Pass (Hover/Selection)
        this.outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.scene,
            this.camera
        );
        this.outlinePass.edgeStrength = 3.0;
        this.outlinePass.edgeGlow = 0.5;
        this.outlinePass.edgeThickness = 1.0;
        this.outlinePass.pulsePeriod = 0;
        this.outlinePass.visibleEdgeColor.set('#ffffff');
        this.outlinePass.hiddenEdgeColor.set('#190a05');
        this.composer.addPass(this.outlinePass);

        // 3. Bloom Pass (Glow on Sun)
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,  // strength
            0.4,  // radius
            0.85  // threshold
        );
        bloomPass.strength = 1.2;
        bloomPass.radius = 0.5;
        bloomPass.threshold = 0.7; // Only very bright things (Sun) glow

        this.composer.addPass(bloomPass);
    }

    updateOutline(selectedObjects) {
        if (this.outlinePass) {
            this.outlinePass.selectedObjects = selectedObjects;
        }
    }

    onResize() {
        this.composer.setSize(window.innerWidth, window.innerHeight);
        if (this.outlinePass) {
            this.outlinePass.setSize(window.innerWidth, window.innerHeight);
        }
    }

    render() {
        this.composer.render();
    }
}
