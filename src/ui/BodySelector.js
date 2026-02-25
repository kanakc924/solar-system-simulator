import { bus } from '../core/EventBus.js';
import { celestialBodies } from '../data/bodies.js';

export class BodySelector {
    constructor() {
        this.container = document.getElementById('ui-layer');
        this.isOpen = false;
        this.selectedBody = null;

        // Inject styles
        this.injectStyles();

        this.initElements();
        this.bindEvents();
    }

    injectStyles() {
        if (document.getElementById('body-selector-styles')) return;
        const style = document.createElement('style');
        style.id = 'body-selector-styles';
        style.textContent = `
            .bs-wrapper {
                position: absolute;
                top: 20px;
                left: 20px;
                display: flex;
                gap: 10px;
                align-items: center;
                pointer-events: auto;
                font-family: 'Orbitron', sans-serif; /* Fallback to sans-serif if not loaded */
                z-index: 1000;
            }
            .bs-toggle-btn {
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid #444;
                color: #fff;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 200px;
                font-size: 16px;
                transition: border-color 0.2s;
            }
            .bs-toggle-btn:hover {
                border-color: #4488ff;
            }
            .bs-thumbnail-small {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                object-fit: cover;
                background: #222;
            }
            .bs-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                margin-top: 5px;
                width: 250px;
                max-height: 400px;
                overflow-y: auto;
                background: rgba(10, 10, 15, 0.95);
                border: 1px solid #444;
                border-radius: 5px;
                display: none;
                flex-direction: column;
                box-shadow: 0 4px 15px rgba(0,0,0,0.8);
            }
            .bs-dropdown.open {
                display: flex;
            }
            .bs-category {
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.1);
                color: #aaa;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: bold;
                border-bottom: 1px solid #333;
            }
            .bs-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 12px;
                cursor: pointer;
                border-bottom: 1px solid #222;
                transition: background 0.2s;
            }
            .bs-item:hover {
                background: rgba(68, 136, 255, 0.2);
            }
            .bs-item img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: cover;
                border: 1px solid #555;
            }
            .bs-item span {
                color: #eee;
                font-size: 14px;
            }
            .bs-orbit-btn {
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid #444;
                color: #ccc;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
            }
            .bs-orbit-btn:hover {
                color: #fff;
                border-color: #666;
            }
            .bs-item.active {
                background: rgba(68, 136, 255, 0.3);
                border-left: 3px solid #4488ff;
            }
            
            /* Scrollbar styling */
            .bs-dropdown::-webkit-scrollbar {
                width: 6px;
            }
            .bs-dropdown::-webkit-scrollbar-track {
                background: #111;
            }
            .bs-dropdown::-webkit-scrollbar-thumb {
                background: #444;
                border-radius: 3px;
            }
            .bs-dropdown::-webkit-scrollbar-thumb:hover {
                background: #666;
            }
        `;
        document.head.appendChild(style);
    }

    initElements() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'bs-wrapper';

        // Toggle Button
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'bs-toggle-btn';
        this.toggleBtn.innerHTML = `
            <div class="bs-thumbnail-small" style="background: transparent;"></div>
            <span id="bs-selected-name">Select Target...</span>
            <span style="margin-left: auto; font-size: 10px;">▼</span>
        `;

        // Dropdown List
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'bs-dropdown';

        // Build the list content
        this.buildList();

        // Orbit Toggle Button
        this.orbitBtn = document.createElement('button');
        this.orbitBtn.className = 'bs-orbit-btn';
        this.orbitBtn.textContent = 'Hide Orbits';
        this.areOrbitsVisible = true;

        this.wrapper.appendChild(this.toggleBtn);
        this.wrapper.appendChild(this.dropdown);
        this.wrapper.appendChild(this.orbitBtn);
        this.container.appendChild(this.wrapper);
    }

    buildList() {
        // Categories
        const categories = {
            'star': 'Stars',
            'planet': 'Planets',
            'dwarf-planet': 'Dwarf Planets',
            'moon': 'Moons'
        };

        // Group data
        const grouped = {};
        celestialBodies.forEach(body => {
            if (!grouped[body.type]) grouped[body.type] = [];
            grouped[body.type].push(body);
        });

        // Create DOM elements
        // Order: Star, Planet, Dwarf, Moon
        const order = ['star', 'planet', 'dwarf-planet', 'moon'];

        order.forEach(type => {
            if (grouped[type]) {
                // Header
                const header = document.createElement('div');
                header.className = 'bs-category';
                header.textContent = categories[type] || type;
                this.dropdown.appendChild(header);

                // Items
                grouped[type].forEach(body => {
                    const item = document.createElement('div');
                    item.className = 'bs-item';
                    item.dataset.name = body.name; // For click handling

                    // Image
                    const img = document.createElement('img');
                    // Use first image if available, else texture, else placeholder
                    let imgSrc = '/assets/textures/placeholder.jpg';
                    if (body.images && body.images.length > 0) imgSrc = body.images[0];
                    else if (body.texture) imgSrc = body.texture;

                    img.src = imgSrc;
                    item.appendChild(img);

                    // Name
                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = body.name;
                    item.appendChild(nameSpan);

                    // Event
                    item.addEventListener('click', () => {
                        this.selectBody(body.name);
                    });

                    this.dropdown.appendChild(item);
                });
            }
        });
    }

    bindEvents() {
        // Toggle Dropdown
        this.toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.wrapper.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Orbit Toggle
        this.orbitBtn.addEventListener('click', () => {
            this.areOrbitsVisible = !this.areOrbitsVisible;
            this.orbitBtn.textContent = this.areOrbitsVisible ? 'Hide Orbits' : 'Show Orbits';
            this.orbitBtn.style.color = this.areOrbitsVisible ? '#ccc' : '#888';
            bus.emit('TOGGLE_ORBITS', this.areOrbitsVisible);
        });

        // Listen for External selection (e.g. 3D click)
        bus.on('BODY_SELECTED', (payload) => {
            if (payload && payload.data) {
                this.updateUISelection(payload.data.name);
            }
        });
    }

    toggleDropdown() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.dropdown.classList.add('open');
            this.toggleBtn.style.borderColor = '#4488ff';
        } else {
            this.closeDropdown();
        }
    }

    closeDropdown() {
        this.isOpen = false;
        this.dropdown.classList.remove('open');
        this.toggleBtn.style.borderColor = '#444';
    }

    selectBody(name) {
        bus.emit('UI_BODY_SELECTED', name);
        this.updateUISelection(name);
        this.closeDropdown();
    }

    updateUISelection(name) {
        // Update Button Text & Icon
        const nameSpan = this.toggleBtn.querySelector('#bs-selected-name');
        const iconDiv = this.toggleBtn.querySelector('.bs-thumbnail-small');

        // Find body data
        const data = celestialBodies.find(b => b.name === name);
        if (data) {
            nameSpan.textContent = data.name;
            let imgSrc = '';
            if (data.images && data.images.length > 0) imgSrc = data.images[0];
            else if (data.texture) imgSrc = data.texture;

            iconDiv.style.backgroundImage = `url('${imgSrc}')`;
            iconDiv.style.backgroundSize = 'cover';
        }

        // Highlight in list
        const items = this.dropdown.querySelectorAll('.bs-item');
        items.forEach(item => {
            if (item.dataset.name === name) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}
