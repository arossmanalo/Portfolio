import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Projects = () => {
  const { handleHover } = useOutletContext();

  return (
    <section className="section-border" id="projects" onMouseEnter={() => handleHover('PROJECTS')}>
      <h2>// 03. RECENT DEPLOYMENTS (PROJECTS)</h2>
      <div className="projects-grid">
        <div className="project-card">
          <h3 className="project-title">PROJECT ALPHA</h3>
          <p>E-commerce dashboard placeholder.</p>
          <p className="tech-stack">{'> React > Node'}</p>
        </div>
        <div className="project-card">
          <h3 className="project-title">PROJECT BETA</h3>
          <p>Real-time chat system placeholder.</p>
          <p className="tech-stack">{'> Next.js > Socket.io'}</p>
        </div>
      </div>
    </section>
  );
};

export default Projects;
