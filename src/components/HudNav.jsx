import { useEffect, useState } from 'react';
import { sections } from '../data/extras';

export default function HudNav() {
  const [active, setActive] = useState('start');

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // number keys jump between screens
  useEffect(() => {
    const onKey = e => {
      if (e.target.closest?.('input, textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
      const i = Number(e.key) - 1;
      if (i >= 0 && i < sections.length) {
        document.getElementById(sections[i].id)?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <nav className="nav" aria-label="Main navigation">
      {sections.map((s, i) => (
        <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'on' : ''}>
          <kbd>{i + 1}</kbd>
          {s.label}
        </a>
      ))}
    </nav>
  );
}
