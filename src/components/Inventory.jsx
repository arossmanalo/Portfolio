import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { inventory } from '../data/inventory';
import { reducedMotion } from '../hooks';
import ScreenHead from './ScreenHead';
import SpotlightCard from './SpotlightCard';

export default function Inventory() {
  const [tab, setTab] = useState(0);
  const [pick, setPick] = useState(0);
  const grid = useRef(null);
  const detail = useRef(null);
  const group = inventory[tab];
  const item = group.items[Math.min(pick, group.items.length - 1)];

  const choose = i => {
    setTab(i);
    setPick(0);
  };

  useEffect(() => {
    if (reducedMotion() || !grid.current) return;
    gsap.fromTo(
      grid.current.children,
      { opacity: 0, y: 14, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.025, ease: 'power3.out' }
    );
  }, [tab]);

  // a new part slides into the detail panel
  useEffect(() => {
    if (reducedMotion() || !detail.current) return undefined;
    const tween = gsap.fromTo(
      detail.current.children,
      { opacity: 0, x: 18 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out', overwrite: true }
    );
    return () => tween.kill();
  }, [item]);

  return (
    <section className="screen" id="inventory">
      <div className="wrap">
        <ScreenHead idx="03" title="The garage" note="Tech stack & skills" />

        <div className="inv" data-reveal>
          <div className="inv-tabs" role="tablist" aria-label="Garage categories">
            {inventory.map((g, i) => (
              <button
                key={g.id}
                role="tab"
                aria-selected={i === tab}
                className={i === tab ? 'on' : ''}
                onClick={() => choose(i)}
              >
                {g.label}
                <small>{g.items.length}</small>
              </button>
            ))}
          </div>

          <div className="inv-body">
            <div className="slots" ref={grid} role="listbox" aria-label={group.label}>
              {group.items.map((it, i) => (
                <SpotlightCard
                  key={it.name}
                  className="slot-card"
                  spotlightColor="rgba(225, 6, 0, 0.55)"
                  intensity={0.5}
                  spotlightSize={170}
                  proximity={70}
                >
                  <button
                    role="option"
                    aria-selected={i === pick}
                    className={`slot ${i === pick ? 'on' : ''}`}
                    onClick={() => setPick(i)}
                    onMouseEnter={() => setPick(i)}
                    onFocus={() => setPick(i)}
                    title={it.name}
                  >
                    <span className="abbr">{it.abbr}</span>
                    <span className="slot-name">{it.name}</span>
                  </button>
                </SpotlightCard>
              ))}
            </div>

            <aside className="panel inv-detail" aria-live="polite">
              <div ref={detail}>
                <span className="label">Part</span>
                <h3>{item.name}</h3>
                <p>{item.note}</p>
                <span className="label">Fitted to</span>
                <div className="tags">
                  {item.usedIn.map(u => (
                    <span className="tag" key={u}>
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
