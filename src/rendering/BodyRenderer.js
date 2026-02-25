import * as THREE from 'three';
import { AtmosphereShader } from './shaders/AtmosphereShader.js';
import { assetLoader } from '../core/AssetLoader.js';

export class BodyRenderer {
    constructor() {
        // assetLoader is singleton
    }

    createPlanet(data) {
        // Basic Sphere geometry for planets
        const geometry = new THREE.SphereGeometry(1, 32, 32); // Radius 1, scaled later

        const texture = data.texture ? assetLoader.loadTexture(data.texture) : null;
        if (texture) {
            // Ensure textures are configured with correct colorSpace
            texture.colorSpace = THREE.SRGBColorSpace;
        }

        // MeshStandardMaterial is used for physically based rendering where light/shadow is required.
        const standardMaterial = new THREE.MeshStandardMaterial({
            color: data.color || 0xffffff,
            map: texture,
            roughness: 0.8,
            metalness: 0.1
        });

        // MeshBasicMaterial is used for unlit rendering where objects must remain fully visible 
        // and unaffected by lighting. This is useful for UI elements, billboards, and 
        // distant planets for performance optimization (LOD).
        const basicMaterial = new THREE.MeshBasicMaterial({
            color: data.color || 0xffffff,
            map: texture
        });

        // Conditionally assign default material based on type or properties
        const isUnlit = data.type === 'star' || data.unlit === true;

        const mesh = new THREE.Mesh(geometry, isUnlit ? basicMaterial : standardMaterial);

        // Store both materials to allow safe switching without recreating meshes
        mesh.userData = {
            id: data.name,
            type: data.type,
            materials: {
                lit: standardMaterial,
                unlit: basicMaterial
            },
            isUnlit: isUnlit
        };

        if (!isUnlit) {
            mesh.castShadow = false;
            mesh.receiveShadow = false; // Rely directly on N dot L illumination instead of low-res shadow maps
        }

        // Add rings if present
        if (data.ringTexture) {
            const innerRadius = data.ringRadius ? data.ringRadius[0] : 1.4;
            const outerRadius = data.ringRadius ? data.ringRadius[1] : 2.3;

            const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 64);
            const pos = ringGeo.attributes.position;
            const v3 = new THREE.Vector3();
            for (let i = 0; i < pos.count; i++) {
                v3.fromBufferAttribute(pos, i);
                // Map UVs: U = radial distance (for horizontal texture strip)
                const u = (v3.length() - innerRadius) / (outerRadius - innerRadius);
                ringGeo.attributes.uv.setXY(i, u, 0.5);
            }

            const ringTexture = assetLoader.loadTexture(data.ringTexture);
            if (ringTexture) {
                ringTexture.colorSpace = THREE.SRGBColorSpace;
            }

            const ringStandardMat = new THREE.MeshStandardMaterial({
                map: ringTexture,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8,
                color: 0xffffff,
                alphaTest: 0.4 // Help with shadow casting/receiving on transparency
            });

            const ringBasicMat = new THREE.MeshBasicMaterial({
                map: ringTexture,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8,
                color: 0xffffff,
                alphaTest: 0.4
            });

            const ringMesh = new THREE.Mesh(ringGeo, isUnlit ? ringBasicMat : ringStandardMat);
            ringMesh.rotation.x = -Math.PI / 2;

            if (!isUnlit) {
                ringMesh.castShadow = false; // Prevent blocky self-shadowing artifacts
                ringMesh.receiveShadow = true;
            }

            ringMesh.userData = {
                materials: { lit: ringStandardMat, unlit: ringBasicMat }
            };
            mesh.add(ringMesh);
            mesh.userData.ringMesh = ringMesh;
        }

        // Add atmosphere if present
        if (data.atmosphere) {
            const atmosphereMesh = this.createAtmosphere(data.atmosphere);
            mesh.add(atmosphereMesh);
        }

        // Add Cloud Layer if present (FR-45)
        if (data.clouds) {
            const cloudGeo = new THREE.SphereGeometry(1, 32, 32);

            const cloudTexture = assetLoader.loadTexture(data.clouds.texture);
            if (cloudTexture) {
                cloudTexture.colorSpace = THREE.SRGBColorSpace;
            }

            const cloudStandardMat = new THREE.MeshStandardMaterial({
                map: cloudTexture,
                transparent: true,
                opacity: data.clouds.opacity || 0.8,
                side: THREE.FrontSide,
                blending: THREE.NormalBlending
            });

            const cloudBasicMat = new THREE.MeshBasicMaterial({
                map: cloudTexture,
                transparent: true,
                opacity: data.clouds.opacity || 0.8,
                side: THREE.FrontSide,
                blending: THREE.NormalBlending
            });

            const cloudMesh = new THREE.Mesh(cloudGeo, isUnlit ? cloudBasicMat : cloudStandardMat);
            const scale = data.clouds.scale || 1.01;
            cloudMesh.scale.setScalar(scale);

            cloudMesh.userData = {
                type: 'clouds',
                rotationSpeed: 0.0005,
                materials: { lit: cloudStandardMat, unlit: cloudBasicMat }
            };

            mesh.add(cloudMesh);
            mesh.userData.cloudMesh = cloudMesh; // Store ref
        }

        return mesh;
    }

    createAtmosphere(data) {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        // Scale handled by parent mesh? No, parent mesh scale is planetary radius.
        // Atmosphere needs to be slightly larger than 1 (relative to parent).
        // scale property in data is e.g. 1.025

        const material = new THREE.ShaderMaterial({
            vertexShader: AtmosphereShader.vertexShader,
            fragmentShader: AtmosphereShader.fragmentShader,
            blending: THREE.AdditiveBlending,
            side: THREE.FrontSide, // Render front face
            transparent: true,
            uniforms: {
                color: { value: new THREE.Color(data.color) },
                coefficient: { value: 0.5 }, // Controls intensity start from center
                power: { value: 4.0 },
            }
        });

        const mesh = new THREE.Mesh(geometry, material);
        if (data.scale) {
            mesh.scale.setScalar(data.scale);
        } else {
            mesh.scale.setScalar(1.02);
        }

        return mesh;
    }

    createSun(data) {
        const geometry = new THREE.SphereGeometry(1, 32, 32);

        const texture = data.texture ? assetLoader.loadTexture(data.texture) : null;
        if (texture) {
            texture.colorSpace = THREE.SRGBColorSpace;
        }

        // MeshBasicMaterial is used for the Sun because it is an active light source 
        // that must remain fully visible and unaffected by scene lighting.
        const material = new THREE.MeshBasicMaterial({
            color: data.color || 0xffffff,
            map: texture
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = {
            id: data.name,
            type: 'star',
            materials: { lit: material, unlit: material },
            isUnlit: true
        };

        // Sun does not cast shadow on itself, but emits light
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        // Add point light
        // Increased intensity and set decay to 0 for solar system scale visibility
        // In r155+ physically correct lighting is default, so decay=0 stops it from disappearing over millions of km
        const light = new THREE.PointLight(0xffffff, 3.0, 0, 0);
        light.castShadow = false; // Disabled PointLight shadow mapping due to extreme depth precision loss at solar system scale. N dot L provides smooth day/night.
        mesh.add(light);

        return mesh;
    }

    /**
     * Safely switch a body's material between lit and unlit (LOD optimization).
     * Does not recreate the mesh, just updates the material property.
     */
    setUnlitRendering(mesh, useUnlit) {
        if (!mesh || !mesh.userData || !mesh.userData.materials) return;

        // Don't change unlit base objects like the sun
        if (mesh.userData.type === 'star') return;

        const newMat = useUnlit ? mesh.userData.materials.unlit : mesh.userData.materials.lit;
        if (mesh.material !== newMat) {
            mesh.material = newMat;
            // Optionally toggle shadows based on lighting model
            mesh.castShadow = !useUnlit;
            mesh.receiveShadow = !useUnlit;
        }

        // Update children (rings, clouds) if they have togglable materials
        if (mesh.userData.ringMesh && mesh.userData.ringMesh.userData.materials) {
            const ringNewMat = useUnlit ? mesh.userData.ringMesh.userData.materials.unlit : mesh.userData.ringMesh.userData.materials.lit;
            mesh.userData.ringMesh.material = ringNewMat;
            mesh.userData.ringMesh.castShadow = !useUnlit;
            mesh.userData.ringMesh.receiveShadow = !useUnlit;
        }

        if (mesh.userData.cloudMesh && mesh.userData.cloudMesh.userData.materials) {
            const cloudNewMat = useUnlit ? mesh.userData.cloudMesh.userData.materials.unlit : mesh.userData.cloudMesh.userData.materials.lit;
            mesh.userData.cloudMesh.material = cloudNewMat;
        }

        mesh.userData.isUnlit = useUnlit;
    }
}
