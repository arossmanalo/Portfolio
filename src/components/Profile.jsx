import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { profile } from '../data/profile';
import { reducedMotion } from '../hooks';
import ScreenHead from './ScreenHead';
import ScrollReveal from './ScrollReveal';
import ScrollVelocity from './ScrollVelocity';

const tools = `${profile.loadout.join('  //  ')}  //  `;

export default function Profile() {
  const tower = useRef(null);

  // the programme comes onto the tower one row at a time
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.focus-row', {
        x: -46,
        opacity: 0,
        duration: 0.55,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: tower.current, start: 'top 75%', once: true },
      });
    }, tower);
    return () => ctx.revert();
  }, []);

  return (
    <section className="screen" id="profile">
      <div className="wrap">
        <ScreenHead idx="02" title="Driver profile" note="About me" />
        <div className="profile-grid">
          <div className="panel" data-reveal>
            <p className="label" style={{ marginBottom: '1rem' }}>
              About me
            </p>
            {profile.bio.map(p => (
              <ScrollReveal
                key={p}
                baseOpacity={0.16}
                baseRotation={0}
                enableBlur={false}
                containerClassName="bio"
                textClassName="bio-text"
                wordAnimationEnd="center 45%"
              >
                {p}
              </ScrollReveal>
            ))}
          </div>
          <div className="panel" ref={tower} data-reveal>
            <p className="label" style={{ marginBottom: '0.5rem' }}>
              Race programme
            </p>
            {profile.focus.map((f, i) => (
              <div className="focus-row" key={f.label}>
                <b>{i + 1}</b>
                <span>{f.label}</span>
                <span>{f.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ticker" aria-label={`Tools I use: ${profile.loadout.join(', ')}`}>
        <ScrollVelocity texts={[tools, tools]} velocity={45} numCopies={4} outlineAlternate skewWithVelocity={8} />
      </div>
    </section>
  );
}
