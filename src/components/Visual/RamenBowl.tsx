import './RamenBowl.css';
// 1. Importiamo i nostri nuovi disegni SVG
import { BowlSVG, NoodlesSVG, EggSVG, ChashuSVG, ScallionSVG } from './RamenAssets';

interface RamenBowlProps {
  progress: number;
}

export const RamenBowl = ({ progress }: RamenBowlProps) => {
  const showNoodles = progress >= 25;
  const showEgg = progress >= 50;
  const showChashu = progress >= 75;
  const showScallions = progress >= 100;

  return (
    <div className="ramen-container">
      {/* 2. Usiamo ramen-stage come "palcoscenico" per impilare le immagini */}
      <div className="ramen-stage">
        
        {/* La ciotola di base */}
        <div className="asset bowl-asset">
          <BowlSVG />
        </div>

        {/* 3. Sostituiamo i testi con i veri componenti SVG */}
        <div className={`asset ingredient noodles ${showNoodles ? 'visible' : ''}`}>
          <NoodlesSVG />
        </div>
        
        <div className={`asset ingredient egg ${showEgg ? 'visible' : ''}`}>
          <EggSVG />
        </div>
        
        <div className={`asset ingredient chashu ${showChashu ? 'visible' : ''}`}>
          <ChashuSVG />
        </div>
        
        <div className={`asset ingredient scallions ${showScallions ? 'visible' : ''}`}>
          <ScallionSVG />
        </div>

      </div>
    </div>
  );
};