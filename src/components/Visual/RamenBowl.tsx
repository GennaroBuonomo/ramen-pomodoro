import './RamenBowl.css';

// Definiamo cosa si aspetta di ricevere questo componente
interface RamenBowlProps {
  progress: number; // Un numero da 0 a 100
}

export const RamenBowl = ({ progress }: RamenBowlProps) => {
  // Calcoliamo quali ingredienti mostrare in base alla percentuale
  const showNoodles = progress >= 25;
  const showEgg = progress >= 50;
  const showChashu = progress >= 75;
  const showScallions = progress >= 100;

  return (
    <div className="ramen-container">
      {/* La ciotola di base con il brodo è sempre visibile */}
      <div className="bowl base-bowl">
        {/* Usiamo dei div temporanei per simulare gli ingredienti. 
            Più avanti li sostituiremo con dei veri SVG o immagini */}
            
        <div className={`ingredient noodles ${showNoodles ? 'visible' : ''}`}>
          🍜 Noodles
        </div>
        
        <div className={`ingredient egg ${showEgg ? 'visible' : ''}`}>
          🥚 Uovo
        </div>
        
        <div className={`ingredient chashu ${showChashu ? 'visible' : ''}`}>
          🥩 Maiale Chashu
        </div>
        
        <div className={`ingredient scallions ${showScallions ? 'visible' : ''}`}>
          🌿 Cipollotto
        </div>
      </div>
    </div>
  );
};