import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { finePointer, reducedMotion } from '../hooks';

export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    if (!finePointer() || reducedMotion()) return;
    const el = ref.current;
    document.body.classList.add('has-cursor');
    const x = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power3' });

    const move = e => {
      el.style.opacity = 1;
      x(e.clientX);
      y(e.clientY);
      el.classList.toggle('hot', !!e.target.closest('a, button, [data-magnet]'));
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => {
      document.body.classList.remove('has-cursor');
      window.removeEventListener('mousemove', move);
    };
  }, []);

  return <div className="cursor" ref={ref} style={{ opacity: 0 }} aria-hidden="true" />;
}
