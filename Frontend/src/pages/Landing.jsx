import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
const Leaf = ({ style, fillId, isDark }) => (
  <svg style={style} viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id={`leaf-grad-${fillId}`} x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stopColor={isDark ? '#064e3b' : '#15803d'} />
        <stop offset="60%" stopColor={isDark ? '#022c22' : '#166534'} />
        <stop offset="100%" stopColor={isDark ? '#065f46' : '#14532d'} />
      </linearGradient>
      <linearGradient id={`leaf-dark-grad-${fillId}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isDark ? '#022c22' : '#166534'} />
        <stop offset="100%" stopColor={isDark ? '#065f46' : '#14532d'} />
      </linearGradient>
      <linearGradient id={`vein-grad-${fillId}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={isDark ? '#047857' : '#22c55e'} stopOpacity="0.8" />
        <stop offset="100%" stopColor={isDark ? '#022c22' : '#14532d'} stopOpacity="0" />
      </linearGradient>
    </defs>
    
    <path d="M50 140 C 30 110, 0 80, 5 40 C 10 10, 35 0, 50 0 C 50 0, 50 70, 50 140" fill={`url(#leaf-grad-${fillId})`} />
    <path d="M50 140 C 65 110, 95 90, 95 45 C 95 15, 65 5, 50 0 C 50 0, 50 70, 50 140" fill={`url(#leaf-dark-grad-${fillId})`} />
    <path d="M50 140 Q 45 145, 45 150" stroke={`url(#vein-grad-${fillId})`} strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M50 0 L50 140" stroke={`url(#vein-grad-${fillId})`} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M50 30 Q 30 45, 15 40" stroke={`url(#vein-grad-${fillId})`} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M50 35 Q 70 50, 85 45" stroke={`url(#vein-grad-${fillId})`} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M50 60 Q 35 75, 20 70" stroke={`url(#vein-grad-${fillId})`} strokeWidth="1" fill="none" strokeLinecap="round" />
    <path d="M50 65 Q 65 80, 80 75" stroke={`url(#vein-grad-${fillId})`} strokeWidth="1" fill="none" strokeLinecap="round" />
    <path d="M50 90 Q 40 105, 30 100" stroke={`url(#vein-grad-${fillId})`} strokeWidth="0.8" fill="none" strokeLinecap="round" />
    <path d="M50 95 Q 60 110, 70 105" stroke={`url(#vein-grad-${fillId})`} strokeWidth="0.8" fill="none" strokeLinecap="round" />
  </svg>
);

const generateVines = (count) => {
  let seed = 333;
  const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  const vines = [];
  for (let i = 0; i < count; i++) {
    const leftPercent = rand() * 120 - 10; 
    const lengthVh = rand() * 70 + 60;
    const thickness = rand() * 2 + 1; 
    const numLeaves = Math.floor(lengthVh / 17); 
    const leaves = [];
    for(let j=0; j<numLeaves; j++) {
      const sideMultiplier = rand() > 0.5 ? 1 : -1;
      leaves.push({
        id: j,
        topPercent: (j / numLeaves) * 100 + (rand()*4 - 2), 
        leftOffset: sideMultiplier * (rand() * 25 + 5), 
        size: rand() * 50 + 70,
        rot: sideMultiplier * (rand() * 80 + 20),
        isDark: rand() > 0.4
      });
    }
    const distFromCenter = Math.abs(50 - leftPercent);
    const delay = (distFromCenter / 60) * 1.5; 

    vines.push({ id: i, leftPercent, lengthVh, thickness, leaves, delay, zIndex: Math.floor(rand() * 100) });
  }
  return vines.sort((a,b) => a.zIndex - b.zIndex);
}

const allVines = generateVines(35);

const Landing = () => {
  const { user } = useContext(AuthContext);
  const [phase, setPhase] = useState('cover'); 

  useEffect(() => {

    const t1 = setTimeout(() => setPhase('exiting'), 300); 
    const t2 = setTimeout(() => setPhase('done'), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2) };
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-green-100 blur-[100px] opacity-60"></div>
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-100 blur-[100px] opacity-60"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[70%] h-[70%] rounded-full bg-green-50 blur-[120px] opacity-80"></div>
      </div>

      {phase !== 'done' && (
        <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">

          <div style={{
            position: 'absolute', inset: 0, backgroundColor: '#022c22',
            opacity: phase === 'exiting' ? 0 : 1,
            transition: 'opacity 1.2s ease-in-out 0.4s',
            willChange: 'opacity',
          }} />

          {allVines.map(vine => {
            const dir = vine.leftPercent < 50 ? -1 : 1; 
            return (
              <div key={vine.id} style={{
                position: 'absolute',
                left: `${vine.leftPercent}vw`,
                top: '-5vh',
                height: `${vine.lengthVh}vh`,
                width: `${vine.thickness}px`,
                backgroundColor: '#1f130b',
                zIndex: vine.zIndex,

                transform: phase === 'exiting' 
                  ? `translate(${dir * 40}vw, -10vh) scale(0) rotate(${dir * 15}deg)` 
                  : `translate(0, 0) scale(1) rotate(0deg)`,
                opacity: phase === 'exiting' ? 0 : 1,
                transformOrigin: 'top center',
                transition: `transform 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${vine.delay}s, opacity 1s ease ${vine.delay + 0.1}s`,
                willChange: 'transform, opacity',
              }}>

                {vine.leaves.map(l => (
                  <div key={l.id} style={{
                    position: 'absolute',
                    top: `${l.topPercent}%`,
                    left: `${l.leftOffset}px`,
                    width: l.size,
                    height: l.size * 1.5,
                    marginLeft: -l.size/2,
                    marginTop: -l.size/2,
                    transform: `rotate(${l.rot}deg)`,
                    transformOrigin: 'center center'
                  }}>
                    <Leaf fillId={`${vine.id}-${l.id}`} isDark={l.isDark} style={{ width: '100%', height: '100%' }} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      <div className="relative z-10" style={{
        opacity: phase === 'cover' ? 0 : 1,
        transform: phase === 'cover' ? 'scale(0.95)' : 'scale(1)',
        transition: 'opacity 1.5s ease-out 0.8s, transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.8s',
      }}>

        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-4xl bg-white/40 backdrop-blur-md p-10 rounded-3xl border border-white/50 shadow-sm mt-8">
            

            <div className="inline-flex items-center gap-2 bg-white/80 border border-green-200 text-green-800 text-sm font-semibold px-5 py-2 rounded-full mb-8 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Premium Sustainability Platform
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight mb-8 leading-[1.1]">
              Cultivate Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-700">
                Green Impact
              </span>
            </h1>

            <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Log eco-actions, earn premium badges, climb the leaderboard, and transform your daily habits into measurable sustainability.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-emerald-700 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  Go to Dashboard 🌿
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-emerald-700 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    Start Growing
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white/80 text-emerald-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-white border border-emerald-100 transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    Already have an account ?
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
