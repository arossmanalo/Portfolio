import { useCallback, useEffect, useRef, useState } from 'react';

const ROUND = 60;
const KEY = 'aryl-whack-best';

const readBest = () => {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
};

export default function WhackGame({ onClose }) {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(ROUND);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(readBest);
  const [active, setActive] = useState(-1);
  const scoreRef = useRef(0);

  const start = useCallback(() => {
    scoreRef.current = 0;
    setScore(0);
    setTime(ROUND);
    setRunning(true);
  }, []);

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (!running) return;
    const clock = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          setRunning(false);
          setActive(-1);
          if (scoreRef.current > readBest()) {
            try {
              localStorage.setItem(KEY, String(scoreRef.current));
            } catch {
              /* storage unavailable */
            }
            setBest(scoreRef.current);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    const mole = setInterval(() => setActive(Math.floor(Math.random() * 9)), 650);
    return () => {
      clearInterval(clock);
      clearInterval(mole);
    };
  }, [running]);

  const whack = i => {
    if (!running || i !== active) return;
    scoreRef.current += 1;
    setScore(scoreRef.current);
    setActive(-1);
  };

  return (
    <div className="game-overlay" role="dialog" aria-modal="true" aria-label="Hidden level: Whack">
      <div className="panel game-box">
        <h3>Hidden level unlocked</h3>
        <p className="label">Whack as many as you can in {ROUND}s</p>
        <div className="game-hud">
          <span>TIME {time}</span>
          <span>SCORE {score}</span>
          <span>BEST {best}</span>
        </div>
        <div className="holes">
          {Array.from({ length: 9 }, (_, i) => (
            <button
              key={i}
              className={`hole ${i === active ? 'up' : ''}`}
              onClick={() => whack(i)}
              aria-label={i === active ? 'Target' : 'Empty hole'}
            >
              {i === active ? '🟣' : ''}
            </button>
          ))}
        </div>
        <div className="cta-row" style={{ justifyContent: 'center' }}>
          <button className="btn solid" onClick={start} disabled={running}>
            {time === 0 ? 'Play again' : 'Start'}
          </button>
          <button className="btn" onClick={onClose}>
            Exit (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
