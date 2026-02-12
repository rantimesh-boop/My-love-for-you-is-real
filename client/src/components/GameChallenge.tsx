import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface GameProps {
  onComplete: () => void;
}

interface GameObject {
  id: number;
  x: number;
  y: number;
}

export function GameChallenge({ onComplete }: GameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [hearts, setHearts] = useState<GameObject[]>([]);
  const [gameStatus, setGameStatus] = useState<'intro' | 'playing' | 'won' | 'lost'>('intro');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Timer logic
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameStatus('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStatus]);

  // Game loop for spawning hearts
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const spawnRate = 800; // ms
    const spawner = setInterval(() => {
      const id = Date.now();
      const x = Math.random() * 80 + 10; // 10% to 90% width
      setHearts(prev => [...prev, { id, x, y: -10 }]);
    }, spawnRate);

    // Fall animation loop
    const animator = setInterval(() => {
      setHearts(prev => 
        prev
          .map(h => ({ ...h, y: h.y + 2 })) // Fall speed
          .filter(h => h.y < 110) // Remove if off screen
      );
    }, 50);

    return () => {
      clearInterval(spawner);
      clearInterval(animator);
    };
  }, [gameStatus]);

  // Check win condition
  useEffect(() => {
    if (score >= 10) {
      setGameStatus('won');
      setTimeout(onComplete, 1500); // Wait a bit then proceed
    }
  }, [score, onComplete]);

  const catchHeart = (id: number) => {
    setHearts(prev => prev.filter(h => h.id !== id));
    setScore(s => s + 1);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setHearts([]);
    setGameStatus('playing');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative min-h-[500px] border-4 border-primary/20">
        
        {/* Header UI */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-white/80">
          <div className="font-display text-2xl font-bold text-primary">Score: {score}/10</div>
          <div className={`font-mono text-xl font-bold ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Game Area */}
        <div ref={containerRef} className="w-full h-full absolute inset-0 bg-gradient-to-b from-blue-50 to-pink-50">
          <AnimatePresence>
            {hearts.map(heart => (
              <motion.button
                key={heart.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, top: `${heart.y}%`, left: `${heart.x}%` }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0 }} // Instant update for game loop feel
                className="absolute cursor-pointer transform -translate-x-1/2 p-4"
                style={{ top: `${heart.y}%`, left: `${heart.x}%` }}
                onPointerDown={() => catchHeart(heart.id)}
              >
                <Heart className="w-12 h-12 text-red-500 fill-red-500 drop-shadow-lg" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Overlays */}
        {gameStatus === 'intro' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20 p-8 text-center">
            <h2 className="text-3xl font-display font-bold text-primary mb-4">Love Challenge! 🎯</h2>
            <p className="text-gray-600 mb-8 text-lg">Prove your love! Catch 10 falling hearts in 15 seconds to proceed.</p>
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-primary text-white rounded-full text-xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/30"
            >
              Start Game
            </button>
          </div>
        )}

        {gameStatus === 'won' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/90 z-20 text-white animate-in fade-in zoom-in duration-300">
            <h2 className="text-4xl font-display font-bold mb-2">You Did It! 🎉</h2>
            <p className="text-xl">True love confirmed!</p>
          </div>
        )}

        {gameStatus === 'lost' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 text-white p-8 text-center">
            <h2 className="text-3xl font-display font-bold mb-4">Oh no! 💔</h2>
            <p className="text-gray-300 mb-8">You missed too many hearts. Try again!</p>
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-white text-primary rounded-full text-xl font-bold hover:scale-105 active:scale-95 transition-transform"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
