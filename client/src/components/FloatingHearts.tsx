import { useEffect, useState } from 'react';

// Generate random hearts for background atmosphere
export function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; left: number; delay: number; scale: number; color: string }[]>([]);

  useEffect(() => {
    // Create fewer hearts on mobile for performance
    const count = window.innerWidth < 768 ? 15 : 30;
    const colors = ['#ffccd5', '#ffb3c1', '#ff8fa3', '#ff758f', '#fae1dd'];
    
    const newHearts = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      delay: Math.random() * 15, // seconds
      scale: 0.5 + Math.random() * 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    
    setHearts(newHearts);
  }, []);

  return (
    <div className="floating-hearts">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart-particle text-4xl"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            transform: `scale(${heart.scale})`,
            color: heart.color,
          }}
        >
          ❤
        </div>
      ))}
    </div>
  );
}
