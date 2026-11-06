import { useEffect, useRef } from 'react';
import { finePointer, reducedMotion } from '../hooks';

const TRAIL = 9;
const TARGETS = 'a, button, [data-magnet], [role="tab"], [role="option"]';

// A diamond "ship" with a pixel-chain tail. Over anything clickable it locks
// on like a HUD: four brackets snap to the element's bounds and a tag reads
// the target. Clicking fires a burst of pixels.
export default function Cursor() {
  const core = useRef(null);
  const trail = useRef([]);
  const lock = useRef(null);
  const tag = useRef(null);
  const burst = useRef(null);

  useEffect(() => {
    if (!finePointer() || reducedMotion()) return;
    document.body.classList.add('has-cursor');

    const pos = { x: -100, y: -100 };
    const pts = Array.from({ length: TRAIL }, () => ({ x: -100, y: -100 }));
    const box = { x: 0, y: 0, w: 0, h: 0 };
    const goal = { x: 0, y: 0, w: 0, h: 0 };
    let target = null;
    let seen = false;
    let angle = 0;
    let raf = 0;
    let lastX = 0;

    const label = el => {
      const t = (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').replace(/^\d+\s*/, '').trim();
      const kind = el.tagName === 'A' ? 'LINK' : el.getAttribute('role') === 'option' ? 'ITEM' : 'USE';
      return `${kind} // ${(t || el.tagName).slice(0, 18).toUpperCase()}`;
    };

    const move = e => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!seen) {
        seen = true;
        pts.forEach(p => {
          p.x = pos.x;
          p.y = pos.y;
        });
        core.current.style.opacity = 1;
      }
      const el = e.target.closest?.(TARGETS);
      if (el !== target) {
        target = el;
        if (el) {
          tag.current.textContent = label(el);
          lock.current.classList.add('on');
        } else {
          lock.current.classList.remove('on');
        }
      }
    };

    const down = e => {
      const host = burst.current;
      for (let i = 0; i < 12; i++) {
        const s = document.createElement('i');
        const a = (Math.PI * 2 * i) / 12 + Math.random() * 0.4;
        const d = 22 + Math.random() * 30;
        s.style.left = `${e.clientX}px`;
        s.style.top = `${e.clientY}px`;
        host.appendChild(s);
        s.animate(
          [
            { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(0)`, opacity: 0 },
          ],
          { duration: 480, easing: 'cubic-bezier(.2,.8,.3,1)' }
        ).onfinish = () => s.remove();
      }
      core.current.classList.add('press');
    };
    const up = () => core.current?.classList.remove('press');

    const frame = () => {
      // tail: each segment chases the one in front of it
      let px = pos.x;
      let py = pos.y;
      pts.forEach((p, i) => {
        p.x += (px - p.x) * 0.38;
        p.y += (py - p.y) * 0.38;
        px = p.x;
        py = p.y;
        const el = trail.current[i];
        if (el) el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%,-50%) rotate(45deg) scale(${1 - i / (TRAIL + 2)})`;
      });

      // the diamond leans into its direction of travel
      const vx = pos.x - lastX;
      lastX = pos.x;
      angle += Math.max(-8, Math.min(8, vx)) * 0.9 - angle * 0.2;
      core.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%) rotate(${45 + angle}deg)`;

      // lock-on brackets ease toward the target's rect (or collapse onto the cursor)
      if (target && target.isConnected) {
        const r = target.getBoundingClientRect();
        goal.x = r.left - 6;
        goal.y = r.top - 6;
        goal.w = r.width + 12;
        goal.h = r.height + 12;
      } else {
        goal.x = pos.x - 14;
        goal.y = pos.y - 14;
        goal.w = 28;
        goal.h = 28;
      }
      for (const k of ['x', 'y', 'w', 'h']) box[k] += (goal[k] - box[k]) * 0.25;
      const l = lock.current;
      l.style.transform = `translate(${box.x}px, ${box.y}px)`;
      l.style.width = `${box.w}px`;
      l.style.height = `${box.h}px`;

      raf = requestAnimationFrame(frame);
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', down, { passive: true });
    window.addEventListener('mouseup', up, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, []);

  return (
    <div className="cur" aria-hidden="true">
      {Array.from({ length: TRAIL }, (_, i) => (
        <span key={i} className="cur-tail" ref={el => (trail.current[i] = el)} style={{ opacity: 0.55 - i * 0.05 }} />
      ))}
      <span className="cur-core" ref={core} style={{ opacity: 0 }} />
      <div className="cur-lock" ref={lock}>
        <b /><b /><b /><b />
        <em ref={tag} />
      </div>
      <div className="cur-burst" ref={burst} />
    </div>
  );
}
