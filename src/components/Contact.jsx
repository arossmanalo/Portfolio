import { profile } from '../data/profile';
import { useToast } from '../hooks';
import Magnetic from './Magnetic';

export default function Contact() {
  const [toast, setToast] = useToast();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setToast('Email copied to clipboard');
    } catch {
      setToast(profile.email);
    }
  };

  return (
    <section className="screen" id="contact">
      <div className="wrap">
        <div className="screen-head" data-reveal>
          <span className="idx">07</span>
          <h2>Continue?</h2>
        </div>
        <div className="panel contact-panel" data-reveal>
          <h3>Let's build something</h3>
          <p>Open to internships, collaborations and projects. I'd love to hear from you.</p>
          <div className="cta-row">
            <Magnetic>
              <button className="btn solid" onClick={copyEmail}>
                Copy email
              </button>
            </Magnetic>
            <Magnetic>
              <a className="btn" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn" href={profile.links.github} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn" href={profile.links.resume} download>
                Resume ↓
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
      <footer>© {new Date().getFullYear()} {profile.name} · Built with React &amp; GSAP</footer>
      {toast && <div className="toast" role="status">{toast}</div>}
    </section>
  );
}
