# 🌌 Solar System Simulator

An interactive solar system simulator that visualizes the planets of our solar system, their orbits, and real-time motion based on gravitational physics.

## 📖 Overview

The Solar System Simulator provides a real-time, interactive visualization of the solar system. It models the motion of the Sun and the eight planets using Newtonian gravity, allowing users to explore orbital mechanics, planet properties, and the scale of our solar system.

## ✨ Features

- **Interactive Visualization** – Real-time rendering of the Sun and all eight planets with accurate relative sizes and orbital paths.
- **Orbital Mechanics** – Simulates planetary motion using gravitational physics (Newton's Law of Universal Gravitation).
- **Zoom & Pan** – Navigate the simulation by zooming in/out and panning across the solar system.
- **Time Control** – Speed up, slow down, or pause the simulation to observe orbital periods.
- **Planet Info** – Click on any planet to view details such as mass, radius, orbital period, and distance from the Sun.
- **Realistic Scale** – Toggle between true-to-scale and enhanced-visibility modes.

## 🪐 Planets Included

| Planet  | Orbital Period | Distance from Sun |
|---------|---------------|-------------------|
| Mercury | 88 days       | 0.39 AU           |
| Venus   | 225 days      | 0.72 AU           |
| Earth   | 365 days      | 1.00 AU           |
| Mars    | 687 days      | 1.52 AU           |
| Jupiter | 11.9 years    | 5.20 AU           |
| Saturn  | 29.5 years    | 9.58 AU           |
| Uranus  | 84 years      | 19.2 AU           |
| Neptune | 165 years     | 30.1 AU           |

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- [Node.js](https://nodejs.org/) (v16 or higher) – for running the development server

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kanakc924/solar-system-simulator.git
   cd solar-system-simulator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

## 🎮 Usage

| Action                  | Control                        |
|-------------------------|--------------------------------|
| Zoom in / out           | Mouse scroll wheel             |
| Pan                     | Click and drag                 |
| Select a planet         | Left-click on a planet         |
| Pause / Resume          | Spacebar or Pause button       |
| Increase simulation speed | `+` key or Speed Up button   |
| Decrease simulation speed | `-` key or Slow Down button  |
| Reset view              | `R` key or Reset button        |

## 🛠️ Technologies Used

- **JavaScript / TypeScript** – Core simulation logic and UI
- **HTML5 Canvas / WebGL** – Rendering the solar system
- **CSS3** – Styling and layout
- **Node.js** – Development server and tooling

## 🌍 Physics Model

The simulator uses Newton's Law of Universal Gravitation to calculate the gravitational force between bodies:

```
F = G * (m1 * m2) / r²
```

Where:
- `F` is the gravitational force
- `G` is the gravitational constant (6.674 × 10⁻¹¹ N·m²/kg²)
- `m1`, `m2` are the masses of the two bodies
- `r` is the distance between the centres of the two bodies

Planetary positions are updated using a numerical integration method (Euler or Runge-Kutta) at each simulation step.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request.

Please ensure your code follows the existing style and all tests pass before submitting a PR.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 📬 Contact

Created by [@kanakc924](https://github.com/kanakc924) – feel free to open an issue for questions, bug reports, or feature requests.
