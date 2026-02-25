export class Timeline {
    constructor(clock) {
        this.clock = clock;
        this.container = document.getElementById('ui-layer');
        this.initElements();
        this.bindEvents();

        // Start update loop for UI
        this.updateInterval = setInterval(() => this.updateUI(), 100);
    }

    initElements() {
        this.panel = document.createElement('div');
        this.panel.style.position = 'absolute';
        this.panel.style.bottom = '20px';
        this.panel.style.left = '50%';
        this.panel.style.transform = 'translateX(-50%)';
        this.panel.style.width = '600px';
        this.panel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        this.panel.style.padding = '15px';
        this.panel.style.borderRadius = '30px';
        this.panel.style.display = 'flex';
        this.panel.style.alignItems = 'center';
        this.panel.style.justifyContent = 'space-between';
        this.panel.style.gap = '15px';
        this.panel.className = 'pointer-events-auto';

        // Inject style for the date input's calendar icon to make it white
        const style = document.createElement('style');
        style.innerHTML = `
            .timeline-date-input::-webkit-calendar-picker-indicator {
                filter: invert(1);
                cursor: pointer;
            }
        `;
        this.container.appendChild(style);

        // Date Display
        this.dateDisplay = document.createElement('div');
        this.dateDisplay.style.color = '#fff';
        this.dateDisplay.style.fontFamily = 'monospace';
        this.dateDisplay.style.fontSize = '16px';
        this.dateDisplay.style.minWidth = '220px';
        this.dateDisplay.textContent = this.formatDate(this.clock.getSimDate());

        // Speed Control
        this.speedSelect = document.createElement('select');
        this.speedSelect.style.background = 'rgba(255, 255, 255, 0.1)';
        this.speedSelect.style.color = '#fff';
        this.speedSelect.style.border = '1px solid #555';
        this.speedSelect.style.borderRadius = '5px';
        this.speedSelect.style.padding = '5px';
        this.speedSelect.style.cursor = 'pointer';
        this.speedSelect.style.fontFamily = 'monospace';

        const speeds = [
            { label: 'Real Time', value: 1 },
            { label: '1 Min / Sec', value: 60 },
            { label: '1 Hour / Sec', value: 3600 },
            { label: '1 Day / Sec', value: 86400 },
            { label: '1 Week / Sec', value: 604800 },
            { label: '1 Month / Sec', value: 2592000 }
        ];

        speeds.forEach(speed => {
            const opt = document.createElement('option');
            opt.value = speed.value;
            opt.textContent = speed.label;
            opt.style.color = 'black'; // Option dropdown text
            this.speedSelect.appendChild(opt);
        });

        // Setup initial value
        this.speedSelect.value = this.clock.timeScale || 1;

        // Reset Button
        this.resetBtn = document.createElement('button');
        this.resetBtn.textContent = 'Now';
        this.resetBtn.style.padding = '5px 15px';
        this.resetBtn.style.background = '#4488ff';
        this.resetBtn.style.border = 'none';
        this.resetBtn.style.borderRadius = '15px';
        this.resetBtn.style.color = 'white';
        this.resetBtn.style.cursor = 'pointer';
        this.resetBtn.style.fontWeight = 'bold';

        // Pause/Play
        this.pauseBtn = document.createElement('button');
        this.pauseBtn.textContent = '⏸';
        this.pauseBtn.style.background = 'transparent';
        this.pauseBtn.style.border = '1px solid #aaa';
        this.pauseBtn.style.borderRadius = '50%';
        this.pauseBtn.style.width = '30px';
        this.pauseBtn.style.height = '30px';
        this.pauseBtn.style.color = 'white';
        this.pauseBtn.style.cursor = 'pointer';
        this.pauseBtn.style.fontSize = '12px';

        // Date Input (Fine-grained control)
        this.dateInput = document.createElement('input');
        this.dateInput.type = 'date';
        this.dateInput.style.background = 'rgba(255, 255, 255, 0.1)';
        this.dateInput.style.color = '#fff';
        this.dateInput.style.border = '1px solid #555';
        this.dateInput.style.borderRadius = '5px';
        this.dateInput.style.padding = '5px';
        this.dateInput.style.fontFamily = 'monospace';
        this.dateInput.style.cursor = 'pointer';
        this.dateInput.className = 'timeline-date-input'; // Apply class for the calendar icon style

        this.panel.appendChild(this.pauseBtn);
        this.panel.appendChild(this.dateDisplay);
        this.panel.appendChild(this.dateInput); // Add input
        this.panel.appendChild(this.speedSelect);
        this.panel.appendChild(this.resetBtn);
        this.container.appendChild(this.panel);
    }

    bindEvents() {
        this.speedSelect.addEventListener('change', (e) => {
            const scale = parseInt(e.target.value);
            this.clock.setTimeScale(scale);
        });

        this.resetBtn.addEventListener('click', () => {
            this.clock.setDate(new Date()); // Reset to real now
        });

        this.pauseBtn.addEventListener('click', () => {
            this.clock.paused = !this.clock.paused;
            this.pauseBtn.textContent = this.clock.paused ? '▶' : '⏸';
        });

        this.dateInput.addEventListener('change', (e) => {
            const val = e.target.value; // YYYY-MM-DD
            if (val) {
                const [y, m, d] = val.split('-').map(Number);
                const date = new Date(this.clock.getSimDate());
                date.setFullYear(y);
                date.setMonth(m - 1); // Month is 0-indexed
                date.setDate(d);
                this.clock.setDate(date);
            }
        });
    }

    updateUI() {
        const date = this.clock.getSimDate();
        this.dateDisplay.textContent = this.formatDate(date);



        // Update date input if not focused
        if (document.activeElement !== this.dateInput) {
            // Format YYYY-MM-DD
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            this.dateInput.value = `${y}-${m}-${d}`;
        }
    }

    formatDate(date) {
        return date.toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}
