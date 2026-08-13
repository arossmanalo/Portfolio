import React from 'react';
import { useOutletContext } from 'react-router-dom';

const About = () => {
  const { handleHover } = useOutletContext();

  return (
    <section className="section-border" id="about" onMouseEnter={() => handleHover('ABOUT')}>
      <h2>// 02. ABOUT (BACKGROUND & CAPABILITIES)</h2>
      
      {/* Academic Log */}
      <div className="about-subsection">
        <h3 className="subsection-title">ACADEMIC LOG</h3>
        <div className="academic-log">
          <div className="academic-item">
            <h4 className="category-title">[ DEGREE / CERTIFICATION ]</h4>
            <p className="project-title">{'> B.S. in Information Technology'}</p>
            <p>- Major in Systems Development</p>
          </div>
          <div className="academic-item">
            <h4 className="category-title">[ INSTITUTION & TIMELINE ]</h4>
            <p className="project-title">{'> University / College Name'}</p>
            <p>[ 20XX - 20XX ]</p>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="about-subsection" style={{ marginTop: '3rem' }}>
        <h3 className="subsection-title">TECHNICAL CAPABILITIES</h3>
        <div className="skills-grid">
          <div className="skill-category">
            <h4 className="category-title">[ CORE STACK ]</h4>
            <div className="skill-item">
              <span>REACT.JS</span>
              <div className="progress-bar-container"><div className="progress-bar-fill" style={{width: '90%'}}></div></div>
            </div>
            <div className="skill-item">
              <span>VITE</span>
              <div className="progress-bar-container"><div className="progress-bar-fill" style={{width: '95%'}}></div></div>
            </div>
            <div className="skill-item">
              <span>TAILWINDCSS</span>
              <div className="progress-bar-container"><div className="progress-bar-fill" style={{width: '100%'}}></div></div>
            </div>
            <div className="skill-item">
              <span>TYPESCRIPT</span>
              <div className="progress-bar-container"><div className="progress-bar-fill" style={{width: '75%'}}></div></div>
            </div>
          </div>

          <div className="skill-category">
            <h4 className="category-title">[ INFRASTRUCTURE & TOOLS ]</h4>
            <div className="skill-item">
              <span>NODE.JS</span>
              <div className="progress-bar-container"><div className="progress-bar-fill" style={{width: '80%'}}></div></div>
            </div>
            <div className="skill-item">
              <span>GIT VERSIONING</span>
              <div className="progress-bar-container"><div className="progress-bar-fill" style={{width: '85%'}}></div></div>
            </div>
            <div className="skill-item">
              <span>VERCEL</span>
              <div className="progress-bar-container"><div className="progress-bar-fill" style={{width: '90%'}}></div></div>
            </div>
            <div className="skill-item">
              <span>LINUX / BASH</span>
              <div className="progress-bar-container"><div className="progress-bar-fill" style={{width: '70%'}}></div></div>
            </div>
          </div>

          <div className="skill-category">
            <h4 className="category-title">[ DESIGN & UX ]</h4>
            <div className="skill-item">
              <span>WIREFRAMING</span>
              <div className="progress-bar-container"><div className="progress-bar-fill" style={{width: '85%'}}></div></div>
            </div>
            <div className="skill-item">
              <span>ACCESSIBILITY</span>
              <div className="progress-bar-container"><div className="progress-bar-fill" style={{width: '90%'}}></div></div>
            </div>
            <div className="skill-item">
              <span>INTERACTION DESIGN</span>
              <div className="progress-bar-container"><div className="progress-bar-fill" style={{width: '80%'}}></div></div>
            </div>
          </div>

          <div className="skill-category">
            <h4 className="category-title">[ CURRENTLY EXPLORING ]</h4>
            <div className="skill-item">
              <span>WebGL / Three.js</span>
            </div>
            <div className="skill-item">
              <span>LLM Integration</span>
            </div>
            <div className="skill-item">
              <span>Rust (WASM)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
