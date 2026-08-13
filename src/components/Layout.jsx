import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const Layout = () => {
  const [logMessage, setLogMessage] = useState('> [SYS] System online. Waiting for interaction...');

  const handleHover = (section) => {
    setLogMessage(`> [SYS_LOG] Cursor hovering on ${section} section. Fetching detailed metrics...`);
  };

  return (
    <div className="structural-container">
      <div className="spotify-player-sticky">
        <div className="spotify-track-info">
          <div className="spotify-album-art"></div>
          <div className="spotify-track-text">
            <span className="spotify-track-name">Now Playing: System Initialization</span>
            <span className="spotify-artist">Aryl Ross</span>
          </div>
        </div>
        <div className="spotify-controls">
          <button className="spotify-btn" aria-label="Previous Track">⏮</button>
          <button className="spotify-btn" aria-label="Play/Pause">⏸</button>
          <button className="spotify-btn" aria-label="Next Track">⏭</button>
        </div>
        <div className="spotify-actions">
          <span className="spotify-status">♫ Audio Enabled</span>
        </div>
      </div>

      <header className="nav-header">
        <div>[ SYS.STATUS: ONLINE ]</div>
        <nav className="nav-links">
          <NavLink to="/" onMouseEnter={() => handleHover('HOME')} className={({isActive}) => isActive ? 'active-link' : ''}>[HOME]</NavLink>
          <NavLink to="/about" onMouseEnter={() => handleHover('ABOUT')} className={({isActive}) => isActive ? 'active-link' : ''}>[ABOUT]</NavLink>
          <NavLink to="/projects" onMouseEnter={() => handleHover('PROJECTS')} className={({isActive}) => isActive ? 'active-link' : ''}>[PROJECTS]</NavLink>
        </nav>
      </header>

      <main className="main-content" style={{ flexGrow: 1 }}>
        <Outlet context={{ handleHover, setLogMessage }} />
      </main>

      <footer className="sys-log">
        {logMessage}
      </footer>
    </div>
  );
};

export default Layout;
