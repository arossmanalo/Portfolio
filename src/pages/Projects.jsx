import React from 'react';

const Projects = () => {
  return (
    <section className="about-section" id="projects">
      <h2>RECENT DEPLOYMENTS</h2>
      
      <div className="about-grid">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ width: '100%', height: '180px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ opacity: 0.5 }}>Image Placeholder</span>
          </div>
          <h3 style={{ color: 'var(--primary)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>Project Alpha</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>A modern e-commerce dashboard featuring real-time analytics and inventory management.</p>
          <div className="tags-container">
            <span className="tag">React</span>
            <span className="tag">Node.js</span>
            <span className="tag">MongoDB</span>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ width: '100%', height: '180px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ opacity: 0.5 }}>Image Placeholder</span>
          </div>
          <h3 style={{ color: 'var(--primary)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>Project Beta</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Real-time chat application with WebSockets, tailored for seamless team collaboration.</p>
          <div className="tags-container">
            <span className="tag">Next.js</span>
            <span className="tag">Socket.io</span>
            <span className="tag">Tailwind</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
