# VirtuLab: Advanced STEM Simulation Suite 🔬🚀📐

VirtuLab is a responsive, interactive web-based simulation suite designed to visualize complex scientific and mathematical concepts that are difficult to observe in a traditional laboratory setting. Built with vanilla JavaScript and HTML5 Canvas, it offers real-time physics engines and data analysis tools for students and educators.

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-Apache_2.0-blue)

Project Link : https://javsvirtulab.netlify.app/

## 🌟 Features

VirtuLab is divided into three core disciplines, each featuring "impossible" experiments:

### 1. ⚛️ Physics Module
* **Simple Harmonic Motion (SHM):**
    * Visualizes SHM as the projection (shadow) of a particle undergoing Uniform Circular Motion.
    * **Controls:** Adjust Amplitude (Radius) and Angular Frequency.
    * **Analysis:** Real-time generation of sine waves correlating the rotating particle to its linear projection.
* **Orbital Mechanics (Gravity Assist):**
    * Simulates N-Body physics to demonstrate the "Slingshot Maneuver."
    * **Controls:** Adjust Thruster Power, Launch Angle, and Planet Mass.
    * **Analysis:** Telemetry graphs showing velocity deltas and efficiency gains.

### 2. 🧪 Chemistry Module
* **Nuclear Decay Chamber:**
    * A stochastic simulation of unstable isotopes decaying over time.
    * **Visuals:** Atoms flash upon decay, releasing "radiation" shockwaves.
    * **Analysis:** Plots the real-time exponential decay curve and calculates the simulated Half-Life.

### 3. 📐 Mathematics Module
* **Visualizing Pi (The Irrationality Proof):**
    * An infinite drawing simulation based on the equation.
    * **Concept:** Because the ratio of the two rotation speeds is irrational, the vector arms never return to their starting configuration, creating a non-repeating, space-filling curve.
    * **Controls:** Simulation Speed and Zoom Level.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Responsive Grid/Flexbox)
* **Graphics:** HTML5 Canvas API (2D Context)
* **Data Visualization:** Chart.js
* **Math Rendering:** Vanilla JS Physics Engines

## 🚀 Getting Started

### Prerequisites
You only need a modern web browser (Chrome, Firefox, Edge, Safari). No Node.js or Python backend is required.


## 📂 File Structure

```text
VirtuLab/
│
├── index.html      # Main structure and UI layout
├── style.css       # Cyberpunk theme, responsive design, and animations
├── script.js       # Physics engines, logic loops, and Chart.js configs
└── README.md       # Project documentation
