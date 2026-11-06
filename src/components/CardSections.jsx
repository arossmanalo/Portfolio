import { achievements, sideQuests } from '../data/extras';

export function Achievements() {
  return (
    <section className="screen" id="wins">
      <div className="wrap">
        <div className="screen-head" data-reveal>
          <span className="idx">05</span>
          <h2>Achievements</h2>
        </div>
        <div className="cards">
          {achievements.map(a => (
            <article className="panel card" key={a.title} data-reveal>
              <div className="fig">
                <strong>{a.figure}</strong>
                <span>{a.figureLabel}</span>
              </div>
              <span className="tag rank">{a.rank}</span>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </article>
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
        <div className="screen-head" data-reveal>
          <span className="idx">06</span>
          <h2>Side quests</h2>
        </div>
        <div className="cards">
          {sideQuests.map(s => (
            <a
              className="panel card"
              key={s.title}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
            >
              <span className="label">{s.stack}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <span className="label" style={{ color: 'var(--accent)' }}>
                View repo ↗
              </span>
            </a>
          ))}
        </div>
        <p className="hint" style={{ marginTop: '1.5rem' }} data-reveal>
          Psst. There's a hidden level. ↑ ↑ ↓ ↓ ← → ← → B A
        </p>
      </div>
    </section>
  );
}
