import * as THREE from 'three';
import { SceneManager } from './rendering/scene.js';
import { SimulationClock } from './simulation/clock.js';
import { SolarSystemModel } from './simulation/SolarSystemModel.js';
import { InteractionManager } from './input/InteractionManager.js';
import { CameraController } from './input/CameraController.js';
import { HUD } from './ui/HUD.js';
import { Timeline } from './ui/Timeline.js';
import { BodySelector } from './ui/BodySelector.js';
import { LoadingScreen } from './ui/LoadingScreen.js';
import { bus } from './core/EventBus.js';

class App {
    constructor() {
        this.container = document.getElementById('app');
        this.selectedBody = null;

        // UI Layer
        this.hud = new HUD();

        // Scene Manager (Rendering)
        this.sceneManager = new SceneManager(this.container);

        // Simulation Clock
        this.clock = new SimulationClock();

        // Solar System Model (Simulation)
        this.solarSystem = new SolarSystemModel(this.sceneManager.scene);

        // Interaction Manager
        this.interactionManager = new InteractionManager(
            this.sceneManager.camera,
            this.sceneManager.renderer,
            this.sceneManager.scene
        );
        // Set clickable objects (planets/sun group)
        this.interactionManager.setClickables([this.solarSystem.solarSystemGroup]);

        // Camera Controller
        this.cameraController = new CameraController(
            this.sceneManager.camera,
            this.sceneManager.controls
        );

        // Controls
        this.sceneManager.controls.target.set(0, 0, 0);

        // UI Components
        this.timeline = new Timeline(this.clock);
        this.bodySelector = new BodySelector();
        this.loadingScreen = new LoadingScreen();

        // Handle UI Selection
        bus.on('UI_BODY_SELECTED', (name) => {
            const body = this.solarSystem.getBody(name);
            if (body && body.mesh) {
                bus.emit('BODY_SELECTED', { data: body.data, mesh: body.mesh });
            }
        });

        // Track changes
        bus.on('BODY_SELECTED', (payload) => {
            this.selectedBody = payload;
        });

        bus.on('TOGGLE_ORBITS', (visible) => {
            if (this.solarSystem) {
                this.solarSystem.toggleOrbits(visible);
            }
        });

        bus.on('BODY_HOVER', (objects) => {
            if (this.sceneManager) {
                this.sceneManager.onBodyHover(objects);
            }
        });

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    animate(time) {
        requestAnimationFrame(this.animate);

        // Update simulation
        this.clock.tick();

        // Update solar system objects based on time
        this.solarSystem.update(this.clock.getSimDate());

        // Update camera controller (tracking)
        this.cameraController.update();

        // Update scene (camera controls, etc.)
        this.sceneManager.update();

        // Update HUD Dynamic Stats
        if (this.selectedBody && this.selectedBody.data && this.selectedBody.data.name !== 'Earth' && this.solarSystem) {
            const earth = this.solarSystem.getBody('Earth');
            if (earth && earth.mesh) {
                const p1 = new THREE.Vector3();
                const p2 = new THREE.Vector3();
                // Get world position to account for all hierarchy transformations
                this.selectedBody.mesh.getWorldPosition(p1);
                earth.mesh.getWorldPosition(p2);

                const distUnits = p1.distanceTo(p2);
                const distKm = distUnits * 1000000;

                // Velocity Calculation
                let velocity = undefined;
                const data = this.selectedBody.data;
                const bodyObj = this.solarSystem.getBody(data.name);

                if (bodyObj) {
                    const GM_SUN = 1.32712e11; // km^3/s^2
                    // Major bodies GM (approx)
                    const GMs = {
                        'Earth': 398600,
                        'Jupiter': 126686534,
                        'Saturn': 37931187,
                        'Mars': 42828,
                        'Venus': 324859,
                        'Mercury': 22032,
                        'Uranus': 5793939,
                        'Neptune': 6836529,
                        'Pluto': 871
                    };

                    let r_km = 0;
                    let a_km = 0;
                    let mu = GM_SUN;

                    if (data.type === 'planet' || data.type === 'dwarf-planet') {
                        r_km = bodyObj.group.position.length() * 1000000;
                        a_km = data.orbitalElements.a * 149.6e6;
                        mu = GM_SUN;
                    } else if (data.type === 'moon' && data.parent) {
                        r_km = bodyObj.group.position.length() * 1000000; // Relative to parent
                        a_km = data.orbitalElements.a * 149.6e6;
                        mu = GMs[data.parent] || 0;
                    }

                    if (mu > 0 && r_km > 0 && a_km > 0) {
                        // Vis-viva equation: v = sqrt(mu * (2/r - 1/a))
                        // Ensure term is positive (r < 2a for elliptical orbits bound)
                        const term = 2 / r_km - 1 / a_km;
                        if (term > 0) {
                            velocity = Math.sqrt(mu * term);
                        }
                    }
                }

                this.hud.updateDynamicStats({
                    distanceKm: distKm,
                    velocityKmS: velocity
                });
            }
        }
    }
}

// Start
new App();
