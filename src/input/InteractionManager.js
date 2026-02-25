import * as THREE from 'three';
import { bus } from '../core/EventBus.js';

export class InteractionManager {
    constructor(camera, renderer, scene) {
        this.camera = camera;
        this.renderer = renderer;
        this.scene = scene;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.clickables = []; // Objects that can be clicked

        this.bindEvents();
    }

    bindEvents() {
        const canvas = this.renderer.domElement;
        canvas.addEventListener('click', (e) => this.onClick(e));
        canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    setClickables(objects) {
        this.clickables = objects;
    }

    updateMouse(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    getIntersects() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        // Recursively check children of clickables if they are groups
        // But our SolarSystemModel adds Meshes to a Group.
        // If we pass the Group, we need recursive=true.
        return this.raycaster.intersectObjects(this.clickables, true);
    }

    findTarget(object) {
        let target = object;
        while (target && !target.userData.name && target.parent) {
            target = target.parent;
        }
        return (target && target.userData.name) ? target : null;
    }

    onClick(event) {
        this.updateMouse(event);
        const intersects = this.getIntersects();

        if (intersects.length > 0) {
            const target = this.findTarget(intersects[0].object);
            if (target) {
                console.log('Selected:', target.userData.name);
                bus.emit('BODY_SELECTED', { data: target.userData, mesh: target });
            }
        }
    }

    onMouseMove(event) {
        this.updateMouse(event);
        const intersects = this.getIntersects();

        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';

            // Highlight logic
            const target = this.findTarget(intersects[0].object);
            if (target) {
                bus.emit('BODY_HOVER', [target]);
            } else {
                bus.emit('BODY_HOVER', []);
            }
        } else {
            document.body.style.cursor = 'default';
            bus.emit('BODY_HOVER', []);
        }
    }
}
