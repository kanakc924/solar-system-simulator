import * as THREE from 'three';
import { BodyRenderer } from '../rendering/BodyRenderer.js';
import { celestialBodies } from '../data/bodies.js';
import { AsteroidBelt } from '../rendering/AsteroidBelt.js';
import { OrbitRenderer } from '../rendering/OrbitRenderer.js';

import { EphemerisEngine } from './EphemerisEngine.js';

export class SolarSystemModel {
    constructor(scene) {
        this.scene = scene;
        this.bodies = {}; // Map of name -> { mesh, group, data, orbitLine }
        this.renderer = new BodyRenderer();
        this.orbitRenderer = new OrbitRenderer();
        this.ephemeris = new EphemerisEngine();
        this.asteroidBelt = null;
        this.solarSystemGroup = new THREE.Group();
        this.scene.add(this.solarSystemGroup);

        this.init();
    }

    // ... (init method remains mostly the same)

    update(date) {
        const current = date.getTime();
        const hoursTotal = current / (1000 * 60 * 60);

        Object.values(this.bodies).forEach(body => {
            const { mesh, group, data } = body;

            // 1. Scale visual mesh
            const scale = this.getScaledRadius(data.radius, data.type, data.name);
            mesh.scale.setScalar(scale);

            // 2. Rotate visual mesh (Day/Night cycle)
            if (data.rotationPeriod && data.rotationPeriod !== 0) {
                const angle = (hoursTotal / data.rotationPeriod) * Math.PI * 2;
                mesh.rotation.y = angle;

                // Cloud Rotation (slightly different speed)
                if (mesh.userData.cloudMesh) {
                    mesh.userData.cloudMesh.rotation.y = angle * 1.02 + (current / 100000);
                }
            }

            if (data.type === 'star') {
                const timeSeconds = current / 1000;
                if (mesh.material.uniforms && mesh.material.uniforms.time) {
                    mesh.material.uniforms.time.value = timeSeconds * 0.5;
                }
                return;
            }

            // 3. Calculate Position using Ephemeris Engine
            if (data.orbitalElements) {
                const position = this.ephemeris.getPosition(data, date);
                group.position.copy(position);
            }
        });

        if (this.asteroidBelt) {
            const time = date.getTime() / 1000;
            this.asteroidBelt.update(time);
        }
    }

    init() {
        // Initialize Celestial Bodies
        celestialBodies.forEach(data => {
            // Create a group for the body's orbital system (handles position)
            const systemGroup = new THREE.Group();
            systemGroup.userData = { id: data.name, type: 'system' };

            // Create the visual mesh (handles scale/rotation)
            let mesh;
            if (data.type === 'star') {
                mesh = this.renderer.createSun(data);
            } else {
                mesh = this.renderer.createPlanet(data);
            }
            mesh.userData = { ...data };

            // Create tilt group for axial tilt
            const tiltGroup = new THREE.Group();
            if (data.tilt) {
                // Tilt the axis. We assume tilt is deviation from orbital normal (Y axis).
                // Let's use Z axis for tilt to rotate the Y axis (poles).
                tiltGroup.rotation.z = THREE.MathUtils.degToRad(data.tilt);
            }
            tiltGroup.add(mesh); // Add mesh to tilt group
            systemGroup.add(tiltGroup); // Add tilt group to system group

            // Store reference
            this.bodies[data.name] = {
                mesh: mesh,
                group: systemGroup,
                tiltGroup: tiltGroup,
                data: data
            };

            // Hierarchy Logic
            if (data.parent) {
                const parentBody = this.bodies[data.parent];
                if (parentBody) {
                    parentBody.group.add(systemGroup);
                    // Add orbital line to parent group so it traces the path around parent
                    if (data.distance > 0) {
                        // Moons need 50x scale
                        const orbitLine = this.orbitRenderer.createOrbit(data.orbitalElements, 0x666666, 50);
                        if (orbitLine) {
                            parentBody.group.add(orbitLine);
                            this.bodies[data.name].orbitLine = orbitLine;
                        }
                    }
                } else {
                    console.warn(`Parent ${data.parent} not found for ${data.name}`);
                    this.solarSystemGroup.add(systemGroup);
                    if (data.distance > 0) {
                        const orbitLine = this.orbitRenderer.createOrbit(data.orbitalElements, 0x444444);
                        if (orbitLine) {
                            this.solarSystemGroup.add(orbitLine);
                            this.bodies[data.name].orbitLine = orbitLine;
                        }
                    }
                }
            } else {
                this.solarSystemGroup.add(systemGroup);
                // Orbit line for planets around Sun (Sun is at 0,0,0 of solarSystemGroup)
                if (data.distance > 0 && data.name !== 'Sun') {
                    const orbitLine = this.orbitRenderer.createOrbit(data.orbitalElements, 0x444444);
                    if (orbitLine) {
                        this.solarSystemGroup.add(orbitLine);
                        this.bodies[data.name].orbitLine = orbitLine;
                    }
                }
            }
        });

        // Initialize Asteroid Belt
        this.asteroidBelt = new AsteroidBelt(this.scene);
        this.solarSystemGroup.add(this.asteroidBelt.getMesh());
    }

    getBody(name) {
        return this.bodies[name];
    }

    toggleOrbits(visible) {
        Object.values(this.bodies).forEach(body => {
            if (body.orbitLine) {
                body.orbitLine.visible = visible;
            }
        });
    }

    getScaledRadius(radius, type, name) {
        // 1 unit = 1,000,000 km
        const realScale = radius / 1000000;
        let visualScale = realScale;

        if (type === 'star') {
            visualScale = realScale * 30; // Increased sun size slightly
        } else if (type === 'planet' || type === 'dwarf-planet') {
            visualScale = realScale * 1500; // Increased significantly for visibility at solar system scale
            if (name === 'Pluto') visualScale = realScale * 400; // Scaled down to prevent collision with Charon
        } else if (type === 'moon') {
            visualScale = realScale * 2500; // Moons need even more boost
            if (name === 'Charon') visualScale = realScale * 400; // Scaled down to prevent collision with Pluto
        }

        return Math.max(visualScale, 0.05); // slightly lowered minimum bounded size
    }
}
