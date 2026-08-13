import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BubbleMenu from './BubbleMenu';
import Beams from './Beams';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="structural-container">
      {/* Background Beams */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#c084fc"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>

      <div className="spotify-player-sticky">
        <div className="spotify-track-info">
          <div className="spotify-album-art"></div>
          <div className="spotify-track-text">
            <span className="spotify-track-name">Now Playing: Portfolio Loading</span>
            <span className="spotify-artist">Aryl Ross</span>
          </div>
        </div>
        <div className="spotify-controls">
          <button className="spotify-btn" aria-label="Previous Track">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
          </button>
          <button className="spotify-btn" aria-label="Play/Pause">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
          <button className="spotify-btn" aria-label="Next Track">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
          </button>
        </div>
        <div className="spotify-actions">
          <span className="spotify-status">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          </span>
        </div>
      </div>

      <BubbleMenu 
        menuBg="rgba(255, 255, 255, 0.1)"
        menuContentColor="#fff"
        useFixedPosition={true}
        onMenuClick={setIsMenuOpen}
      />

      <main 
        className="main-content" 
        style={{ 
          flexGrow: 1,
          transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isMenuOpen ? 'translateY(160px)' : 'translateY(0)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
