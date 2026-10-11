import { useRef, useEffect, useState } from "react";
import { Neuron, Network } from "./simulation.js";

function App() {
  const canvasRef = useRef(null);
  const networkRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);

  if (networkRef.current === null) {
    networkRef.current = new Network();
  }

  // ===== CHANGE 1: ADD THIS FUNCTION =====
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const name = "N" + networkRef.current.neurons.length;

    networkRef.current.addNeuron(name, x, y, {
      threshold: -55,
      tau: 20,
      vRest: -70,
      vReset: -70,
    });
  };
  // ===== END CHANGE 1 =====

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const network = networkRef.current;

    let animationFrameId;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      network.neurons.forEach((neuron) => {
        // ===== CHANGE 2: INJECT 25 CURRENT INSTEAD OF 0 =====
        neuron.receiveCurrent(25);
        // ===== END CHANGE 2 =====

        neuron.step(1);

        let brightness =
          ((neuron.voltage - neuron.vRest) /
            (neuron.threshold - neuron.vRest)) *
          255;

        brightness = Math.max(0, Math.min(255, brightness));

        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, 40, 0, Math.PI * 2);

        if (neuron.isFiring) {
          ctx.fillStyle = "yellow";
        } else {
          ctx.fillStyle = `rgb(0, 0, ${brightness})`;
        }

        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  function handleReset() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div>
      {/* Network Canvas */}
      {/* ===== CHANGE 3: ADD onClick={handleCanvasClick} =====*/}
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{ border: "1px solid black" }}
        onClick={handleCanvasClick}
      />
      {/* ===== END CHANGE 3 ===== */}

      {/* Play / Pause */}
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Pause" : "Play"}
      </button>

      {/* Reset */}
      <button onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}

export default App;