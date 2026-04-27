import React, { useMemo } from 'react';

const RealisticLeafPaths = ({ fillId, isDark }) => (
  <>
    <defs>
      <linearGradient id={`leaf-grad-${fillId}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={isDark ? '#064e3b' : '#15803d'} />
        <stop offset="100%" stopColor={isDark ? '#022c22' : '#14532d'} />
      </linearGradient>
    </defs>

    <path 
      d="M50 140 C 10 135, -5 100, 10 60 C 20 20, 40 5, 50 0 C 60 5, 80 20, 90 60 C 105 100, 90 135, 50 140 Z" 
      fill={`url(#leaf-grad-${fillId})`} 
    />
    <path d="M50 0 L50 140" stroke="#047857" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M50 110 Q 30 100, 20 80" stroke="#047857" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M50 115 Q 70 105, 80 85" stroke="#047857" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M50 80 Q 30 70, 25 50" stroke="#047857" strokeWidth="1" fill="none" strokeLinecap="round" />
    <path d="M50 85 Q 70 75, 75 55" stroke="#047857" strokeWidth="1" fill="none" strokeLinecap="round" />
    <path d="M50 50 Q 40 40, 35 30" stroke="#047857" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    <path d="M50 55 Q 60 45, 65 35" stroke="#047857" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    <path d="M50 25 Q 45 20, 45 15" stroke="#047857" strokeWidth="0.5" fill="none" strokeLinecap="round" />
    <path d="M50 25 Q 55 20, 55 15" stroke="#047857" strokeWidth="0.5" fill="none" strokeLinecap="round" />
  </>
);

const Leaf = ({ style, fillId }) => (
  <svg style={style} viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
    <RealisticLeafPaths fillId={fillId} isDark={parseInt(fillId.split('-')[1]) % 2 === 0} />
  </svg>
);

const getEdgeBiasedLeft = (i, total) => {

  return Math.random() < 0.55
    ? 10+Math.random() * 9
    : 80+Math.random() * 10;
};

const generateFloatingLeaves = () => {
  const total = 6;
  return Array.from({ length: total }).map((_, i) => ({
    id: i,
    left: getEdgeBiasedLeft(i, total),
    top: Math.random() * -20 - 20,
    size: Math.random() *  70+ 110,
    duration: Math.random() * 10 + 12,
    delay: Math.random() * -8,
    rotStart: Math.random() * 180,
    rotEnd: Math.random() * 180 + 180,
    dirX: (Math.random() - 0.5) * 80,
    dirY: 100 + Math.random() * 30,
  }));
};

export default function FloatingLeaves() {
  const floatingLeaves = useMemo(() => generateFloatingLeaves(), []);

  return (
    <>
      <style>{`
        @keyframes swift-float {
          0% { transform: translate(var(--startX), var(--startY)) rotate(var(--startRot)); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translate(var(--endX), var(--endY)) rotate(var(--endRot)); opacity: 0; }
        }
        .animate-swift-float {
          animation: swift-float linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-swift-float {
            animation: none !important;
            transform: none !important;
            opacity: 0.01;
          }
        }
      `}</style>
      {floatingLeaves.map(l => (
        <div
          key={`fl-${l.id}`}
          className="absolute animate-swift-float"
          style={{
            left: `${l.left}vw`,
            top: `${l.top}vh`,
            width: l.size,
            height: l.size * 1.5,
            opacity: 0,
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
          <Leaf fillId={`fl-${l.id}`} style={{ width: '100%', height: '100%' }} />
        </div>
      ))}
    </>
  );
}
