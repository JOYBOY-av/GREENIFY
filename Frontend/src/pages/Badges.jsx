import { useState, useEffect } from 'react';
import api from '../api/axios';

const BADGE_META = {
  'Action Taker':     { icon: '🌱', color: 'from-green-400 to-emerald-500',   bg: 'bg-green-50',   text: 'text-green-700' },
  'Point Collector':  { icon: '⭐', color: 'from-yellow-400 to-amber-500',    bg: 'bg-yellow-50',  text: 'text-yellow-700' },
  'Recycling Master': { icon: '♻️', color: 'from-teal-400 to-cyan-500',       bg: 'bg-teal-50',    text: 'text-teal-700' },
  'Energy Saver':     { icon: '💡', color: 'from-orange-400 to-yellow-500',   bg: 'bg-orange-50',  text: 'text-orange-700' },
  'Water Guardian':   { icon: '💧', color: 'from-blue-400 to-cyan-500',       bg: 'bg-blue-50',    text: 'text-blue-700' },
  'Transport Hero':   { icon: '🚲', color: 'from-purple-400 to-indigo-500',   bg: 'bg-purple-50',  text: 'text-purple-700' },
  'Animal Saver':     { icon: '🐾', color: 'from-pink-400 to-rose-500',       bg: 'bg-pink-50',    text: 'text-pink-700' },
  'Awareness Hero':   { icon: '📢', color: 'from-indigo-400 to-blue-500',     bg: 'bg-indigo-50',  text: 'text-indigo-700' },
  'Local Mayor':      { icon: '🏙️', color: 'from-gray-500 to-slate-600',      bg: 'bg-gray-50',    text: 'text-gray-700' },
};

const STAR_TOOLTIP = { 1: 'Bronze', 2: 'Silver', 3: 'Gold' };

const BadgeCard = ({ categoryName, badges, highestLevel }) => {
  const meta = BADGE_META[categoryName] || { icon: '🏆', color: 'from-gray-400 to-gray-500', bg: 'bg-gray-50', text: 'text-gray-700' };
  const progress = (highestLevel / 3) * 100;

  return (
    <div
      className={
        'group relative bg-white rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col overflow-hidden ' +
        (highestLevel > 0 ? 'border-yellow-200' : 'border-gray-100')
      }
    >

      {highestLevel > 0 && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/40 to-transparent pointer-events-none rounded-2xl" />
      )}

      <div className={'h-1.5 w-full bg-gradient-to-r ' + meta.color} />

      <div className="p-5 flex flex-col gap-4 flex-1">

        <div className="flex items-center gap-3">
          <div className={'text-3xl w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ' + meta.bg}>
            {meta.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{categoryName}</h3>
            {highestLevel > 0
              ? <span className={'text-xs font-semibold px-2 py-0.5 rounded-full ' + meta.bg + ' ' + meta.text}>
                  {STAR_TOOLTIP[highestLevel]} Unlocked ✓
                </span>
              : <span className="text-xs text-gray-400">Not started yet</span>
            }
          </div>
        </div>

        <ul className="space-y-2 flex-1">
          {badges.map((badge) => (
            <li key={badge.id} className="flex items-start gap-2 text-sm">
              <span className={'text-base shrink-0 ' + (badge.earned ? 'text-yellow-400' : 'text-gray-200')}>★</span>
              <span className={badge.earned ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                <span className="font-semibold">{STAR_TOOLTIP[badge.level]}:</span> {badge.description}
              </span>
            </li>
          ))}
        </ul>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Progress</span>
            <span className="text-xs font-semibold text-gray-600">{highestLevel}/3 stars</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={'h-full rounded-full bg-gradient-to-r ' + meta.color + ' transition-all duration-700'}
              style={{ width: progress + '%' }}
            />
          </div>
        </div>

        <div className="flex justify-center gap-5 pt-3 border-t border-gray-50">
          {badges.map((badge) => (
            <div key={badge.id} className="relative group/star flex flex-col items-center gap-1">
              <span
                className={
                  'text-3xl transition-all duration-300 ' +
                  (badge.earned
                    ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.7)] scale-110'
                    : 'text-gray-200 group-hover:text-gray-300')
                }
              >
                ★
              </span>
              <span className={'text-[10px] font-semibold ' + (badge.earned ? 'text-yellow-600' : 'text-gray-300')}>
                {STAR_TOOLTIP[badge.level]}
              </span>

              <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover/star:block z-20 whitespace-nowrap">
                <div className="bg-gray-900 text-white text-[10px] font-medium rounded-lg px-2.5 py-1.5 shadow-xl">
                  {badge.earned ? STAR_TOOLTIP[badge.level] + ' Achieved! 🎉' : STAR_TOOLTIP[badge.level] + ' — Locked'}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Badges = () => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [earnedCount, setEarnedCount] = useState(0);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const [allRes, earnedRes] = await Promise.all([
          api.get('/badges'),
          api.get('/badges/my-badges')
        ]);

        const earnedIds = new Set(earnedRes.data.map(b => b.id));
        setEarnedCount(earnedIds.size);

        const grouped = {};
        allRes.data.forEach(badge => {
          if (!grouped[badge.category]) grouped[badge.category] = [];
          grouped[badge.category].push({ ...badge, earned: earnedIds.has(badge.id) });
        });

        Object.keys(grouped).forEach(cat => {
          grouped[cat].sort((a, b) => a.level - b.level);
        });

        setCategories(grouped);
      } catch (err) {
        console.error('Failed to fetch badges', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  const totalCategories = Object.keys(categories).length;

  const filteredCategories = Object.entries(categories).filter(([, badges]) => {
    const highestLevel = badges.filter(b => b.earned).reduce((max, b) => Math.max(max, b.level), 0);
    if (filter === 'achieved') return highestLevel > 0;
    if (filter === 'locked') return highestLevel === 0;
    return true;
  });

  filteredCategories.sort(([, a], [, b]) => {
    const la = a.filter(x => x.earned).reduce((m, x) => Math.max(m, x.level), 0);
    const lb = b.filter(x => x.earned).reduce((m, x) => Math.max(m, x.level), 0);
    return lb - la;
  });

  const filterBtnClass = (f) =>
    'px-4 py-1.5 rounded-full text-sm font-medium transition-all ' +
    (filter === f
      ? 'bg-green-600 text-white shadow-md'
      : 'bg-white text-gray-500 border border-gray-200 hover:border-green-300 hover:text-green-600');

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-64 border border-gray-100"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">🏆 Badge Collection</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Log eco-friendly actions to unlock Bronze, Silver, and Gold tiers in each category. Every star counts!
        </p>

        <div className="flex justify-center gap-6 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{earnedCount}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Badges Earned</p>
          </div>
          <div className="w-px bg-gray-100"></div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-700">{totalCategories * 3}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total Badges</p>
          </div>
          <div className="w-px bg-gray-100"></div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-500">{Math.round((earnedCount / (totalCategories * 3)) * 100) || 0}%</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Completion</p>
          </div>
        </div>

        {earnedCount === 0 && (
          <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-5 py-2.5 rounded-full">
            🌱 You haven't earned any badges yet — start logging actions to light up your stars!
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-2 mb-8">
        <button onClick={() => setFilter('all')} className={filterBtnClass('all')}>All</button>
        <button onClick={() => setFilter('achieved')} className={filterBtnClass('achieved')}>✅ Achieved</button>
        <button onClick={() => setFilter('locked')} className={filterBtnClass('locked')}>🔒 Locked</button>
      </div>

      {/* Grid */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-medium text-lg">No badges match this filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(([categoryName, badges]) => {
            const highestLevel = badges.filter(b => b.earned).reduce((max, b) => Math.max(max, b.level), 0);
            return (
              <BadgeCard
                key={categoryName}
                categoryName={categoryName}
                badges={badges}
                highestLevel={highestLevel}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Badges;
