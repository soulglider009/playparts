"use client";

import { useEffect, useRef, useState } from "react";

type WaterMode = "baseline" | "skilled";

type Boat = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
};

type WakeParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
};

const BASELINE_NOTES = ["flat blue fill", "single wave layer", "no object response"];
const SKILLED_NOTES = ["layered depth", "multi-scale motion", "directional wake"];

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 127.1) * 43758.5453;
  return value - Math.floor(value);
}

function drawBaselineWater(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
) {
  context.fillStyle = "#51b9d2";
  context.fillRect(0, 0, width, height);

  context.lineWidth = 2;
  for (let row = 26; row < height; row += 42) {
    context.beginPath();
    for (let x = -12; x <= width + 12; x += 12) {
      const y = row + Math.sin(x * 0.025 + time * 1.7) * 2.5;
      if (x === -12) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.strokeStyle = "rgba(232, 253, 255, 0.28)";
    context.stroke();
  }
}

function drawSkilledWater(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
) {
  const depth = context.createLinearGradient(0, 0, 0, height);
  depth.addColorStop(0, "#1595a7");
  depth.addColorStop(0.42, "#08758d");
  depth.addColorStop(1, "#07465f");
  context.fillStyle = depth;
  context.fillRect(0, 0, width, height);

  const sun = context.createRadialGradient(
    width * 0.18,
    height * 0.05,
    0,
    width * 0.18,
    height * 0.05,
    Math.max(width, height) * 0.72,
  );
  sun.addColorStop(0, "rgba(110, 248, 224, 0.34)");
  sun.addColorStop(0.48, "rgba(26, 186, 187, 0.10)");
  sun.addColorStop(1, "rgba(0, 19, 51, 0)");
  context.fillStyle = sun;
  context.fillRect(0, 0, width, height);

  const layers = [
    { gap: 58, amplitude: 9, frequency: 0.012, speed: 0.46, alpha: 0.13, width: 9 },
    { gap: 36, amplitude: 5, frequency: 0.02, speed: -0.7, alpha: 0.19, width: 3 },
    { gap: 24, amplitude: 2.5, frequency: 0.032, speed: 1.05, alpha: 0.2, width: 1.2 },
  ];

  layers.forEach((layer, layerIndex) => {
    for (let row = -30 + layerIndex * 11; row < height + 30; row += layer.gap) {
      context.beginPath();
      for (let x = -18; x <= width + 18; x += 12) {
        const firstWave = Math.sin(
          x * layer.frequency + time * layer.speed + row * 0.013,
        );
        const crossingWave = Math.sin(
          x * layer.frequency * 0.46 - time * layer.speed * 0.62 + row * 0.031,
        );
        const y = row + firstWave * layer.amplitude + crossingWave * layer.amplitude * 0.45;
        if (x === -18) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.strokeStyle = `rgba(166, 255, 235, ${layer.alpha})`;
      context.lineWidth = layer.width;
      context.lineCap = "round";
      context.stroke();
    }
  });

  for (let index = 0; index < 64; index += 1) {
    const baseX = pseudoRandom(index + 11) * width;
    const baseY = pseudoRandom(index + 91) * height;
    const drift = Math.sin(time * (0.34 + pseudoRandom(index + 4) * 0.4) + index) * 11;
    const length = 8 + pseudoRandom(index + 38) * 24;
    context.beginPath();
    context.moveTo(baseX + drift, baseY);
    context.quadraticCurveTo(
      baseX + length * 0.42 + drift,
      baseY - 3,
      baseX + length + drift,
      baseY + Math.sin(time + index) * 2,
    );
    context.strokeStyle = `rgba(215, 255, 235, ${0.08 + pseudoRandom(index) * 0.14})`;
    context.lineWidth = 0.8 + pseudoRandom(index + 20) * 1.3;
    context.stroke();
  }
}

function drawWake(
  context: CanvasRenderingContext2D,
  particles: WakeParticle[],
) {
  for (const particle of particles) {
    const progress = particle.age / particle.life;
    const alpha = Math.max(0, 1 - progress);
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size * (0.7 + progress), 0, Math.PI * 2);
    context.strokeStyle = `rgba(220, 255, 247, ${alpha * 0.54})`;
    context.lineWidth = Math.max(0.5, 2.2 * alpha);
    context.stroke();
  }
}

function drawBuoy(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number,
  lively: boolean,
  phase: number,
) {
  const bob = lively ? Math.sin(time * 1.9 + phase) * 3 : 0;
  context.save();
  context.translate(x, y + bob);
  context.fillStyle = "rgba(0, 27, 44, 0.24)";
  context.beginPath();
  context.ellipse(4, 9, 10, 4, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#ff5c38";
  context.beginPath();
  context.moveTo(0, -10);
  context.lineTo(7, 8);
  context.lineTo(-7, 8);
  context.closePath();
  context.fill();
  context.fillStyle = "#f4eddf";
  context.fillRect(-4, -2, 8, 4);
  context.restore();
}

function drawBoat(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  time: number,
  skilled: boolean,
) {
  const bob = skilled ? Math.sin(time * 2.2 + x * 0.01) * 1.8 : 0;
  const roll = skilled ? Math.sin(time * 1.6 + y * 0.01) * 0.025 : 0;

  context.save();
  context.translate(x + 5, y + 9 + bob);
  context.rotate(angle + roll);
  context.fillStyle = "rgba(0, 25, 42, 0.3)";
  context.beginPath();
  context.ellipse(-3, 1, 27, 10, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.save();
  context.translate(x, y + bob);
  context.rotate(angle + roll);

  context.fillStyle = "#f3d6a0";
  context.strokeStyle = "#172126";
  context.lineWidth = 2.5;
  context.beginPath();
  context.moveTo(25, 0);
  context.quadraticCurveTo(7, -14, -24, -9);
  context.lineTo(-17, 10);
  context.quadraticCurveTo(8, 13, 25, 0);
  context.closePath();
  context.fill();
  context.stroke();

  context.fillStyle = "#ff5c38";
  context.beginPath();
  context.moveTo(-6, -7);
  context.lineTo(-6, 7);
  context.lineTo(12, 1);
  context.closePath();
  context.fill();

  context.fillStyle = "#172126";
  context.beginPath();
  context.arc(-12, 0, 3.5, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

export function WaterComparison() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef<WaterMode>("baseline");
  const [mode, setMode] = useState<WaterMode>("baseline");

  function chooseMode(nextMode: WaterMode) {
    modeRef.current = nextMode;
    setMode(nextMode);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let previous = performance.now();
    let wakeTimer = 0;
    let pointerTarget: { x: number; y: number } | null = null;
    const wake: WakeParticle[] = [];
    const keys = new Set<string>();
    const boat: Boat = { x: 0.46, y: 0.56, vx: 0, vy: 0, angle: -0.1 };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(bounds.width * ratio));
      canvas.height = Math.max(1, Math.floor(bounds.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const updatePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerTarget = {
        x: Math.min(0.96, Math.max(0.04, (event.clientX - bounds.left) / bounds.width)),
        y: Math.min(0.92, Math.max(0.08, (event.clientY - bounds.top) / bounds.height)),
      };
    };

    const onPointerDown = (event: PointerEvent) => {
      canvas.focus();
      canvas.setPointerCapture(event.pointerId);
      updatePointer(event);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (canvas.hasPointerCapture(event.pointerId)) updatePointer(event);
    };
    const onPointerUp = (event: PointerEvent) => {
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      pointerTarget = null;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(event.key)) {
        event.preventDefault();
        keys.add(event.key.toLowerCase());
      }
      if (event.key.toLowerCase() === "b") {
        chooseMode(modeRef.current === "baseline" ? "skilled" : "baseline");
      }
    };
    const onKeyUp = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const render = (now: number) => {
      const delta = Math.min(0.034, (now - previous) / 1000);
      previous = now;
      const time = now / 1000;
      const bounds = canvas.getBoundingClientRect();
      const width = bounds.width;
      const height = bounds.height;
      const skilled = modeRef.current === "skilled";

      let inputX = 0;
      let inputY = 0;
      if (keys.has("arrowleft") || keys.has("a")) inputX -= 1;
      if (keys.has("arrowright") || keys.has("d")) inputX += 1;
      if (keys.has("arrowup") || keys.has("w")) inputY -= 1;
      if (keys.has("arrowdown") || keys.has("s")) inputY += 1;
      if (pointerTarget) {
        const dx = pointerTarget.x - boat.x;
        const dy = pointerTarget.y - boat.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0.025) {
          inputX = dx / distance;
          inputY = dy / distance;
        }
      }

      const inputLength = Math.hypot(inputX, inputY);
      if (inputLength > 0) {
        inputX /= inputLength;
        inputY /= inputLength;
        boat.vx += inputX * delta * 0.34;
        boat.vy += inputY * delta * 0.34;
      }

      const friction = Math.pow(0.13, delta);
      boat.vx *= friction;
      boat.vy *= friction;
      const speed = Math.hypot(boat.vx, boat.vy);
      const maximumSpeed = 0.19;
      if (speed > maximumSpeed) {
        boat.vx = (boat.vx / speed) * maximumSpeed;
        boat.vy = (boat.vy / speed) * maximumSpeed;
      }
      boat.x = Math.min(0.95, Math.max(0.05, boat.x + boat.vx * delta));
      boat.y = Math.min(0.92, Math.max(0.08, boat.y + boat.vy * delta));
      if (speed > 0.008) boat.angle = Math.atan2(boat.vy, boat.vx);

      wakeTimer -= delta;
      if (skilled && speed > 0.025 && wakeTimer <= 0) {
        const x = boat.x * width;
        const y = boat.y * height;
        const backX = x - Math.cos(boat.angle) * 18;
        const backY = y - Math.sin(boat.angle) * 18;
        const sideX = -Math.sin(boat.angle);
        const sideY = Math.cos(boat.angle);
        for (const side of [-1, 1]) {
          wake.push({
            x: backX + sideX * side * 6,
            y: backY + sideY * side * 6,
            vx: -Math.cos(boat.angle) * 7 + sideX * side * 10,
            vy: -Math.sin(boat.angle) * 7 + sideY * side * 10,
            age: 0,
            life: 1.2 + Math.random() * 0.55,
            size: 4 + Math.random() * 4,
          });
        }
        wakeTimer = 0.065;
      }

      for (let index = wake.length - 1; index >= 0; index -= 1) {
        const particle = wake[index];
        particle.age += delta;
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        if (particle.age >= particle.life) wake.splice(index, 1);
      }
      if (!skilled && wake.length) wake.length = 0;

      context.clearRect(0, 0, width, height);
      if (skilled) drawSkilledWater(context, width, height, time);
      else drawBaselineWater(context, width, height, time);

      if (skilled) drawWake(context, wake);
      drawBuoy(context, width * 0.18, height * 0.28, time, skilled, 0.4);
      drawBuoy(context, width * 0.82, height * 0.68, time, skilled, 2.1);
      drawBoat(context, boat.x * width, boat.y * height, boat.angle, time, skilled);

      context.fillStyle = skilled ? "rgba(232, 255, 245, 0.74)" : "rgba(255, 255, 255, 0.62)";
      context.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
      context.letterSpacing = "1px";
      context.fillText(skilled ? "CRAFTED WATER / LIVE" : "BASIC WATER / LIVE", 18, height - 18);

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const notes = mode === "baseline" ? BASELINE_NOTES : SKILLED_NOTES;

  return (
    <section className="demo-section" aria-labelledby="demo-title">
      <div className="demo-topline">
        <div>
          <span className="eyebrow">LIVE COMPARISON</span>
          <h2 id="demo-title">Basic / crafted</h2>
        </div>
        <p>Use WASD, arrow keys, or drag across the water.</p>
      </div>

      <div className="demo-frame">
        <div className="mode-switch" aria-label="Choose water version">
          <button
            type="button"
            className={mode === "baseline" ? "active" : ""}
            aria-pressed={mode === "baseline"}
            onClick={() => chooseMode("baseline")}
          >
            <span>01</span> BASIC PASS
          </button>
          <button
            type="button"
            className={mode === "skilled" ? "active" : ""}
            aria-pressed={mode === "skilled"}
            onClick={() => chooseMode("skilled")}
          >
            <span>02</span> CRAFTED PASS
          </button>
        </div>
        <div className={`canvas-shell ${mode}`}>
          <canvas
            ref={canvasRef}
            className="water-canvas"
            tabIndex={0}
            aria-label={`${mode === "baseline" ? "Basic" : "Crafted"} animated water demo with a controllable boat`}
          />
          <div className="canvas-corner">PRESS B TO FLIP</div>
        </div>
        <div className="demo-readout" aria-live="polite">
          <strong>{mode === "baseline" ? "Basic implementation" : "Crafted implementation"}</strong>
          <div>
            {notes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
