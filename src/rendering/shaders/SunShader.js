export const SunShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;

        // Simple pseudo-random noise
        float noise(vec3 p) {
            return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        }

        // Value Noise 3D
        float valueNoise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            
            return mix(
                mix(mix(noise(i + vec3(0, 0, 0)), noise(i + vec3(1, 0, 0)), f.x),
                    mix(noise(i + vec3(0, 1, 0)), noise(i + vec3(1, 1, 0)), f.x), f.y),
                mix(mix(noise(i + vec3(0, 0, 1)), noise(i + vec3(1, 0, 1)), f.x),
                    mix(noise(i + vec3(0, 1, 1)), noise(i + vec3(1, 1, 1)), f.x), f.y), f.z);
        }

        // FBM
        float fbm(vec3 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 4; i++) {
                v += a * valueNoise(p);
                p *= 2.0;
                a *= 0.5;
            }
            return v;
        }

        void main() {
            // Animate noise with time
            float n = fbm(vPosition * 4.0 + vec3(time * 0.1));
            
            // Color mapping: Dark Orange to Bright Yellow
            vec3 dark = vec3(1.0, 0.4, 0.0);
            vec3 light = vec3(1.0, 0.9, 0.4);
            
            vec3 color = mix(dark, light, n);
            
            // Add a bit of glow at edges (Fresnel)
            vec3 viewDir = normalize(cameraPosition - vPosition); // Approx for sphere at 0
            // Actually vPosition is local. We need world position for accurate view?
            // For Sun, simple glow is fine.
            
            gl_FragColor = vec4(color, 1.0);
        }
    `
};
