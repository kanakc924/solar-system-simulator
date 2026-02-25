import { bus } from '../core/EventBus.js';
import gsap from 'gsap';
import * as THREE from 'three';

export class CameraController {
    constructor(camera, controls) {
        this.camera = camera;
        this.controls = controls;
        this.isTracking = false;
        this.targetMesh = null;

        // Listen for selection
        bus.on('BODY_SELECTED', (payload) => this.focusOnBody(payload.mesh));

        // Stop tracking on manual interaction
        this.controls.addEventListener('start', () => {
            this.isTracking = false;
            this.targetMesh = null;
        });
    }

    focusOnBody(mesh) {
        if (!mesh) return;

        this.targetMesh = mesh;
        this.isTracking = true;

        // Get world scale
        const worldScale = new THREE.Vector3();
        mesh.getWorldScale(worldScale);
        const radius = worldScale.x; // Assumes uniform scale

        const offsetDistance = radius * 4.0; // Distance to view from

        // Get world position
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);

        const startPos = this.camera.position.clone();

        // Calculate direction from current camera pos to target world pos
        const direction = new THREE.Vector3().subVectors(startPos, worldPos).normalize();
        if (direction.length() === 0) direction.set(0, 0, 1);

        const endCameraPos = worldPos.clone().add(direction.multiplyScalar(offsetDistance));

        // Animate Camera Position
        gsap.to(this.camera.position, {
            duration: 1.5,
            x: endCameraPos.x,
            y: endCameraPos.y,
            z: endCameraPos.z,
            onUpdate: () => {
                this.controls.update();
            }
        });

        // Animate Controls Target
        // We need to animate the target to the object's world position
        gsap.to(this.controls.target, {
            duration: 1.5,
            x: worldPos.x,
            y: worldPos.y,
            z: worldPos.z,
            onUpdate: () => {
                this.controls.update();
            }
        });
    }

    update() {
        // Continuous tracking if locked
        if (this.isTracking && this.targetMesh) {
            const worldPos = new THREE.Vector3();
            this.targetMesh.getWorldPosition(worldPos);
            this.controls.target.copy(worldPos);
        }
    }
}
