import * as THREE from 'three';

export class EphemerisEngine {
    constructor() {
        // J2000 epoch: Jan 1, 2000 12:00 TT
        this.J2000 = new Date('2000-01-01T12:00:00Z').getTime();
    }

    /**
     * Calculate position for a celestial body at a given date
     * @param {Object} data Body data from bodies.js
     * @param {Date} date Current simulation date
     * @returns {THREE.Vector3} Position vector in simulation units
     */
    getPosition(data, date) {
        if (!data.orbitalElements) return new THREE.Vector3(0, 0, 0);

        const current = date.getTime();
        const daysSinceJ2000 = (current - this.J2000) / (1000 * 60 * 60 * 24);

        const els = data.orbitalElements;

        // Static object (Sun)
        if (data.orbitPeriod === 0) return new THREE.Vector3(0, 0, 0);

        // Mean Motion (n) in degrees per day
        const n = 360 / data.orbitPeriod;

        // Current Mean Anomaly
        let M = els.M + n * daysSinceJ2000;
        M = M % 360; // Normalize 0-360

        // Convert to Radians
        const radM = THREE.MathUtils.degToRad(M);
        const radE = this.solveKepler(radM, els.e);

        // Perifocal coordinates
        const P = els.a * (Math.cos(radE) - els.e);
        const Q = els.a * Math.sqrt(1 - els.e * els.e) * Math.sin(radE);

        const r = new THREE.Vector3(P, 0, Q);

        // Apply rotations (w, i, N)
        // 1. Argument of Periapsis (w) - rotation around Y (in our perifocal frame, effectively Z in 2D, but here Y is up)
        // Note: Three.js standard: Y is up. Orbital plane is usually X-Z.
        // P/Q are in orbital plane.
        r.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(els.w));

        // 2. Inclination (i) - rotation around X (nodes line)
        r.applyAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(els.i));

        // 3. Longitude of Ascending Node (N) - rotation around Y
        r.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(els.N));

        // Scale units (1 AU = 149.6 units)
        r.multiplyScalar(149.6);

        // Special scaling for moons to make them visible relative to parent
        if (data.type === 'moon') {
            r.multiplyScalar(50);
        }

        return r;
    }

    /**
     * Solve Kepler's Equation M = E - e*sin(E) for E
     * @param {number} M Mean Anomaly in radians
     * @param {number} e Eccentricity
     * @returns {number} Eccentric Anomaly (E) in radians
     */
    solveKepler(M, e) {
        let E = M;
        for (let i = 0; i < 10; i++) {
            E = M + e * Math.sin(E);
        }
        return E;
    }
}
