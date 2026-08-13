import React from 'react';

const About = () => {
  return (
    <section className="about-section" id="about">
      <h2>ABOUT ME</h2>
      
      <div className="about-grid">
        {/* Academic Log */}
        <div className="glass-panel">
          <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.2rem', textTransform: 'uppercase' }}>Academic Background</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card">
              <h4>B.S. in Information Technology</h4>
              <p>Major in Systems Development</p>
              <div className="tags-container">
                <span className="tag">Currently Enrolled</span>
              </div>
            </div>
            <div className="glass-card">
              <h4>University / College Name</h4>
              <p>20XX - 20XX</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Focused on software engineering, UI/UX design, and scalable web architectures.</p>
            </div>
          </div>
        </div>

        {/* Technical Capabilities */}
        <div className="glass-panel">
          <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.2rem', textTransform: 'uppercase' }}>Technical Capabilities</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card">
              <h4>Core Stack</h4>
              <div className="tags-container">
                <span className="tag">React.js</span>
                <span className="tag">Vite</span>
                <span className="tag">TailwindCSS</span>
                <span className="tag">TypeScript</span>
              </div>
            </div>
            
            <div className="glass-card">
              <h4>Infrastructure & Tools</h4>
              <div className="tags-container">
                <span className="tag">Node.js</span>
                <span className="tag">Git</span>
                <span className="tag">Vercel</span>
                <span className="tag">Figma</span>
              </div>
            </div>
            
            <div className="glass-card">
              <h4>Design & UX</h4>
              <div className="tags-container">
                <span className="tag">Wireframing</span>
                <span className="tag">Interaction Design</span>
                <span className="tag">Accessibility</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
