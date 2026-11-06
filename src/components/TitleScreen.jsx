import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import profilePic from '../assets/profile.webp';
import { profile } from '../data/profile';
import { reducedMotion } from '../hooks';
import Magnetic from './Magnetic';
import HoloCard from './HoloCard';

export default function TitleScreen() {
  const root = useRef(null);

  // boot-up sequence
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero .kicker', { opacity: 0, x: -24, duration: 0.5 })
        .from('.hero h1', { opacity: 0, y: 40, duration: 0.8 }, '-=0.2')
        .from('.hero .lede, .hero .cta-row, .hero .press', { opacity: 0, y: 20, duration: 0.6, stagger: 0.12 }, '-=0.4')
        .from('.char-card', { opacity: 0, scale: 0.92, rotate: 3, duration: 0.9 }, 0.3);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero screen" id="start" ref={root}>
      <div className="wrap hero-grid">
        <div>
          <p className="kicker">&gt; PLAYER_ONE // {profile.location}</p>
          <h1>
            Hi, I'm
            <br />
            {profile.short}.
          </h1>
          <p className="lede">
            {profile.tagline} I'm a 3rd-year BSIT student at De La Salle Lipa and a member of the ITEQS team at JPCS DLSL.
          </p>
          <div className="cta-row">
            <Magnetic>
              <a className="btn solid" href="#quests">
                See my work
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn" href="#contact">
                Say hello
              </a>
            </Magnetic>
          </div>
          <p className="press">▶ PRESS 1–7 TO JUMP · SCROLL TO CONTINUE</p>
        </div>

        <HoloCard photo={profilePic} />
      </div>
    </section>
  );
}
