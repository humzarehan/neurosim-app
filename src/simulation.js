// ==========================================
// CHECKPOINT 8 — THE NEURON CLASS ENGINE
// ==========================================


// ==========================================
// CLASS 1: NEURON
// ==========================================

export class Neuron {

    constructor(id, name, x, y, params) {

        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;

        this.voltage = params.vRest;

        this.threshold = params.threshold;
        this.tau = params.tau;
        this.vRest = params.vRest;
        this.vReset = params.vReset;

        this.isFiring = false;
        this.spikeHistory = [];
        this.receivedCurrent = 0;
    }


    // ---------- ONE LIF TIME STEP ----------

    step(dt) {

        // LIF equation
        this.voltage =
            this.voltage +
            (dt / this.tau) *
            (-(this.voltage - this.vRest) + this.receivedCurrent);


        // Check whether neuron spiked
        if (this.voltage >= this.threshold) {

            this.isFiring = true;

            // Store the current time.
            // The Network will handle the actual time.
            this.spikeHistory.push(this.voltage);

            // Reset voltage after spike
            this.voltage = this.vReset;

        } else {

            this.isFiring = false;
        }


        // Synaptic current only lasts for this timestep
        this.receivedCurrent = 0;
    }


    // ---------- RECEIVE SYNAPTIC CURRENT ----------

    receiveCurrent(amount) {

        this.receivedCurrent += amount;
    }


    // ---------- FIRING RATE ----------

    getFiringRate(totalTime) {

        return (this.spikeHistory.length / totalTime) * 1000;
    }


    // ---------- GET CURRENT STATE ----------

    getState() {

        return {
            id: this.id,
            name: this.name,
            voltage: this.voltage,
            isFiring: this.isFiring,
            spikeCount: this.spikeHistory.length
        };
    }


    // ---------- RESET ----------

    reset() {

        this.voltage = this.vRest;
        this.isFiring = false;
        this.spikeHistory = [];
        this.receivedCurrent = 0;
    }
}


// ==========================================
// CLASS 2: NETWORK
// ==========================================

export class Network {

    constructor() {

        this.neurons = [];
        this.synapses = [];
        this.time = 0;
        this.isRunning = false;
        this.spikeLog = [];
    }


    // ---------- ADD NEURON ----------

    addNeuron(name, x, y, params) {

        const id = this.neurons.length;

        const neuron = new Neuron(
            id,
            name,
            x,
            y,
            params
        );

        this.neurons.push(neuron);

        return neuron;
    }


    // ---------- CONNECT NEURONS ----------

    connect(fromId, toId, weight) {

        this.synapses.push({
            from: fromId,
            to: toId,
            weight: weight
        });
    }


    // ---------- ONE NETWORK TIME STEP ----------

    step(dt) {

        // ==========================================
        // PHASE 1: DELIVER SYNAPTIC CURRENT
        // ==========================================

        this.synapses.forEach(synapse => {

            const fromNeuron =
                this.getNeuronById(synapse.from);

            const toNeuron =
                this.getNeuronById(synapse.to);

            if (fromNeuron.isFiring) {

                toNeuron.receiveCurrent(synapse.weight);
            }
        });


        // ==========================================
        // PHASE 2: UPDATE ALL NEURONS
        // ==========================================

        this.neurons.forEach(neuron => {

            neuron.step(dt);
        });


        // ==========================================
        // PHASE 3: LOG SPIKES
        // ==========================================

        this.neurons.forEach(neuron => {

            if (neuron.isFiring) {

                this.spikeLog.push({
                    time: this.time,
                    neuron: neuron.name,
                    voltage: neuron.voltage
                });
            }
        });


        // Move simulation clock forward
        this.time++;
    }


    // ---------- RUN MULTIPLE STEPS ----------

    run(steps, dt) {

        for (let i = 0; i < steps; i++) {

            this.step(dt);
        }
    }


    // ---------- GET NETWORK STATISTICS ----------

    getStats() {

        const totalSpikes = this.neurons.reduce(
            (total, neuron) =>
                total + neuron.spikeHistory.length,
            0
        );

        const firingRates = this.neurons.map(
            neuron =>
                neuron.getFiringRate(this.time)
        );

        const activeNeuronCount =
            this.neurons.filter(
                neuron => neuron.spikeHistory.length > 0
            ).length;

        return {
            totalSpikes: totalSpikes,
            firingRates: firingRates,
            activeNeuronCount: activeNeuronCount
        };
    }


    // ---------- RESET NETWORK ----------

    reset() {

        this.neurons.forEach(neuron => {

            neuron.reset();
        });

        this.spikeLog = [];
        this.time = 0;
        this.isRunning = false;
    }


    // ---------- FIND NEURON BY ID ----------

    getNeuronById(id) {

        return this.neurons.find(
            neuron => neuron.id === id
        );
    }
}


// ==========================================
// MAIN PROGRAM
// ==========================================


// ---------- CREATE NETWORK ----------

const network = new Network();


// ---------- ADD NEURONS ----------

network.addNeuron(
    "Fast",
    100,
    100,
    {
        threshold: -55,
        tau: 10,
        vRest: -70,
        vReset: -70
    }
);

network.addNeuron(
    "Slow",
    200,
    100,
    {
        threshold: -55,
        tau: 40,
        vRest: -70,
        vReset: -70
    }
);

network.addNeuron(
    "Sensitive",
    150,
    200,
    {
        threshold: -60,
        tau: 20,
        vRest: -70,
        vReset: -70
    }
);

network.addNeuron(
    "Hub",
    300,
    200,
    {
        threshold: -55,
        tau: 20,
        vRest: -70,
        vReset: -70
    }
);

network.addNeuron(
    "Output",
    400,
    150,
    {
        threshold: -55,
        tau: 20,
        vRest: -70,
        vReset: -70
    }
);


// ---------- CONNECT NETWORK ----------

network.connect(0, 2, 300);
network.connect(1, 2, 300);
network.connect(2, 3, 300);
network.connect(3, 4, 300);


// ==========================================
// RUN 1 — INPUT CURRENT 30
// ==========================================

for (let i = 0; i < 200; i++) {

    network.getNeuronById(0).receiveCurrent(30);
    network.getNeuronById(1).receiveCurrent(30);

    network.step(1);
}


console.log("=== RUN 1 (input current: 30) ===");

console.log("Stats:", network.getStats());


console.log("\nNeuron states:");

network.neurons.forEach(neuron => {

    console.log(neuron.getState());
});


console.log("\nSpike log (first 10):");

network.spikeLog
    .slice(0, 10)
    .forEach(spike => {

        console.log(
            `t=${spike.time}: ${spike.neuron} spiked`
        );
    });


// ==========================================
// RESET
// ==========================================

network.reset();


// ==========================================
// RUN 2 — INPUT CURRENT 60
// ==========================================

for (let i = 0; i < 200; i++) {

    network.getNeuronById(0).receiveCurrent(60);

    network.step(1);
}


console.log("\n=== RUN 2 (input current: 60) ===");

console.log("Stats:", network.getStats());