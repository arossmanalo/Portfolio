import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { projects } from '../data/projects';
import { reducedMotion } from '../hooks';
import CircuitMap from './CircuitMap';
import ScreenHead from './ScreenHead';

export default function QuestLog() {
  const [index, setIndex] = useState(0);
  const detail = useRef(null);
  const section = useRef(null);
  const quest = projects[index];

  useEffect(() => {
    if (reducedMotion() || !detail.current) return;
    gsap.fromTo(
      detail.current.children,
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.45, stagger: 0.07, ease: 'power3.out' }
    );
  }, [index]);

  // arrow keys / W-S move through races while this screen is in view
  useEffect(() => {
    const onKey = e => {
      const r = section.current?.getBoundingClientRect();
      if (!r || r.top > window.innerHeight * 0.6 || r.bottom < window.innerHeight * 0.4) return;
      if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        setIndex(i => (i + 1) % projects.length);
      } else if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        setIndex(i => (i - 1 + projects.length) % projects.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section className="screen" id="quests" ref={section}>
      <div className="wrap">
        <ScreenHead idx="04" title="Grand Prix" note="Projects" />
        <div className="quest-grid" data-reveal>
          <div>
            <div className="quest-list" role="tablist" aria-label="Projects">
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={i === index}
                  className={`quest-item ${i === index ? 'on' : ''}`}
                  onClick={() => setIndex(i)}
                >
                  <small>{i + 1}</small>
                  {p.title}
                </button>
              ))}
            </div>
            <p className="hint">↑ ↓ / W S to browse races</p>
          </div>

          <div className="panel quest-detail" role="tabpanel">
            <div className="quest-copy" ref={detail}>
              <span className="label">{quest.tag}</span>
              <h3>{quest.title}</h3>
              <p>{quest.summary}</p>
              <div className="tags">
                {quest.stack.map(s => (
                  <span className="tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
              <div className="row">
                {quest.links.map((l, i) => (
                  <a
                    key={l.href}
                    className={`btn ${i === 0 ? 'solid' : ''}`}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
            <CircuitMap index={index} />
          </div>
        </div>
      </div>
    </section>
  );
}
