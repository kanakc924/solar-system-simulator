export const AtmosphereShader = {
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
            // Calculate world position
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            
            // Calculate normal in world space to interact with the world-space light (Sun at 0,0,0)
            vNormal = normalize(mat3(modelMatrix) * normal);
            
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        uniform float coefficient;
        uniform float power;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
            // Sun is always at (0,0,0). Direction to the Sun from this fragment:
            vec3 lightDirection = normalize(-vWorldPosition);
            
            // Calculate traditional diffuse lighting (Lambertian)
            float sunLight = max(dot(vNormal, lightDirection), 0.0);
            
            // Combine the atmospheric rim-glow effect with the strict sun-facing mask
            // This prevents the atmosphere from glowing on the dark side, or artificially glowing towards the camera.
            // pow(coefficient - dot(vNormal, viewDirection)) would cause extreme rim glow even against the sun.
            // Let's create a realistic atmosphere that is brightest at the terminator line (edges facing the sun).
            
            vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
            float rim = 1.0 - max(dot(viewDirection, vNormal), 0.0);
            float intensity = pow(rim * coefficient, power) * sunLight * 2.5;

            gl_FragColor = vec4(color, intensity);
        }
    `
};
