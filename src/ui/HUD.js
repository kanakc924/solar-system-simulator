import { bus } from '../core/EventBus.js';

/**
 * HUD Class
 * Manages the Heads-Up Display and information panels.
 * Implements a modern, futuristic NASA-style UI with glassmorphism.
 */
export class HUD {
    constructor() {
        this.container = document.getElementById('ui-layer');
        this.selectedBody = null;
        this.injectStyles();
        this.initElements();
        this.bindEvents();
    }

    /**
     * Injects CSS for the HUD components.
     * Uses glassmorphism and modern sci-fi aesthetics.
     */
    injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            :root {
                --hud-accent: #64c8ff;
                --hud-bg: rgba(10, 15, 25, 0.95); /* High opacity, no blur */
                --hud-border: rgba(100, 200, 255, 0.5);
                --hud-glow: rgba(100, 200, 255, 0.1); 
            }

            .hud-panel {
                position: absolute;
                right: -450px;
                top: 20px;
                width: 380px;
                max-height: calc(100vh - 40px);
                background: var(--hud-bg);
                /* Removed backdrop-filter to guarantee crisp rendering across all browsers */
                border: 1px solid var(--hud-border);
                border-radius: 12px;
                color: #e0e6ed;
                padding: 0;
                display: flex;
                flex-direction: column;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.9); /* Tightened shadow */
                transition: right 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                overflow: hidden;
                pointer-events: auto;
                z-index: 1000;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                -webkit-font-smoothing: antialiased; 
                -moz-osx-font-smoothing: grayscale;
            }

            .hud-panel.active {
                right: 20px;
            }

            .hud-header {
                padding: 20px;
                border-bottom: 1px solid var(--hud-border);
                position: relative;
                background: rgba(255, 255, 255, 0.02);
            }

            .hud-title {
                margin: 0;
                font-size: 24px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: #fff;
                text-shadow: 0 0 4px var(--hud-accent); /* Reduced text-shadow to prevent blurry text */
                font-family: 'Bahnschrift', 'Segoe UI', 'Arial Black', sans-serif;
                font-weight: 700;
            }

            .hud-type {
                font-size: 10px;
                color: var(--hud-accent);
                letter-spacing: 3px;
                text-transform: uppercase;
                margin-top: 4px;
                opacity: 0.9;
            }

            .hud-close-btn {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 1px solid var(--hud-border);
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                font-size: 18px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .hud-close-btn:hover {
                background: var(--hud-accent);
                box-shadow: 0 0 10px var(--hud-accent);
                transform: rotate(90deg);
            }

            .hud-content {
                padding: 20px;
                overflow-y: scroll; /* Force scrollbar to prevent layout thrashing/shaking */
                scrollbar-width: thin;
                scrollbar-color: var(--hud-accent) transparent;
            }

            .hud-content::-webkit-scrollbar {
                width: 4px;
            }

            .hud-content::-webkit-scrollbar-thumb {
                background: var(--hud-accent);
                border-radius: 10px;
            }

            .hud-preview {
                width: 100%;
                height: 200px;
                border-radius: 8px;
                margin-bottom: 20px;
                object-fit: cover;
                border: 1px solid var(--hud-border);
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Removed inset glow which visually blurs the image edges */
                image-rendering: -webkit-optimize-contrast; /* Enhance image crispness */
                image-rendering: crisp-edges;
            }

            .hud-stats-grid {
                display: grid;
                grid-template-columns: 140px 1fr; /* Fixed label column width to absolutely prevent horizontal shaking */
                gap: 12px;
                margin-bottom: 24px;
            }

            .hud-stat-item {
                background: rgba(255, 255, 255, 0.05);
                border-left: 2px solid var(--hud-accent);
                padding: 8px 12px;
                border-radius: 0 4px 4px 0;
            }

            .hud-stat-label {
                font-size: 10px;
                color: #8892b0;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 2px;
            }

            .hud-stat-value {
                font-family: 'JetBrains Mono', 'Consolas', 'Monaco', 'Lucida Console', monospace;
                font-variant-numeric: tabular-nums;
                font-size: 14px;
                color: #fff;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .hud-fact-section {
                background: linear-gradient(135deg, rgba(100, 200, 255, 0.1), transparent);
                border: 1px solid var(--hud-border);
                padding: 15px;
                border-radius: 8px;
                position: relative;
                margin-top: 10px;
            }

            .hud-fact-label {
                color: var(--hud-accent);
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                display: block;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
            }

            .hud-fact-label::before {
                content: '';
                display: inline-block;
                width: 12px;
                height: 12px;
                background: var(--hud-accent);
                margin-right: 8px;
                clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            }

            .hud-fact-text {
                font-size: 13px;
                font-style: italic;
                line-height: 1.6;
                color: #ccd6f6;
            }

            @keyframes glow-pulse {
                0% { box-shadow: 0 0 4px var(--hud-glow); }
                50% { box-shadow: 0 0 12px var(--hud-glow); }
                100% { box-shadow: 0 0 4px var(--hud-glow); }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initializes the DOM elements for the HUD panel.
     */
    initElements() {
        this.infoPanel = document.createElement('div');
        this.infoPanel.className = 'hud-panel';

        this.infoPanel.innerHTML = `
            <div class="hud-header">
                <div id="hud-type" class="hud-type">CELESTIAL BODY</div>
                <h2 id="hud-title" class="hud-title">PLANET NAME</h2>
                <button id="hud-close" class="hud-close-btn">&times;</button>
            </div>
            <div class="hud-content">
                <img id="hud-preview" class="hud-preview" src="" alt="Preview">
                    <div class="hud-stats-grid">
                        <div class="hud-stat-item">
                            <div class="hud-stat-label">Classification</div>
                            <div id="stat-type" class="hud-stat-value">-</div>
                        </div>
                        <div class="hud-stat-item">
                            <div class="hud-stat-label">Equatorial Radius</div>
                            <div id="stat-radius" class="hud-stat-value">-</div>
                        </div>
                        <div class="hud-stat-item">
                            <div class="hud-stat-label">Orbit Distance</div>
                            <div id="stat-distance" class="hud-stat-value">-</div>
                        </div>
                        <div class="hud-stat-item">
                            <div class="hud-stat-label">Orbital Period</div>
                            <div id="stat-orbit" class="hud-stat-value">-</div>
                        </div>
                        <div class="hud-stat-item">
                            <div class="hud-stat-label">Rotation Period</div>
                            <div id="stat-rotation" class="hud-stat-value">-</div>
                        </div>
                        <div class="hud-stat-item">
                            <div class="hud-stat-label">Dist. from Earth</div>
                            <div id="hud-dist-earth" class="hud-stat-value">Calculating...</div>
                        </div>
                        <div class="hud-stat-item">
                            <div class="hud-stat-label">Orbital Velocity</div>
                            <div id="hud-velocity" class="hud-stat-value">Calculating...</div>
                        </div>
                    </div>
                    <div class="hud-fact-section">
                        <span class="hud-fact-label">Did You Know?</span>
                        <p id="hud-fact" class="hud-fact-text"></p>
                    </div>
            </div>
        `;

        this.container.appendChild(this.infoPanel);

        // Cache references
        this.elements = {
            panel: this.infoPanel,
            title: document.getElementById('hud-title'),
            type: document.getElementById('hud-type'),
            closeBtn: document.getElementById('hud-close'),
            preview: document.getElementById('hud-preview'),
            fact: document.getElementById('hud-fact'),
            statType: document.getElementById('stat-type'),
            statRadius: document.getElementById('stat-radius'),
            statDistance: document.getElementById('stat-distance'),
            statOrbit: document.getElementById('stat-orbit'),
            statRotation: document.getElementById('stat-rotation')
        };
    }

    /**
     * Binds event listeners for UI interactions.
     */
    bindEvents() {
        // Listen for planet selection
        bus.on('BODY_SELECTED', (payload) => {
            if (payload && payload.data) {
                this.showInfo(payload.data);
            } else {
                this.hideInfo();
            }
        });

        // Close button click
        this.elements.closeBtn.addEventListener('click', () => {
            this.hideInfo();
            // Optionally emit event to deselect in simulation
            bus.emit('REQUEST_DESELECT', {});
        });
    }

    /**
     * Updates and displays the information panel for a given body.
     * @param {Object} data - The celestial body data.
     */
    showInfo(data) {
        this.selectedBody = data;

        // Update accent colors based on planet color
        const color = data.color || 0x64c8ff;
        const colorHex = '#' + (color).toString(16).padStart(6, '0');
        this.infoPanel.style.setProperty('--hud-accent', colorHex);
        this.infoPanel.style.setProperty('--hud-border', `rgba(${this.hexToRgb(colorHex)}, 0.3)`);
        this.infoPanel.style.setProperty('--hud-glow', `rgba(${this.hexToRgb(colorHex)}, 0.2)`);

        // Fill data
        this.elements.title.textContent = data.name;
        this.elements.type.textContent = (data.parent ? `${data.parent} Moon` : data.type).toUpperCase();

        this.elements.statType.textContent = data.type;
        this.elements.statRadius.textContent = `${data.radius.toLocaleString()} km`;
        this.elements.statDistance.textContent = data.distance > 0 ? `${(data.distance / 1000000).toFixed(1)}M km` : 'N/A';
        this.elements.statOrbit.textContent = data.orbitPeriod > 0 ? `${data.orbitPeriod.toLocaleString()} days` : 'N/A';
        this.elements.statRotation.textContent = (data.rotationPeriod !== undefined && !isNaN(data.rotationPeriod)) ? `${Math.abs(data.rotationPeriod).toLocaleString()} hrs` : 'N/A';

        // Preview image
        if (data.images && data.images.length > 0) {
            this.elements.preview.src = data.images[0];
            this.elements.preview.style.display = 'block';
        } else {
            this.elements.preview.src = data.texture || '';
            this.elements.preview.style.display = data.texture ? 'block' : 'none';
        }

        // Random fact
        if (data.facts && data.facts.length > 0) {
            const fact = data.facts[Math.floor(Math.random() * data.facts.length)];
            this.elements.fact.textContent = fact;
        } else {
            this.elements.fact.textContent = `Exploration of ${data.name} is ongoing.`;
        }

        // Slide in
        this.infoPanel.classList.add('active');
    }

    /**
     * Hides the information panel with animation.
     */
    hideInfo() {
        this.infoPanel.classList.remove('active');
        this.selectedBody = null;
    }

    /**
     * Updates dynamic stats like distance from Earth and velocity.
     * @param {Object} stats - Real-time statistics.
     */
    updateDynamicStats(stats) {
        const elDist = document.getElementById('hud-dist-earth');
        if (elDist && stats.distanceKm !== undefined) {
            elDist.textContent = `${(stats.distanceKm / 1000000).toFixed(1)}M km`;
        }

        const elVel = document.getElementById('hud-velocity');
        if (elVel) {
            if (stats.velocityKmS !== undefined && stats.velocityKmS > 0) {
                elVel.textContent = `${stats.velocityKmS.toFixed(2)} km / s`;
            } else {
                elVel.textContent = 'Stationary';
            }
        }
    }

    /**
     * Utility to convert hex color to RGB components.
     * @param {string} hex 
     * @returns {string} r, g, b
     */
    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b} `;
    }
}

