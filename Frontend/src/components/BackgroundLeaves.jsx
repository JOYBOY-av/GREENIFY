import React from 'react';

const Leaf = ({ style, fillId }) => (
  <svg style={style} viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={`bg-leaf-grad-${fillId}`} x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stopColor="#15803d" />
        <stop offset="60%" stopColor="#166534" />
        <stop offset="100%" stopColor="#14532d" />
      </linearGradient>
    </defs>
    <path d="M50 140 C 30 110, 0 80, 5 40 C 10 10, 35 0, 50 0 C 50 0, 50 70, 50 140" fill={`url(#bg-leaf-grad-${fillId})`} />
    <path d="M50 140 C 65 110, 95 90, 95 45 C 95 15, 65 5, 50 0 C 50 0, 50 70, 50 140" fill={`url(#bg-leaf-grad-${fillId})`} />
  </svg>
);

const floatingLeaves = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: Math.random() * 150 + 100,
  duration: Math.random() * 30 + 20,
  delay: Math.random() * -30,
  rotStart: Math.random() * 360,
  rotEnd: Math.random() * 360 + 90,
  dirX: (Math.random() - 0.5) * 20,
  dirY: (Math.random() - 0.5) * 20,
}));

export default function BackgroundLeaves() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {floatingLeaves.map(l => (
        <div 
          key={l.id} 
          className="absolute animate-slow-float" 
          style={{
            left: `${l.left}vw`,
            top: `${l.top}vh`,
            width: l.size,
            height: l.size * 1.5,
            opacity: 0.04,
            animationDuration: `${l.duration}s`,
            animationDelay: `${l.delay}s`,
            '--startX': '0px',
            '--startY': '0px',
            '--endX': `${l.dirX}vw`,
            '--endY': `${l.dirY}vh`,
            '--startRot': `${l.rotStart}deg`,
            '--endRot': `${l.rotEnd}deg`,
          }}
        >
           <Leaf fillId={l.id} style={{ width: '100%', height: '100%' }} />
        </div>
      ))}
    </div>
  );
}
