import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile';
import { reducedMotion } from '../hooks';

// Icon-style collectible card with a pointer-driven holo foil, glitter and
// glare, plus a click-to-flip back face. Light position is written to CSS vars.
export default function HoloCard({ photo }) {
  const root = useRef(null);
  const tilt = useRef(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const el = root.current;
    const t = tilt.current;
    if (!el || !t) return;

    const cur = { x: 50, y: 50 };
    const target = { x: 50, y: 50 };
    let hovering = false;
    let visible = true;
    let raf = 0;
    const still = reducedMotion();

    const paint = () => {
      const dx = cur.x - 50;
      const dy = cur.y - 50;
      t.style.setProperty('--mx', `${cur.x}%`);
      t.style.setProperty('--my', `${cur.y}%`);
      t.style.setProperty('--bgx', `${cur.x}%`);
      t.style.setProperty('--bgy', `${cur.y}%`);
      t.style.setProperty('--rx', `${-dy * 0.28}deg`);
      t.style.setProperty('--ry', `${dx * 0.28}deg`);
      t.style.setProperty('--hyp', Math.min(Math.hypot(dx, dy) / 50, 1).toFixed(3));
    };

    const tick = time => {
      if (!hovering) {
        const s = time / 1000;
        target.x = 50 + 32 * Math.sin(s * 0.7);
        target.y = 50 + 26 * Math.cos(s * 0.9);
      }
      cur.x += (target.x - cur.x) * 0.09;
      cur.y += (target.y - cur.y) * 0.09;
      paint();
      if (visible) raf = requestAnimationFrame(tick);
    };

    const move = e => {
      const r = el.getBoundingClientRect();
      hovering = true;
      target.x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
      target.y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
      t.style.setProperty('--s', '1.04');
    };
    const leave = () => {
      hovering = false;
      t.style.setProperty('--s', '1');
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !still) raf = requestAnimationFrame(tick);
    });
    io.observe(el);

    if (still) paint();
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  const toggle = () => setFlipped(f => !f);
  const onKey = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  const { card } = profile;

  return (
    <div
      className="holo"
      ref={root}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label="Player card. Press to flip."
      onClick={toggle}
      onKeyDown={onKey}
    >
      <div className="holo-shadow" />
      <div className="holo-tilt" ref={tilt}>
        <div className={`holo-rotor ${flipped ? 'flipped' : ''}`}>
          <div className="holo-face front">
            <div className="holo-inner icon-inner">
              <div className="icon-rating">
                <strong>{card.rating}</strong>
                <span>{card.position}</span>
                <small>{card.positionNote}</small>
              </div>
              <div className="icon-photo-wrap">
                <img className="icon-photo" src={photo} alt="Portrait of Aryl Ross Manalo" draggable="false" />
              </div>
              <h3 className="icon-name">{profile.short}</h3>
              <div className="icon-stats">
                {card.stats.map(s => (
                  <div key={s.key}>
                    <span>{s.key}</span>
                    <strong>{s.value}</strong>
                  </div>
                ))}
              </div>
              <div className="icon-badges">
                {card.badges.map(b => (
                  <span key={b}>{b}</span>
                ))}
              </div>
              <div className="holo-foil" />
              <div className="holo-glitter" />
              <div className="holo-glare" />
            </div>
          </div>

          <div className="holo-face back">
            <div className="holo-inner back-inner">
              <span className="label">Loadout</span>
              <h3>{profile.short}</h3>
              <div className="tags">
                {profile.loadout.map(t => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <p>{profile.location}</p>
              <span className="label">Tap to flip back</span>
              <div className="holo-foil" />
              <div className="holo-glare" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
