import { useCallback, useRef, useState } from 'react';
import Cursor from './components/Cursor';
import HudNav from './components/HudNav';
import LapTracker from './components/LapTracker';
import TitleScreen from './components/TitleScreen';
import Profile from './components/Profile';
import Inventory from './components/Inventory';
import QuestLog from './components/QuestLog';
import { Achievements, SideQuests } from './components/CardSections';
import Contact from './components/Contact';
import WhackGame from './components/WhackGame';
import { useKonami, useReveal } from './hooks';

function App() {
  const main = useRef(null);
  const [game, setGame] = useState(false);
  const unlock = useCallback(() => setGame(true), []);

  useKonami(unlock);
  useReveal(main);

  return (
    <>
      <Cursor />
      <HudNav />
      <LapTracker />
      <main ref={main}>
        <TitleScreen />
        <Profile />
        <Inventory />
        <QuestLog />
        <Achievements />
        <SideQuests />
        <Contact />
      </main>
      {game && <WhackGame onClose={() => setGame(false)} />}
    </>
  );
}

export default App;
