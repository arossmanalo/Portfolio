import { useEffect, useRef, useState } from 'react';
import { sections } from '../data/extras';

// Page scroll shown as one lap: a small car drives along the bottom edge and
// each section is a sector marker.
export default function LapTracker() {
  const car = useRef(null);
  const fill = useRef(null);
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    let raf = 0;

    const paint = () => {
      raf = 0;
      const room = document.documentElement.scrollHeight - window.innerHeight;
      const progress = room > 0 ? Math.min(1, window.scrollY / room) : 0;
      if (fill.current) fill.current.style.transform = `scaleX(${progress})`;
      if (car.current) car.current.style.left = `${progress * 100}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const measure = () => {
      const room = document.documentElement.scrollHeight - window.innerHeight;
      if (room <= 0) return;
      setMarks(
        sections
          .slice(1)
          .map(s => document.getElementById(s.id))
          .filter(Boolean)
          .map(el => Math.min(100, (el.offsetTop / room) * 100))
      );
      onScroll();
    };

    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    measure();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="lap" aria-hidden="true">
      <i className="lap-fill" ref={fill} />
      {marks.map(m => (
        <i className="lap-mark" key={m} style={{ left: `${m}%` }} />
      ))}
      <svg className="lap-car" ref={car} viewBox="0 0 46 18">
        <path d="M0 3h5v12H0zM41 5h5v8h-5z" fill="#f5f8ff" />
        <path d="M5 7l11-2 6-3h6l3 3 11 3v2l-11 3-3 3h-6l-6-3-11-2z" fill="#e10600" />
        <rect x="9" y="0" width="7" height="3" fill="#101014" />
        <rect x="9" y="15" width="7" height="3" fill="#101014" />
        <rect x="29" y="0" width="7" height="3" fill="#101014" />
        <rect x="29" y="15" width="7" height="3" fill="#101014" />
      </svg>
    </div>
  );
}
