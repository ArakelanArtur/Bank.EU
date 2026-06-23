'use client';

import { useEffect, useRef } from 'react';

const COUNT = 60;

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext('2d')!;

    let dots: Dot[] = [];
    let animId = 0;

    function resize() {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    }

    function initDots() {
      dots = Array.from({ length: COUNT }, () => ({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        vx: -0.2 + Math.random() * 0.4,
        vy: -0.2 + Math.random() * 0.4,
      }));
    }

    resize();
    initDots();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);

      for (let i = 0; i < COUNT; i++) {
        const d = dots[i];
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < 0) d.x = c.width;
        if (d.x > c.width) d.x = 0;
        if (d.y < 0) d.y = c.height;
        if (d.y > c.height) d.y = 0;
      }

      for (let i = 0; i < COUNT; i++) {
        const neighbors = dots
          .map((d, idx) => ({ idx, dist: Math.hypot(d.x - dots[i].x, d.y - dots[i].y) }))
          .filter((d) => d.idx !== i)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 3);

        for (const n of neighbors) {
          if (n.idx <= i) continue;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[n.idx].x, dots[n.idx].y);
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
