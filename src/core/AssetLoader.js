import * as THREE from 'three';

export class AssetLoader {
    constructor() {
        this.manager = THREE.DefaultLoadingManager;
        this.textureLoader = new THREE.TextureLoader(this.manager);
        this.cubeTextureLoader = new THREE.CubeTextureLoader(this.manager);
        this.textures = new Map(); // Cache
    }

    loadTexture(url) {
        if (this.textures.has(url)) {
            return this.textures.get(url);
        }

        const texture = this.textureLoader.load(url);
        this.textures.set(url, texture);
        return texture;
    }

    loadCubeTexture(path, urls) {
        return this.cubeTextureLoader.setPath(path).load(urls);
    }

    // Optional: Preload critical assets
    preload(assetList) {
        assetList.forEach(asset => {
            this.loadTexture(asset);
        });
    }
}

export const assetLoader = new AssetLoader();
