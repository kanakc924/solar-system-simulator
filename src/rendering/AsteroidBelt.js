import * as THREE from 'three';

export class AsteroidBelt {
    constructor(scene, count = 2000) {
        this.scene = scene;
        this.count = count;
        this.mesh = null;
        this.init();
    }

    init() {
        const geometry = new THREE.DodecahedronGeometry(1, 0); // Low poly styling
        const material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.9,
            metalness: 0.1
        });

        this.mesh = new THREE.InstancedMesh(geometry, material, this.count);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.mesh.userData = { type: 'asteroid-belt', name: 'Asteroid Belt' };

        const dummy = new THREE.Object3D();
        const center = new THREE.Vector3();

        for (let i = 0; i < this.count; i++) {
            // Random distance between Mars (228M km) and Jupiter (778M km)
            // Main belt approx 2.2 to 3.2 AU
            // 1 AU = 150 units. 
            // Inner: 330 units, Outer: 480 units
            const minRadius = 300;
            const maxRadius = 500;

            const radius = minRadius + Math.random() * (maxRadius - minRadius);
            const angle = Math.random() * Math.PI * 2;

            // Defines the toroid shape
            const x = Math.cos(angle) * radius;
            const y = (Math.random() - 0.5) * 20; // Vertical scatter
            const z = Math.sin(angle) * radius;

            dummy.position.set(x, y, z);

            // Random rotation
            dummy.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            // Random scale (0.5 to 3.0 units) -> 500k to 3M km diameter visual
            const scale = 0.5 + Math.random() * 2.5;
            dummy.scale.setScalar(scale);

            dummy.updateMatrix();
            this.mesh.setMatrixAt(i, dummy.matrix);
        }

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        // Add to scene or group? 
        // We will return it to add to SolarSystemGroup
    }

    getMesh() {
        return this.mesh;
    }

    update(time) {
        // Slowly rotate the entire belt?
        // Or individual asteroids? 
        // Rotating instanced mesh as a whole is cheap.
        if (this.mesh) {
            this.mesh.rotation.y = time * 0.02; // Slow rotation
        }
    }
}
