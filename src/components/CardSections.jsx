import { useEffect, useRef, useState } from 'react';
import { achievements, sideQuests } from '../data/extras';
import { reducedMotion } from '../hooks';
import ElectricBorder from './ElectricBorder';
import PixelCard from './PixelCard';
import ScreenHead from './ScreenHead';
import SplitFlapText from './SplitFlapText';

const LIVERY = ['#e10600', '#ffffff', '#1e6fd9'];

// Timing-board figure that flips over when it scrolls into view
function FlapFigure({ text }) {
  const root = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSeen(true);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flap" ref={root}>
      {seen && (
        <SplitFlapText
          text={text}
          padTo={text.length}
          loop={false}
          intro={!reducedMotion()}
          fontSize={32}
          gap={3}
          tileRadius={2}
          flipsPerChar={7}
          tileColor="#0e1a30"
          textColor="#f5f8ff"
        />
      )}
    </div>
  );
}

function PodiumCard({ item }) {
  return (
    <article className="panel card">
      <div className="fig">
        <FlapFigure text={item.figure} />
        <span>{item.figureLabel}</span>
      </div>
      <span className="tag rank">{item.rank}</span>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </article>
  );
}

export function Achievements() {
  return (
    <section className="screen" id="wins">
      <div className="wrap">
        <ScreenHead idx="05" title="Podium" note="Achievements" />
        <div className="cards">
          {achievements.map((a, i) => (
            <div className="card-cell" key={a.title} data-reveal>
              {i === 0 ? (
                <ElectricBorder
                  className="card-spark"
                  color="#e10600"
                  borderRadius={0}
                  chaos={0.25}
                  strands={2}
                  thickness={1.2}
                  glow={0.28}
                  intensity={0.5}
                >
                  <PodiumCard item={a} />
                </ElectricBorder>
              ) : (
                <PodiumCard item={a} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SideQuests() {
  return (
    <section className="screen" id="side">
      <div className="wrap">
        <ScreenHead idx="06" title="Sprint races" note="Side projects" />
        <div className="cards">
          {sideQuests.map(s => (
            <div className="card-cell" key={s.title} data-reveal>
              <PixelCard className="sprint" colors={LIVERY} gap={7} speed={30} radius={0} glowColor="#e10600" noFocus intro={false}>
                <a className="panel card" href={s.href} target="_blank" rel="noopener noreferrer">
                  <span className="label">{s.stack}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <span className="label" style={{ color: 'var(--accent)' }}>
                    View repo ↗
                  </span>
                </a>
              </PixelCard>
            </div>
          ))}
        </div>
        <p className="hint" style={{ marginTop: '1.5rem' }} data-reveal>
          Psst. There's a hidden pit stop. ↑ ↑ ↓ ↓ ← → ← → B A
        </p>
      </div>
    </section>
  );
}
