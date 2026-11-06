import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { profile } from '../data/profile';
import { reducedMotion } from '../hooks';

function Ticker() {
  const track = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const el = track.current;
    const tween = gsap.to(el, {
      x: () => -el.scrollWidth / 2,
      duration: 28,
      ease: 'none',
      repeat: -1,
    });
    return () => tween.kill();
  }, []);

  const items = [...profile.loadout, ...profile.loadout];
  return (
    <div className="ticker" aria-label="Tools I use">
      <div className="ticker-track" ref={track}>
        {items.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <section className="screen" id="profile">
      <div className="wrap">
        <div className="screen-head" data-reveal>
          <span className="idx">02</span>
          <h2>Player profile</h2>
        </div>
        <div className="profile-grid">
          <div className="panel" data-reveal>
            <p className="label" style={{ marginBottom: '1rem' }}>
              About me
            </p>
            {profile.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="panel" data-reveal>
            <p className="label" style={{ marginBottom: '0.5rem' }}>
              Focus
            </p>
            {profile.focus.map(f => (
              <div className="focus-row" key={f.label}>
                <span>{f.label}</span>
                <span>{f.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Ticker />
    </section>
  );
}
