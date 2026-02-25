import * as THREE from 'three';

export class LoadingScreen {
    constructor() {
        this.container = document.body;
        this.isLoaded = false;
        this.initStyles();
        this.initElements();
        this.setupLoadingManager();
    }

    initStyles() {
        if (document.getElementById('landing-styles')) return;
        const style = document.createElement('style');
        style.id = 'landing-styles';
        style.innerHTML = `
            :root {
                --c-bg: #050414;
                --c-bg2: #020c24;
                --c-wave1: #00d2ff;
                --c-wave2: #3a7bd5;
                --c-wave3: #ff007f;
                --c-purple: #8a2be2;
                --c-text: #ffffff;
            }
            .landing-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: linear-gradient(135deg, var(--c-bg) 0%, var(--c-bg2) 100%);
                z-index: 9999;
                color: var(--c-text);
                font-family: system-ui, -apple-system, sans-serif;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .landing-overlay.hidden {
                opacity: 0;
                transform: scale(1.05); /* Slight zoom when exiting */
                pointer-events: none;
            }

            /* Navbar */
            .landing-nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 40px 8%;
                position: relative;
                z-index: 10;
            }
            .nav-logo {
                font-size: 24px;
                font-weight: 800;
                letter-spacing: 1px;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .nav-logo svg {
                width: 40px; height: 40px;
            }
            .nav-logo span {
                opacity: 0.5;
                font-size: 14px;
                display: block;
                font-weight: 400;
                letter-spacing: 0;
                margin-top: 2px;
            }
            .nav-links {
                display: flex;
                gap: 50px;
                font-size: 15px;
                opacity: 0.9;
            }
            .nav-links span { cursor: pointer; transition: opacity 0.2s, color 0.2s; }
            .nav-links span:hover { opacity: 1; color: var(--c-wave1); }

            /* Hero Content */
            .landing-hero {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex: 1;
                padding: 0 8%;
                position: relative;
                z-index: 10;
                margin-top: -50px;
            }
            .hero-text {
                max-width: 550px;
            }
            .hero-title {
                font-size: 72px;
                font-weight: 800;
                line-height: 1.1;
                margin-bottom: 30px;
                letter-spacing: 1px;
            }
            .hero-title span {
                color: #8cafff;
                font-size: 60px;
                display: inline-block;
                border-bottom: 4px solid #3a7bd5;
                padding-bottom: 5px;
            }
            .hero-desc {
                font-size: 18px;
                line-height: 1.6;
                opacity: 0.8;
                margin-bottom: 40px;
            }
            
            /* Button & Loading */
            .action-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .loading-state {
                display: flex;
                flex-direction: column;
                gap: 10px;
                transition: opacity 0.3s;
            }
            .progress-container {
                width: 250px;
                height: 4px;
                background: rgba(255,255,255,0.1);
                border-radius: 2px;
                overflow: hidden;
            }
            .progress-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, var(--c-wave1), var(--c-purple));
                transition: width 0.3s;
            }
            .loading-text {
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: var(--c-wave1);
            }

            .btn-explore {
                background: linear-gradient(90deg, #111 0%, #000 100%);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 30px;
                padding: 15px 35px;
                color: white;
                font-size: 16px;
                font-weight: bold;
                cursor: not-allowed;
                display: flex;
                align-items: center;
                gap: 15px;
                width: max-content;
                transition: all 0.3s;
                opacity: 0; /* Hidden until loaded */
                transform: translateY(10px);
                position: absolute; /* Swap position with loading bar seamlessly */
            }
            .btn-explore.ready {
                cursor: pointer;
                background: linear-gradient(90deg, #161c33 0%, #0d122b 100%);
                border-color: var(--c-wave2);
                opacity: 1;
                transform: translateY(0);
                position: relative;
            }
            .btn-explore.ready:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(58, 123, 213, 0.3);
            }
            .btn-explore svg { width: 20px; height: 20px; }
            
            .website-link {
                margin-top: -5px;
                font-size: 14px;
                color: #ccc;
                letter-spacing: 1px;
            }

            /* Rocket Animation */
            .hero-graphic {
                position: relative;
                width: 500px;
                height: 500px;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: float 5s ease-in-out infinite;
                margin-right: 5%;
            }
            .rocket-svg {
                width: 350px;
                height: 350px;
                transform: rotate(45deg);
                filter: drop-shadow(0 20px 30px rgba(0,0,0,0.5));
            }
            
            /* Dotted Grid Background */
            .bg-grid {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
                background-size: 40px 40px;
                opacity: 0.5;
                z-index: 1;
            }

            /* Floating Planetes/Stars */
            .floating-orb {
                position: absolute;
                border-radius: 50%;
                box-shadow: inset -10px -10px 20px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5);
            }
            .orb-1 { width: 80px; height: 80px; top: 20%; right: 40%; background: #2a3455; animation: float 7s infinite reverse; }
            .orb-2 { width: 120px; height: 120px; bottom: 35%; left: 15%; background: #1a1532; animation: float 8s infinite; }

            /* Simple shooting stars */
            .shooting-star {
                position: absolute;
                width: 80px; height: 1px;
                background: linear-gradient(90deg, transparent, white);
                transform: rotate(-45deg);
                opacity: 0.6;
            }

            @keyframes float {
                0% { transform: translateY(0px) }
                50% { transform: translateY(-20px) }
                100% { transform: translateY(0px) }
            }

            /* Wavy Bottom */
            .wave-container {
                position: absolute;
                bottom: 0; /* Align perfectly to bottom */
                left: 0;
                width: 100%;
                z-index: 5;
                line-height: 0;
                pointer-events: none;
            }
            .wave-container svg {
                width: 100%;
                height: auto;
                max-height: 400px;
                display: block;
            }
        `;
        document.head.appendChild(style);
    }

    initElements() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'landing-overlay';
        this.overlay.id = 'loading-screen';

        const html = `
            <div class="bg-grid"></div>
            
            <!-- Orbs -->
            <div class="floating-orb orb-1"></div>
            <div class="floating-orb orb-2"></div>

            <!-- Navbar -->
            <div class="landing-nav">
                <div class="nav-logo">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--c-wave1)" stroke-width="8" stroke-dasharray="210 50" transform="rotate(-45 50 50)"/>
                        <circle cx="50" cy="50" r="28" fill="var(--c-wave2)"/>
                        <circle cx="68" cy="32" r="8" fill="var(--c-wave3)"/>
                    </svg>
                    <div>
                        Solaris Sim
                        <span>Precision Engine</span>
                    </div>
                </div>
            </div>

            <!-- Hero Content -->
            <div class="landing-hero">
                <div class="hero-text">
                    <h1 class="hero-title">Explore<br><span>The Cosmos</span></h1>
                    <p class="hero-desc">Experience a highly accurate, real-time 3D simulation of our solar neighborhood built with precise JPL ephemeris data. Immerse yourself completely.</p>
                    
                    <div class="action-container">
                        <div id="loading-state" class="loading-state">
                            <div id="prog-text" class="loading-text">Calibrating Simulator...</div>
                            <div class="progress-container">
                                <div id="prog-bar" class="progress-bar"></div>
                            </div>
                        </div>
                        
                        <button id="btn-start" class="btn-explore">
                            Explore Now
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                        <div class="website-link" id="site-link" style="opacity: 0">www.solaris-sim.io</div>
                    </div>
                </div>

                <div class="hero-graphic">
                    <!-- Rocket SVG -->
                    <svg class="rocket-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#ffffff" />
                                <stop offset="100%" stop-color="#a0b5e8" />
                            </linearGradient>
                            <linearGradient id="finGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#3a7bd5" />
                                <stop offset="100%" stop-color="#00d2ff" />
                            </linearGradient>
                        </defs>
                        <!-- Fire Base -->
                        <path d="M 85 155 C 100 220 115 155 115 155 Z" fill="#ff007f"/>
                        <path d="M 92 155 C 100 195 108 155 108 155 Z" fill="#00d2ff"/>
                        
                        <!-- Main Body -->
                        <path d="M 100 20 C 145 60 135 140 120 160 L 80 160 C 65 140 55 60 100 20 Z" fill="url(#rocketGrad)"/>
                        
                        <!-- Left Fin -->
                        <path d="M 72 110 C 30 130 40 170 40 170 C 50 160 80 150 82 140 Z" fill="url(#finGrad)"/>
                        <!-- Right Fin -->
                        <path d="M 128 110 C 170 130 160 170 160 170 C 150 160 120 150 118 140 Z" fill="url(#finGrad)"/>
                        
                        <!-- Stripes -->
                        <path d="M 70 90 Q 100 100 130 90 L 132 105 Q 100 115 68 105 Z" fill="#ffffff" opacity="0.6"/>
                        <path d="M 78 125 Q 100 135 122 125 L 123 135 Q 100 145 77 135 Z" fill="#ffffff" opacity="0.6"/>

                        <!-- Window -->
                        <circle cx="100" cy="65" r="16" fill="#161c33"/>
                        <circle cx="100" cy="65" r="11" fill="#cce0ff"/>
                        <!-- Highlight -->
                        <path d="M 95 56 A 11 11 0 0 1 106 60 A 9 9 0 0 0 92 63 Z" fill="#ffffff" opacity="0.8"/>
                    </svg>
                    
                    <!-- Shooting stars relative to rocket -->
                    <div class="shooting-star" style="top: 0; right: -80px;"></div>
                    <div class="shooting-star" style="top: -60px; right: 100px; width: 50px;"></div>
                    <div class="shooting-star" style="top: 150px; right: -120px; width: 40px;"></div>
                </div>
            </div>

            <!-- Waves -->
            <div class="wave-container">
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#ff007f" stop-opacity="0.9" />
                            <stop offset="100%" stop-color="#8a2be2" stop-opacity="0.9" />
                        </linearGradient>
                        <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#8a2be2" stop-opacity="0.9" />
                            <stop offset="100%" stop-color="#3a7bd5" stop-opacity="0.9" />
                        </linearGradient>
                        <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#00d2ff" stop-opacity="1" />
                            <stop offset="100%" stop-color="#00ffff" stop-opacity="1" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#wave1)" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,144C672,128,768,128,864,138.7C960,149,1056,171,1152,181.3C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    <path fill="url(#wave2)" d="M0,224L60,213.3C120,203,240,181,360,192C480,203,600,245,720,250.7C840,256,960,224,1080,218.7C1200,213,1320,235,1380,245.3L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                    <path fill="url(#wave3)" d="M0,288L80,277.3C160,267,320,245,480,240C640,235,800,245,960,261.3C1120,277,1280,299,1360,309.3L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
            </div>
        `;

        this.overlay.innerHTML = html;
        this.container.appendChild(this.overlay);

        this.progBar = document.getElementById('prog-bar');
        this.progText = document.getElementById('prog-text');
        this.btnStart = document.getElementById('btn-start');
        this.loadingStateContainer = document.getElementById('loading-state');
        this.siteLink = document.getElementById('site-link');

        this.btnStart.addEventListener('click', () => {
            if (this.isLoaded) {
                this.hide();
            }
        });
    }

    setupLoadingManager() {
        THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal) * 100;
            if (this.progBar) {
                this.progBar.style.width = `${progress}%`;
                this.progText.textContent = `CALIBRATING ASSETS... ${Math.round(progress)}%`;
            }
        };

        THREE.DefaultLoadingManager.onLoad = () => {
            this.markReady();
        };

        // Safety timeout in case caching/procedural prevents onLoad firing
        setTimeout(() => {
            this.markReady();
        }, 3000);
    }

    markReady() {
        if (!this.isLoaded && this.progBar) {
            this.isLoaded = true;
            this.progBar.style.width = '100%';
            this.progText.textContent = 'SYSTEM READY';

            // Swap UI
            setTimeout(() => {
                this.loadingStateContainer.style.opacity = '0';
                this.loadingStateContainer.style.pointerEvents = 'none';
                this.btnStart.classList.add('ready');
                this.siteLink.style.opacity = '1';
                this.siteLink.style.transition = 'opacity 0.3s 0.2s';
            }, 300);
        }
    }

    hide() {
        this.overlay.classList.add('hidden');
        setTimeout(() => {
            if (this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
            }
        }, 1500);
    }
}
