import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Home = () => {
  const { handleHover, setLogMessage } = useOutletContext();

  return (
    <section className="section-border hero-section" id="home" onMouseEnter={() => handleHover('HOME')}>
      <div className="eyebrow">// 01. HOME</div>
      <p className="typewriter">{'> INITIATING SEQUENCE...'}<br/>{'> IDENTITY: ARYL ROSS A. MANALO'}</p>
      <h1 className="hero-thesis">BUILDING PRECISE, HIGH-PERFORMANCE WEB EXPERIENCES.</h1>
      <div>
        <button className="btn-primary" onClick={() => setLogMessage('> [NET] Initiating contact protocol...')}>
          [ INITIATE CONTACT ]
        </button>
      </div>
    </section>
  );
};

export default Home;
