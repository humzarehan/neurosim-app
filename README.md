# NeuroSim

A browser-based simulator for spiking neural networks, brain-inspired AI models
in which neurons communicate through discrete electrical spikes. Built in
JavaScript and React.

## What works now (Phase 1)

A live simulation of a single leaky integrate-and-fire (LIF) neuron:

- The neuron's membrane voltage builds up from input current, leaks back toward
  its resting value, and fires a spike when it crosses a threshold, then resets.
- A voltage trace shows this over time, and the neuron's color changes with its
  voltage.
- Sliders control input current, firing threshold and the membrane time constant
  (tau). Play, pause and reset buttons control the run.

## In progress (Phase 2)

Placing multiple neurons on a canvas, connecting them with synapses, and
watching spikes travel through the network.

## Roadmap

1. **Layer 1:** interactive network builder (Phases 1-2 above)
2. **Layer 2 (planned):** STDP learning visualization and a spiking vs. standard
   neural network comparison
3. **Layer 3 (planned):** a case study detecting arrhythmias in ECG data
   (MIT-BIH dataset), comparing a spiking network with a conventional deep
   learning model on accuracy and energy use

## Why

Neurons in the brain don’t pass continuous numbers. They communicate in brief pulses called spikes, spread over time. I’m building NeuroSim so people can see this happening and experiment with it directly. My longer-term goal is to test whether networks that compute this way can match conventional AI on a real task while using much less energy.

## Run it locally

    npm install
    npm run dev

Then open the address printed in the terminal (usually http://localhost:5173).

## Code

Earlier learning checkpoints for the engine are in
[github.com/humzarehan/neurosim](https://github.com/humzarehan/neurosim).
- `src/simulation.js`: the `Neuron` and `Network` classes (the simulation engine)
- `src/App.jsx`: the React interface and canvas drawing

Earlier learning checkpoints for the engine are in
[github.com/humzarehan/neurosim](https://github.com/humzarehan/neurosim).
