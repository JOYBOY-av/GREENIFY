import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const LeafIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8.2a7 7 0 0 1-9 9.8z" />
    <path d="M11 20l-1-1" />
  </svg>
);

const BadgeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z" />
    <path d="M12 8l-2 4h4l-2 4" />
  </svg>
);

const LeaderboardIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20V10" />
    <path d="M18 20V4" />
    <path d="M6 20v-4" />
  </svg>
);

const EarthIllustration = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    className="relative w-64 h-64 md:w-96 md:h-96"
  >
    <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
      <circle cx="100" cy="100" r="90" fill="#f0fdf4" stroke="#10b981" strokeWidth="2" />
      <motion.path
        d="M60 40 Q 100 20 140 40 Q 180 80 140 120 Q 100 160 60 120 Q 20 80 60 40"
        fill="#10b981"
        opacity="0.6"
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M100 80 Q 130 60 160 100 Q 130 140 100 120 Q 70 140 40 100 Q 70 60 100 80"
        fill="#059669"
        opacity="0.4"
        animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </svg>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay }}
    className="bg-emerald-50/90 backdrop-blur-md p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-emerald-100 group relative z-10"
  >
    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

const StepItem = ({ number, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay }}
    className="flex items-start gap-6 mb-12 last:mb-0 relative z-10"
  >
    <div className="flex-shrink-0 w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
      {number}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-emerald-100 leading-relaxed max-w-md">{description}</p>
    </div>
  </motion.div>
);

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

const AnimatedLeaf = ({ leaf, smoothProgress, i }) => {
  const leafScale = useTransform(smoothProgress, [leaf.startDraw, Math.min(1, leaf.startDraw + 0.05)], [0, leaf.scale]);
  const leafOpacity = useTransform(smoothProgress, [leaf.startDraw, Math.min(1, leaf.startDraw + 0.05)], [0, 1]);
  const transform = useMotionTemplate`translate(${leaf.x}px, ${leaf.y}px) rotate(${leaf.rot}deg) scale(${leafScale})`;
  
  return (
    <motion.g style={{ transform, opacity: leafOpacity }}>
      <g transform="translate(-50, -140)">
        <RealisticLeafPaths fillId={i} isDark={i % 2 === 0} />
      </g>
    </motion.g>
  );
};

const ScrollyTellingVine = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });

  const branches = [
    { path: "M 580 200 Q 750 180, 800 250", range: [0.04, 0.10] },
    { path: "M 550 350 Q 800 380, 850 500", range: [0.07, 0.13] },
    { path: "M 500 500 Q 200 550, 150 700", range: [0.10, 0.16] },
    { path: "M 430 650 Q 200 620, 150 550", range: [0.13, 0.19] },
    { path: "M 450 800 Q 200 850, 150 1000", range: [0.16, 0.22] },
    { path: "M 500 950 Q 750 900, 800 850", range: [0.19, 0.25] },
    { path: "M 570 1150 Q 800 1180, 850 1300", range: [0.23, 0.29] },
    { path: "M 580 1300 Q 850 1350, 900 1500", range: [0.26, 0.32] },
    { path: "M 500 1500 Q 250 1550, 200 1700", range: [0.30, 0.36] },
    { path: "M 430 1650 Q 150 1620, 100 1550", range: [0.33, 0.39] },
    { path: "M 450 1800 Q 200 1850, 150 2000", range: [0.36, 0.42] },
    { path: "M 500 1950 Q 750 1900, 800 1850", range: [0.39, 0.45] },
    { path: "M 570 2150 Q 800 2180, 850 2300", range: [0.43, 0.49] },
    { path: "M 580 2300 Q 850 2350, 900 2500", range: [0.46, 0.52] },
    { path: "M 500 2500 Q 250 2550, 200 2700", range: [0.50, 0.56] },
    { path: "M 430 2650 Q 150 2620, 100 2550", range: [0.53, 0.59] },
    { path: "M 450 2800 Q 200 2850, 150 3000", range: [0.56, 0.62] },
    { path: "M 500 2950 Q 750 2900, 800 2850", range: [0.59, 0.65] },
    { path: "M 570 3150 Q 800 3180, 850 3300", range: [0.63, 0.69] },
    { path: "M 580 3300 Q 850 3350, 900 3500", range: [0.66, 0.72] },
    { path: "M 500 3500 Q 250 3550, 200 3700", range: [0.70, 0.76] },
    { path: "M 430 3650 Q 150 3620, 100 3550", range: [0.73, 0.79] },
    { path: "M 450 3800 Q 200 3850, 150 4000", range: [0.76, 0.82] },
    { path: "M 500 3950 Q 750 3900, 800 3850", range: [0.79, 0.85] },
    { path: "M 570 4150 Q 800 4180, 850 4300", range: [0.83, 0.89] },
    { path: "M 580 4300 Q 850 4350, 900 4500", range: [0.86, 0.92] },
    { path: "M 500 4500 Q 250 4550, 200 4700", range: [0.90, 0.96] },
  ];

  const leaves = [

    { x: 800, y: 250, rot: 140, scale: 0.8, startDraw: 0.10 },
    { x: 850, y: 500, rot: 155, scale: 0.9, startDraw: 0.13 },
    { x: 150, y: 700, rot: -160, scale: 0.7, startDraw: 0.16 },
    { x: 150, y: 550, rot: -60, scale: 0.8, startDraw: 0.19 },
    { x: 150, y: 1000, rot: -160, scale: 0.9, startDraw: 0.22 },
    { x: 800, y: 850, rot: 45, scale: 0.8, startDraw: 0.25 },
    { x: 850, y: 1300, rot: 140, scale: 0.9, startDraw: 0.29 },
    { x: 900, y: 1500, rot: 155, scale: 0.8, startDraw: 0.32 },
    { x: 200, y: 1700, rot: -160, scale: 1.0, startDraw: 0.36 },
    { x: 100, y: 1550, rot: -60, scale: 0.7, startDraw: 0.39 },
    { x: 150, y: 2000, rot: -160, scale: 0.9, startDraw: 0.42 },
    { x: 800, y: 1850, rot: 45, scale: 0.8, startDraw: 0.45 },
    { x: 850, y: 2300, rot: 140, scale: 1.1, startDraw: 0.49 },
    { x: 900, y: 2500, rot: 155, scale: 0.8, startDraw: 0.52 },
    { x: 200, y: 2700, rot: -160, scale: 0.9, startDraw: 0.56 },
    { x: 100, y: 2550, rot: -60, scale: 0.7, startDraw: 0.59 },
    { x: 150, y: 3000, rot: -160, scale: 1.0, startDraw: 0.62 },
    { x: 800, y: 2850, rot: 45, scale: 0.8, startDraw: 0.65 },
    { x: 850, y: 3300, rot: 140, scale: 0.9, startDraw: 0.69 },
    { x: 900, y: 3500, rot: 155, scale: 1.0, startDraw: 0.72 },
    { x: 200, y: 3700, rot: -160, scale: 0.8, startDraw: 0.76 },
    { x: 100, y: 3550, rot: -60, scale: 0.7, startDraw: 0.79 },
    { x: 150, y: 4000, rot: -160, scale: 0.9, startDraw: 0.82 },
    { x: 800, y: 3850, rot: 45, scale: 0.8, startDraw: 0.85 },
    { x: 850, y: 4300, rot: 140, scale: 1.0, startDraw: 0.89 },
    { x: 900, y: 4500, rot: 155, scale: 0.8, startDraw: 0.92 },
    { x: 200, y: 4700, rot: -160, scale: 0.9, startDraw: 0.96 },

    { x: 550, y: 100, rot: 135, scale: 0.6, startDraw: 0.02 },
    { x: 550, y: 300, rot: -135, scale: 0.7, startDraw: 0.06 },
    { x: 500, y: 500, rot: -135, scale: 0.5, startDraw: 0.10 },
    { x: 450, y: 700, rot: -135, scale: 0.8, startDraw: 0.14 },
    { x: 450, y: 900, rot: 135, scale: 0.7, startDraw: 0.18 },
    { x: 550, y: 1100, rot: 135, scale: 0.6, startDraw: 0.22 },
    { x: 550, y: 1400, rot: -135, scale: 0.8, startDraw: 0.28 },
    { x: 450, y: 1800, rot: 135, scale: 0.7, startDraw: 0.36 },
    { x: 550, y: 2200, rot: -135, scale: 0.8, startDraw: 0.44 },
    { x: 450, y: 2600, rot: 135, scale: 0.7, startDraw: 0.52 },
    { x: 550, y: 3000, rot: -135, scale: 0.6, startDraw: 0.60 },
    { x: 450, y: 3400, rot: 135, scale: 0.7, startDraw: 0.68 },
    { x: 550, y: 4100, rot: -135, scale: 0.8, startDraw: 0.82 },
  ];

  return (
    <div className="absolute inset-0 w-full pointer-events-none z-0" style={{ height: '100%' }}>
      <svg className="w-full h-full" viewBox="0 0 1000 5000" preserveAspectRatio="xMidYMin slice">
        <defs>
          <linearGradient id="main-vine-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="25%" stopColor="#059669" />
            <stop offset="75%" stopColor="#047857" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>
          <filter id="vine-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <motion.path
          d="M 500 0 Q 700 250, 500 500 T 500 1000 T 500 1500 T 500 2000 T 500 2500 T 500 3000 T 500 3500 T 500 4000 T 500 4500 T 500 5000"
          fill="none"
          stroke="url(#main-vine-grad)"
          strokeWidth="14"
          strokeLinecap="round"
          style={{ pathLength: smoothProgress }}
          filter="url(#vine-glow)"
        />

        {branches.map((branch, i) => (
          <motion.path
            key={`branch-${i}`}
            d={branch.path}
            fill="none"
            stroke="#10b981"
            strokeWidth="8"
            strokeLinecap="round"
            style={{ 
              pathLength: useTransform(smoothProgress, branch.range, [0, 1]) 
            }}
          />
        ))}

        {leaves.map((leaf, i) => (
          <AnimatedLeaf key={`leaf-${i}`} leaf={leaf} smoothProgress={smoothProgress} i={i} />
        ))}
      </svg>
    </div>
  );
};

const Landing = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="overflow-hidden font-sans relative">
      

      <ScrollyTellingVine />

      <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-[120px] opacity-40"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-green-100 rounded-full blur-[120px] opacity-40"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-semibold px-6 py-2.5 rounded-full mb-10 shadow-sm bg-white/80 backdrop-blur-md"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Building the Future of Sustainability
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 tracking-tight mb-8 leading-[1.1] relative z-10">
            Cultivate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-700">
              Green Impact
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-800 mb-12 max-w-2xl mx-auto leading-relaxed font-semibold bg-white/40 backdrop-blur-md rounded-2xl p-4 shadow-sm relative z-10">
            Log eco-actions, earn premium badges, and transform your daily habits into measurable change. Start your journey today.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-emerald-700 text-white px-10 py-4 md:px-12 md:py-5 rounded-full font-bold text-lg md:text-xl hover:bg-emerald-800 transition-all shadow-2xl hover:shadow-emerald-200 hover:-translate-y-1"
              >
                Enter Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-emerald-700 text-white px-10 py-4 md:px-12 md:py-5 rounded-full font-bold text-lg md:text-xl hover:bg-emerald-800 transition-all shadow-2xl hover:shadow-emerald-200 hover:-translate-y-1"
                >
                  Join the Movement
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-emerald-900 px-10 py-4 md:px-12 md:py-5 rounded-full font-bold text-lg md:text-xl hover:bg-emerald-50 border border-emerald-100 transition-all shadow-xl hover:-translate-y-1"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      <section className="py-24 md:py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20 bg-white/40 backdrop-blur-md rounded-3xl p-8 max-w-3xl mx-auto shadow-sm">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">What is Greenify?</h2>
            <p className="text-lg md:text-xl text-gray-800 font-medium">
              We've gamified sustainability to make saving the planet as engaging and rewarding as your favorite game.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <FeatureCard
              icon={LeafIcon}
              title="Log Actions"
              description="Record your daily eco-friendly activities—from biking to work to using a reusable cup."
              delay={0.1}
            />
            <FeatureCard
              icon={BadgeIcon}
              title="Earn Badges"
              description="Unlock exclusive premium badges as you reach sustainability milestones and build better habits."
              delay={0.2}
            />
            <FeatureCard
              icon={LeaderboardIcon}
              title="Leaderboard"
              description="See how your efforts stack up and inspire your friends to join the movement."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* --- Section 2: Why Sustainability Matters --- */}
      <section className="py-24 md:py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16 relative z-10">
          <div className="flex-1 text-center md:text-left bg-white/40 backdrop-blur-md p-10 rounded-[3rem] shadow-sm">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">Small Actions,<br />Huge Impact.</h2>
            <p className="text-lg md:text-xl text-gray-800 font-medium mb-10 leading-relaxed">
              Climate change awareness starts with individual choices. Every reusable bag, every meatless meal, and every walk adds up. We help you visualize the power of your daily efforts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-white rounded-3xl border border-emerald-100 shadow-md text-left"
              >
                <div className="text-xl font-black text-emerald-700 mb-2">Build Better Habits</div>
                <div className="text-gray-600 font-medium">Turn sporadic choices into a sustainable lifestyle.</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 bg-white rounded-3xl border border-emerald-100 shadow-md text-left"
              >
                <div className="text-xl font-black text-emerald-700 mb-2">Be the Change</div>
                <div className="text-gray-600 font-medium">1 action daily = 365 steps toward a greener earth.</div>
              </motion.div>
            </div>
          </div>
          <div className="flex-1 flex justify-center mt-10 md:mt-0 relative z-10">
            <EarthIllustration />
          </div>
        </div>
      </section>

      {/* --- Section 3: How It Works --- */}
      <section className="py-24 md:py-32 px-4 bg-emerald-900/95 backdrop-blur-md text-white rounded-[3rem] md:rounded-[4rem] mx-4 relative z-10 my-10 shadow-2xl overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 w-full">
            <h2 className="text-4xl md:text-6xl font-black mb-12 md:mb-16 text-center md:text-left">How It Works</h2>
            <StepItem number="1" title="Log Your Eco-Action" description="Simply record your sustainable choices in seconds using our intuitive interface." delay={0.1} />
            <StepItem number="2" title="AI Evaluates Impact" description="Our system calculates the environmental value and points for your deed." delay={0.2} />
            <StepItem number="3" title="Earn Points & Badges" description="Gain XP, unlock beautiful badges, and watch your virtual forest grow." delay={0.3} />
            <StepItem number="4" title="Climb the Leaderboard" description="Compete with peers and see who is making the biggest difference." delay={0.4} />
          </div>
          <div className="flex-1 hidden md:flex justify-center">
            <div className="aspect-square w-[400px] bg-emerald-800/50 rounded-full border border-emerald-700 flex items-center justify-center relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-emerald-500 rounded-full blur-[80px]"
              ></motion.div>
              <LeafIcon className="w-40 h-40 text-emerald-400 relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 4: Gamification --- */}
      <section className="py-24 md:py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 max-w-3xl mx-auto shadow-sm mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">Make Sustainability Fun</h2>
            <p className="text-lg md:text-xl text-gray-800 font-medium">
              Earning points has never been this rewarding. Collect beautiful badges as you progress on your journey.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {[
              { name: "First Leaf", color: "bg-green-100 text-green-700", desc: "Log your first action" },
              { name: "Eco Warrior", color: "bg-emerald-100 text-emerald-700", desc: "Reach 500 points" },
              { name: "Zero Waste", color: "bg-teal-100 text-teal-700", desc: "Maintain a 7-day streak" },
              { name: "Planet Hero", color: "bg-blue-100 text-blue-700", desc: "Top 10 on Leaderboard" },
            ].map((badge, i) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`${badge.color} p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] w-full sm:w-64 aspect-square flex flex-col items-center justify-center shadow-lg hover:shadow-xl cursor-default transition-all duration-300 border border-white`}
              >
                <BadgeIcon className="w-16 h-16 mb-4" />
                <span className="font-bold text-xl mb-2">{badge.name}</span>
                <span className="text-sm opacity-80 font-medium text-center">{badge.desc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 5: Global Impact --- */}
      <section className="py-24 md:py-32 px-4 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 max-w-3xl mx-auto shadow-sm mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8">Impact Beyond You</h2>
            <p className="text-lg md:text-xl text-gray-800 font-medium">
              It's not just about individual actions. It's about a collective effort. Start a movement at your college and compete for a greener future.
            </p>
          </div>
          <div className="relative h-64 md:h-96 flex items-center justify-center">
            {/* Abstract connected map lines */}
            <svg viewBox="0 0 800 400" className="w-full max-w-4xl opacity-20 absolute inset-0 m-auto">
              <path d="M150 150 Q 200 100 250 150 T 350 150 T 450 150 T 550 150 T 650 150" fill="none" stroke="#059669" strokeWidth="4" />
              <path d="M100 250 Q 150 200 200 250 T 300 250 T 400 250 T 500 250 T 600 250" fill="none" stroke="#059669" strokeWidth="4" />
              <path d="M250 150 L 300 250 M 450 150 L 400 250 M 650 150 L 500 250" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />
            </svg>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative z-10 flex flex-wrap justify-center gap-6 md:gap-12"
            >
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-emerald-50 -rotate-2 hover:rotate-0 transition-transform w-64">
                <span className="text-emerald-600 font-bold block text-xl mb-1">Your Campus Here</span>
                <span className="text-gray-500 font-medium text-sm">Be the first to lead the charge in your community.</span>
              </div>
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-emerald-50 rotate-3 hover:rotate-0 transition-transform w-64 mt-8 md:mt-0">
                <span className="text-emerald-600 font-bold block text-xl mb-1">Start a Movement</span>
                <span className="text-gray-500 font-medium text-sm">Inspire your peers and track collective progress.</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Section 6: Final CTA --- */}
      <section className="py-24 md:py-40 px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center bg-emerald-50/90 backdrop-blur-lg rounded-[3rem] md:rounded-[4rem] p-10 md:p-32 border border-emerald-200 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-300/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-300/40 rounded-full blur-3xl"></div>

          <h2 className="text-4xl md:text-7xl font-black text-gray-900 mb-8 leading-tight relative z-10">Start Making an<br />Impact Today</h2>
          <p className="text-lg md:text-2xl text-gray-800 font-medium mb-12 max-w-2xl mx-auto relative z-10">
            Ready to turn your sustainability journey into a rewarding experience? The planet is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center relative z-10">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-emerald-700 text-white px-10 py-4 md:px-12 md:py-5 rounded-full font-bold text-lg md:text-xl hover:bg-emerald-800 transition-all shadow-xl hover:-translate-y-1"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-emerald-700 text-white px-10 py-4 md:px-12 md:py-5 rounded-full font-bold text-lg md:text-xl hover:bg-emerald-800 transition-all shadow-xl hover:-translate-y-1"
                >
                  Start Your Journey
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-emerald-900 px-10 py-4 md:px-12 md:py-5 rounded-full font-bold text-lg md:text-xl hover:bg-emerald-50 border border-emerald-200 transition-all shadow-md hover:-translate-y-1"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* --- Footer (Simple) --- */}
      <footer className="py-10 px-4 text-center text-gray-500 border-t border-gray-200 relative z-10 bg-[#fcfdfa]/80 backdrop-blur-md">
        <p className="font-medium">© 2026 Greenify. Cultivating a sustainable future, one action at a time.</p>
      </footer>
    </div>
  );
};

export default Landing;
