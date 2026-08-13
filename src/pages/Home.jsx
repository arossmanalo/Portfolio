import React, { useState, useEffect } from 'react';
import Lanyard from '../components/Lanyard';
import FlowingMenu from '../components/FlowingMenu';
import profilePic from '../assets/profile.png';

const Home = () => {
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const linkedInSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>';
  const githubSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';
  const gmailSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>';

  const getSvgUrl = (svg, color) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace('currentColor', color))}`;

  const socialItems = [
    { 
      link: 'https://www.linkedin.com/in/aryl-ross-manalo-baa321425/', 
      text: 'LinkedIn', 
      image: getSvgUrl(linkedInSvg, '#ffffff'),
      marqueeBgColor: '#0A66C2',
      marqueeTextColor: '#ffffff'
    },
    { 
      link: 'https://github.com/arossmanalo', 
      text: 'GitHub', 
      image: getSvgUrl(githubSvg, '#000000'),
      marqueeBgColor: '#ffffff',
      marqueeTextColor: '#000000'
    },
    { 
      link: '#', 
      text: 'Email', 
      image: getSvgUrl(gmailSvg, '#ffffff'),
      marqueeBgColor: '#EA4335',
      marqueeTextColor: '#ffffff',
      action: () => {
        navigator.clipboard.writeText('manaloarylross@gmail.com');
        setToastMessage('Email copied to clipboard!');
      }
    }
  ];

  return (
    <>
      <style>{`
        @keyframes toastFade {
          0% { opacity: 0; transform: translate(-50%, 20px); }
          10% { opacity: 1; transform: translate(-50%, 0); }
          90% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -20px); }
        }
      `}</style>

      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(192, 132, 252, 0.15)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(192, 132, 252, 0.3)',
          color: '#fff',
          padding: '0.75rem 2rem',
          borderRadius: '50px',
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          animation: 'toastFade 3s forwards',
          pointerEvents: 'none'
        }}>
          {toastMessage}
        </div>
      )}

      <div className="home-container" style={{ width: '100%', height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Lanyard position={[0, 0, 16]} gravity={[0, -40, 0]} frontImage={profilePic} />
        <div style={{ marginTop: '2rem', textAlign: 'center', zIndex: 10 }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Aryl Ross A. Manalo</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            ITEQS Manager at JPCS DLSL Chapter | Software Developer | Aspiring Project Manager and Full Stack Developer | System Development Major | 3rd Year BSIT Student @ De La Salle Lipa
          </p>
        </div>
      </div>
      
      <div style={{ 
        width: '100vw', 
        marginLeft: 'calc(-50vw + 50%)', 
        marginRight: 'calc(-50vw + 50%)', 
        position: 'relative', 
        marginTop: '4rem', 
        marginBottom: '4rem' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ 
            fontSize: '0.85rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em', 
            color: '#c084fc', 
            fontWeight: '600',
            border: '1px solid rgba(192, 132, 252, 0.3)',
            padding: '0.5em 1.2em',
            borderRadius: '50px',
            backgroundColor: 'rgba(192, 132, 252, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            Socials
          </span>
        </div>
        <div style={{ height: '300px' }}>
          <FlowingMenu 
            items={socialItems} 
            bgColor="transparent" 
            textColor="rgba(255,255,255,0.7)"
            marqueeBgColor="#c084fc"
            marqueeTextColor="#1f0b3b"
            borderColor="rgba(255,255,255,0.1)"
            speed={15}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
