import * as THREE from 'three';

export class OrbitRenderer {
    constructor() {
        // Stateless or simple utility
    }

    createOrbit(orbitalElements, color = 0x444444, scaleFactor = 1) {
        if (!orbitalElements) return null;

        const points = [];
        const segments = 256;

        const { a, e, i, w, N } = orbitalElements;

        for (let j = 0; j <= segments; j++) {
            const M = (j / segments) * Math.PI * 2;

            // Solve Kepler's Equation for E
            let E = M;
            for (let k = 0; k < 10; k++) {
                E = M + e * Math.sin(E);
            }

            // Perifocal coordinates
            const P = a * (Math.cos(E) - e);
            const Q = a * Math.sqrt(1 - e * e) * Math.sin(E);

            // Vector in orbital plane
            const r = new THREE.Vector3(P, 0, Q);

            // Apply rotations
            r.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(w));
            r.applyAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(i));
            r.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(N));

            // Scale to game units (1 AU = 149.6 units)
            r.multiplyScalar(149.6);

            // Apply additional scale factor (e.g. for Moons)
            if (scaleFactor !== 1) {
                r.multiplyScalar(scaleFactor);
            }

            points.push(r);
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: color === 0x444444 ? 0x888888 : color, // Auto-brighten default dark grey
            transparent: true,
            opacity: 0.6
        });
        const line = new THREE.Line(geometry, material);

        return line;
    }
}
