export class SimulationClock {
    constructor() {
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.deltaTime = 0;
        this.timeScale = 1; // 1 real second = 1 sim second by default
        this.paused = false;
        this.lastFrameTime = this.startTime;

        this.simDate = new Date(); // Current simulation date
    }

    tick() {
        const now = Date.now();
        this.deltaTime = (now - this.lastFrameTime) / 1000.0;
        this.lastFrameTime = now;

        if (!this.paused) {
            this.elapsedTime += this.deltaTime * this.timeScale;
            // Update simulation date based on elapsed time (assuming default 1 sec/day or whatever scale)
            // For solar system, 1 second = 1 day is a good default scale? Or maybe real-time?
            // Architecture says "Time scale (multiplier)".
            // Let's implement basic time adding.
            // 1 unit of timeScale usually means 'seconds per second'.
            // If we want days per second, we set scale accordingly.
            this.simDate = new Date(this.simDate.getTime() + (this.deltaTime * this.timeScale * 1000));
        }
    }

    setTimeScale(scale) {
        this.timeScale = scale;
    }

    setPaused(paused) {
        this.paused = paused;
    }

    setDate(date) {
        this.simDate = new Date(date);
    }

    getSimDate() {
        return this.simDate;
    }
}
