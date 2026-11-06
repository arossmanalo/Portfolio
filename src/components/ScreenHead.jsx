import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { reducedMotion } from '../hooks';

// Broadcast-style section header. The position block slides on, the title
// wipes in behind it and the chequered strip runs out to the right.
export default function ScreenHead({ idx, title, note }) {
  const root = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
          defaults: { ease: 'power3.out' },
        })
        .from('.idx', { xPercent: -130, opacity: 0, duration: 0.45 })
        .fromTo(
          'h2',
          { clipPath: 'inset(-10% 100% -10% -5%)' },
          { clipPath: 'inset(-10% -5% -10% -5%)', duration: 0.6 },
          '-=0.2'
        )
        .from('small', { opacity: 0, y: 8, duration: 0.35 }, '-=0.3')
        .from('.head-flag', { scaleX: 0, transformOrigin: 'left center', duration: 0.8 }, '-=0.45');
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div className="screen-head" ref={root}>
      <span className="idx">{idx}</span>
      <h2>{title}</h2>
      <small>{note}</small>
      <i className="head-flag" aria-hidden="true" />
    </div>
  );
}
