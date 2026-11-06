import { useEffect, useRef, useState } from 'react';

const LIGHTS = 5;
const LIGHT_GAP = 340;
const FADE = 800;

// Five reds over the globe, a random hold like the real thing, then lights out:
// the car races from Monza around the world, stops on the line at Lipa and the
// camera lands on the hero. Any key or tap skips it.
export default function StartIntro({ onLaunch, onDone }) {
  const canvas = useRef(null);
  const [lit, setLit] = useState(0);
  const [out, setOut] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [place, setPlace] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';

    let race = null;
    let cancelled = false;
    let left = false;
    let exit = 0;
    const timers = [];

    const leave = () => {
      if (left) return;
      left = true;
      timers.forEach(clearTimeout);
      setLeaving(true);
      onLaunch();
      exit = setTimeout(onDone, FADE);
    };

    const countdown = () => {
      const start = 350;
      const dark = start + LIGHTS * LIGHT_GAP + 200 + Math.random() * 500;
      for (let i = 0; i < LIGHTS; i++) {
        timers.push(setTimeout(() => setLit(i + 1), start + i * LIGHT_GAP));
      }
      timers.push(
        setTimeout(() => {
          setOut(true);
          race.start();
        }, dark)
      );
    };

    import('./globeRace')
      .then(({ createGlobeRace }) => {
        if (cancelled || left) return;
        race = createGlobeRace({ canvas: canvas.current, onStop: setPlace, onLand: leave });
        countdown();
      })
      .catch(leave); // no WebGL: go straight to the hero

    window.addEventListener('keydown', leave);
    window.addEventListener('pointerdown', leave);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      clearTimeout(exit);
      race?.dispose();
      root.style.overflow = overflow;
      window.removeEventListener('keydown', leave);
      window.removeEventListener('pointerdown', leave);
    };
  }, [onLaunch, onDone]);

  return (
    <div className={`intro-shell ${leaving ? 'leaving' : ''}`} role="status" aria-label="Opening intro">
      <canvas className="intro-canvas" ref={canvas} />

      <div className={`intro-gantry ${out ? 'out' : ''}`} aria-hidden="true">
        {Array.from({ length: LIGHTS }, (_, i) => (
          <span key={i} className={`light ${!out && lit > i ? 'on' : ''}`}>
            <i />
            <i />
          </span>
        ))}
      </div>

      {place && (
        <p className="intro-place" key={place}>
          {place}
        </p>
      )}
      <p className="intro-skip">Tap or press any key to skip</p>
    </div>
  );
}
