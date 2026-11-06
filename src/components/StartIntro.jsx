import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile';
import { projects } from '../data/projects';

const LIGHTS = 5;
const LIGHT_GAP = 420;
const LEDS = 15;
const LAUNCH = 750;
const WIPE = 900;
const TYRES = ['FL', 'FR', 'RL', 'RR'];

const statusFor = (lit, out) => {
  if (out) return 'Lights out';
  if (lit === LIGHTS) return 'Hold';
  return lit ? 'Engine up' : 'Grid ready';
};

// Top-down race car, drawn for this site. It lies on the track plane, so the
// perspective turns it into a chase-camera view.
function Car() {
  return (
    <svg className="intro-car-art" viewBox="0 0 200 460" aria-hidden="true">
      <g fill="#101014">
        <rect x="14" y="78" width="34" height="74" rx="7" />
        <rect x="152" y="78" width="34" height="74" rx="7" />
        <rect x="6" y="322" width="44" height="86" rx="8" />
        <rect x="150" y="322" width="44" height="86" rx="8" />
      </g>
      <path d="M10 42h180l-8 24H18z" fill="#e10600" />
      <path d="M10 42h180v7H10z" fill="#fff" />
      <path d="M90 8h20l10 150H80z" fill="#e10600" />
      <path d="M96 8h8l4 150H92z" fill="#8b5cf6" />
      <path d="M78 150h44l10 44 28 22 6 92-30 70H64l-30-70 6-92 28-22z" fill="#e10600" />
      <path d="M40 232l28-16 6 88-34 8zM160 232l-28-16-6 88 34 8z" fill="#8f0400" />
      <path d="M92 196h16l5 190H87z" fill="#8b5cf6" />
      <ellipse cx="100" cy="232" rx="17" ry="34" fill="#08080b" />
      <path d="M100 176c-16 0-22 22-22 40h7c0-14 5-31 15-31s15 17 15 31h7c0-18-6-40-22-40z" fill="#26262c" />
      <rect x="20" y="404" width="160" height="32" rx="3" fill="#e10600" />
      <rect x="20" y="404" width="160" height="7" fill="#fff" />
      <rect x="10" y="396" width="12" height="48" fill="#17171c" />
      <rect x="178" y="396" width="12" height="48" fill="#17171c" />
      <circle cx="100" cy="448" r="7" fill="#ff2a1f" />
    </svg>
  );
}

// Full-screen race start on a starting grid. Each red light brings a project
// onto the timing tower and climbs the shift lights; the gantry holds for a
// random beat like the real thing, then the car launches and a diagonal wipe
// hands over to the hero. Any key or tap skips it.
export default function StartIntro({ onLaunch, onDone }) {
  const [lit, setLit] = useState(0);
  const [out, setOut] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const rpm = useRef(null);
  const speed = useRef(null);
  const stage = useRef({ lit: 0, out: false, kmh: 0 });

  useEffect(() => {
    stage.current.lit = lit;
    stage.current.out = out;
  }, [lit, out]);

  useEffect(() => {
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';

    let left = false;
    let exit = 0;
    const start = 300;
    const hold = 300 + Math.random() * 500;
    const dark = start + LIGHTS * LIGHT_GAP + hold;

    const leave = () => {
      if (left) return;
      left = true;
      timers.forEach(clearTimeout);
      setLeaving(true);
      onLaunch();
      exit = setTimeout(onDone, WIPE);
    };

    const timers = Array.from({ length: LIGHTS }, (_, i) =>
      setTimeout(() => setLit(i + 1), start + i * LIGHT_GAP)
    );
    timers.push(setTimeout(() => setOut(true), dark), setTimeout(leave, dark + LAUNCH));

    // simulated telemetry; written straight to the DOM to skip re-renders
    const gauges = setInterval(() => {
      const s = stage.current;
      const base = s.out ? 11800 : 4200 + s.lit * 1450;
      if (rpm.current) rpm.current.textContent = Math.round(base + Math.random() * 260).toLocaleString('en-US');
      if (s.out) s.kmh = Math.min(s.kmh + 16, 212);
      if (speed.current) speed.current.textContent = s.kmh;
    }, 70);

    window.addEventListener('keydown', leave);
    window.addEventListener('pointerdown', leave);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(exit);
      clearInterval(gauges);
      root.style.overflow = overflow;
      window.removeEventListener('keydown', leave);
      window.removeEventListener('pointerdown', leave);
    };
  }, [onLaunch, onDone]);

  const revs = out ? LEDS : lit * (LEDS / LIGHTS);
  const hold = lit === LIGHTS && !out;

  return (
    <div className={`intro-shell ${leaving ? 'leaving' : ''}`} role="status" aria-label="Opening intro">
      <div
        className={`intro ${lit ? 'running' : ''} ${hold ? 'limit' : ''} ${out ? 'launch' : ''}`}
        style={{ '--lit': out ? 0 : lit / LIGHTS }}
      >
        <div className="intro-sky" />

        <div className="intro-scene">
          <div className="intro-road">
            <i className="kerb l" />
            <i className="kerb r" />
            <i className="intro-dash" />
            {[0, 1, 2, 3, 4].map(i => (
              <i key={i} className={`grid-slot s${i}`} />
            ))}
            <div className="intro-car">
              <i className="intro-car-shadow" />
              <i className="smoke l" />
              <i className="smoke r" />
              <Car />
            </div>
          </div>
        </div>

        <div className="intro-glow" />
        <div className="intro-streaks" />

        <header className="intro-top">
          <p className="plate">
            <b>{profile.card.position}</b>
            <span>{profile.name}</span>
          </p>
          <p className="intro-event">Portfolio Grand Prix</p>
        </header>

        <div className="intro-gantry" aria-hidden="true">
          {Array.from({ length: LIGHTS }, (_, i) => (
            <span key={i} className={`light ${!out && lit > i ? 'on' : ''}`}>
              <i />
              <i />
            </span>
          ))}
        </div>

        <aside className="intro-tower" aria-hidden="true">
          <h2>Starting grid</h2>
          <ol>
            {projects.slice(0, LIGHTS).map((p, i) => (
              <li key={p.id} className={lit > i || out ? 'on' : ''}>
                <b>{i + 1}</b>
                <span>{p.title}</span>
                <i />
              </li>
            ))}
          </ol>
        </aside>

        <aside className="intro-telemetry" aria-hidden="true">
          <h2>Telemetry</h2>
          <p className="tele-rpm">
            <strong ref={rpm}>4,200</strong>
            <span>RPM</span>
          </p>
          <div className="tele-bar thr">
            <span>THR</span>
            <i />
          </div>
          <div className="tele-bar brk">
            <span>BRK</span>
            <i />
          </div>
          <div className="tele-tyres">
            {TYRES.map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </aside>

        <div className="intro-wheel" aria-hidden="true">
          <div className={`rev ${hold ? 'limit' : ''}`}>
            {Array.from({ length: LEDS }, (_, i) => (
              <i key={i} className={i < revs ? 'on' : ''} />
            ))}
          </div>
          <div className="wheel-read">
            <p>
              <strong ref={speed}>0</strong>
              <span>KM/H</span>
            </p>
            <b>{out ? '1' : 'N'}</b>
            <p className="wheel-status">{statusFor(lit, out)}</p>
          </div>
        </div>

        <p className="intro-skip">Tap or press any key to skip</p>
        <div className="hero-checker" />
      </div>
      <i className="intro-band a" />
      <i className="intro-band b" />
    </div>
  );
}
