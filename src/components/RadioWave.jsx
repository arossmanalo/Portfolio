import { useEffect, useRef } from 'react';
import { reducedMotion } from '../hooks';

const BAR = 3;
const GAP = 3;

// Voice-style waveform for the team radio panel, drawn only while on screen
export default function RadioWave() {
  const canvas = useRef(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el.getContext('2d');
    if (!ctx) return undefined;
    const still = reducedMotion();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let visible = false;

    const draw = now => {
      const t = now / 1000;
      const count = Math.floor(width / (BAR + GAP));
      const speech = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.3) * Math.sin(t * 0.7 + 1));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < count; i++) {
        const middle = 1 - Math.abs(i / (count - 1) - 0.5) * 2;
        const voice = Math.abs(Math.sin(i * 0.37 + t * 6) * Math.sin(i * 0.13 - t * 3.1));
        const size = Math.max(3, (0.08 + voice * speech * middle) * height);
        ctx.fillStyle = middle > 0.62 ? '#e10600' : middle > 0.34 ? '#f5f8ff' : '#5aaeff';
        ctx.globalAlpha = 0.35 + middle * 0.65;
        ctx.fillRect(i * (BAR + GAP), (height - size) / 2, BAR, size);
      }
      ctx.globalAlpha = 1;
    };

    const tick = now => {
      raf = 0;
      draw(now);
      if (visible && !still) raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      width = el.clientWidth;
      height = el.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      draw(1800);
    };

    const sizing = new ResizeObserver(resize);
    sizing.observe(el);
    const watching = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    watching.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      sizing.disconnect();
      watching.disconnect();
    };
  }, []);

  return <canvas className="radio-wave" ref={canvas} aria-hidden="true" />;
}
