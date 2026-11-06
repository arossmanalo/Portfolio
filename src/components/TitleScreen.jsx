import { Component, Suspense, lazy, useEffect, useState } from 'react';
import profilePic from '../assets/profile.webp';
import { sectors } from '../data/extras';
import { profile } from '../data/profile';
import { reducedMotion } from '../hooks';
import TechText from './TechText';
import HoloCard from './HoloCard';

// three.js is heavy, so the track loads in its own chunk after first paint
const Hyperspeed = lazy(() => import('./Hyperspeed'));

const LIGHTS = 5;
const LIGHT_GAP = 300;
const TAIL_LIGHTS = ['#ff2800', '#e10600', '#ff5a1f'];
const HEAD_LIGHTS = ['#c084fc', '#8b5cf6', '#ffffff'];
const POLES = ['#e10600'];

// the hero should survive a browser without WebGL
class TrackBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const wordmark = {
  fontFamily: "'Chakra Petch', sans-serif",
  fontWeight: 'italic 700', // goes straight into the canvas font string
  fontSize: 240,
  letterSpacing: -0.02,
  align: 'left',
  accentColor: '#C084FC',
  intro: 'assemble',
  introDuration: 1.3,
};

export default function TitleScreen() {
  const [still] = useState(reducedMotion);
  const [lit, setLit] = useState(0);
  const [go, setGo] = useState(still);
  const [boost, setBoost] = useState(false);

  // five reds, then lights out: the track launches and the name assembles
  useEffect(() => {
    if (still) return undefined;
    const start = 400;
    const out = start + LIGHTS * LIGHT_GAP + 450;
    const timers = Array.from({ length: LIGHTS }, (_, i) =>
      setTimeout(() => setLit(i + 1), start + i * LIGHT_GAP)
    );
    timers.push(
      setTimeout(() => {
        setGo(true);
        setBoost(true);
      }, out),
      setTimeout(() => setBoost(false), out + 1500)
    );
    return () => timers.forEach(clearTimeout);
  }, [still]);

  return (
    <section className={`hero screen ${go ? 'go' : ''}`} id="start">
      <div className="hero-track">
        <TrackBoundary>
          <Suspense fallback={null}>
            <Hyperspeed
              curve="racing"
              speed={go ? 1 : 0.1}
              boosting={boost}
              density={44}
              glow={0.8}
              tailColors={TAIL_LIGHTS}
              headColors={HEAD_LIGHTS}
              poleColors={POLES}
              roadColor="#0d0812"
              lineColor="#3a2a4d"
            />
          </Suspense>
        </TrackBoundary>
      </div>
      <div className="hero-scrim" />
      <div className="hero-livery" />

      {!still && (
        <div className="lights" aria-hidden="true">
          {Array.from({ length: LIGHTS }, (_, i) => (
            <span key={i} className={`light ${!go && lit > i ? 'on' : ''}`}>
              <i />
              <i />
            </span>
          ))}
        </div>
      )}

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 className="sr-only">{profile.name}</h1>
          <p className="plate hero-rise">
            <b>{profile.card.position}</b>
            <span>{profile.card.positionNote}</span>
          </p>

          <div className="hero-name" aria-hidden="true">
            {go && (
              <>
                <div className="hero-line">
                  <TechText {...wordmark} text="ARYL" color="#F4EEFF" />
                </div>
                <div className="hero-line">
                  <TechText {...wordmark} text="ROSS" color="#FF2A1F" sweep={false} />
                </div>
              </>
            )}
          </div>

          <dl className="sectors hero-rise">
            {sectors.map(s => (
              <div className={`sector ${s.tone}`} key={s.id}>
                <dt>{s.id}</dt>
                <dd>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="hero-hint hero-rise">Hold the track to boost</p>
        </div>

        <div className="hero-card hero-rise">
          <HoloCard photo={profilePic} />
        </div>
      </div>

      <div className="hero-checker" />
    </section>
  );
}
