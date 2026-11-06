import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { reducedMotion } from '../hooks';

// One invented circuit per project, in a 320 x 200 frame
const CIRCUITS = [
  'M40 150 L210 150 C250 150 280 130 280 100 C280 70 250 60 225 70 L175 95 C155 105 140 95 140 78 C140 55 120 40 95 45 L60 55 C35 62 25 85 25 110 C25 135 30 150 40 150 Z',
  'M60 40 L240 40 C275 40 295 60 285 90 C278 115 250 115 235 105 C220 95 205 100 200 118 C195 140 215 150 230 160 L120 165 C90 168 80 150 85 130 C90 110 70 105 50 110 C25 115 20 85 30 65 C38 50 45 40 60 40 Z',
  'M30 100 C30 60 70 40 110 50 C150 60 150 90 180 90 C210 90 215 45 250 45 C285 45 295 85 280 115 C265 145 240 135 215 145 C180 158 150 170 100 165 C55 160 30 140 30 100 Z',
  'M50 160 L50 70 C50 45 75 30 100 40 L150 62 C170 70 185 60 195 45 C210 25 250 25 270 45 C290 65 285 95 260 105 L200 130 C180 138 175 155 150 160 Z',
  'M40 60 C70 30 110 30 130 55 C145 75 165 75 185 55 C205 35 250 35 270 60 C290 85 280 120 250 130 C225 138 220 150 200 160 C170 175 130 170 105 155 C85 143 70 145 50 135 C20 120 15 85 40 60 Z',
];

const DRAW = 1.1;
const LAP = 5200; // ms per lap
const TAIL = 46;

// The selected project's circuit draws itself, then a car laps it
export default function CircuitMap({ index }) {
  const svg = useRef(null);
  const line = useRef(null);
  const tail = useRef(null);
  const car = useRef(null);
  const flag = useRef(null);
  const d = CIRCUITS[index % CIRCUITS.length];

  useEffect(() => {
    const path = line.current;
    const length = path.getTotalLength();
    const start = path.getPointAtLength(0);
    const ahead = path.getPointAtLength(3);
    const angle = (Math.atan2(ahead.y - start.y, ahead.x - start.x) * 180) / Math.PI;
    flag.current.setAttribute('transform', `translate(${start.x} ${start.y}) rotate(${angle})`);

    const place = at => {
      const p = path.getPointAtLength(at);
      car.current.setAttribute('cx', p.x);
      car.current.setAttribute('cy', p.y);
      tail.current.style.strokeDasharray = `${TAIL} ${length - TAIL}`;
      tail.current.style.strokeDashoffset = `${TAIL - at}`;
    };

    if (reducedMotion()) {
      place(0);
      return undefined;
    }

    path.style.strokeDasharray = `${length}`;
    const draw = gsap.fromTo(path, { strokeDashoffset: length }, { strokeDashoffset: 0, duration: DRAW, ease: 'power2.inOut' });
    tail.current.style.opacity = 0;
    car.current.style.opacity = 0;

    let raf = 0;
    let visible = true;
    const began = performance.now() + DRAW * 1000;
    const tick = now => {
      raf = 0;
      if (now >= began) {
        tail.current.style.opacity = 1;
        car.current.style.opacity = 1;
        place((((now - began) % LAP) / LAP) * length);
      }
      if (visible) raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    observer.observe(svg.current);

    return () => {
      draw.kill();
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [index]);

  return (
    <svg className="circuit" ref={svg} viewBox="0 0 320 200" aria-hidden="true">
      <path className="circuit-bed" d={d} />
      <path className="circuit-line" ref={line} d={d} />
      <path className="circuit-tail" ref={tail} d={d} />
      <g ref={flag}>
        <rect x="-2" y="-9" width="4" height="18" fill="#fff" />
        <rect x="-2" y="-9" width="2" height="4.5" fill="#101014" />
        <rect x="0" y="-4.5" width="2" height="4.5" fill="#101014" />
        <rect x="-2" y="0" width="2" height="4.5" fill="#101014" />
        <rect x="0" y="4.5" width="2" height="4.5" fill="#101014" />
      </g>
      <circle className="circuit-car" ref={car} r="5" />
    </svg>
  );
}
