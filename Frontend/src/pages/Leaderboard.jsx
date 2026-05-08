import { useState, useEffect } from 'react';
import api from '../api/axios';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('weekly');
  const [scope, setScope] = useState('global');
  const [data, setData] = useState({ leaderboard: [], myRank: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const endpoint = activeTab === 'weekly' ? '/leaderboard/weekly' : '/leaderboard/alltime';
        const res = await api.get(endpoint + '?scope=' + scope);
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [activeTab, scope]);

  const tabClass = (active, isActive) =>
    'flex-1 py-1.5 text-sm font-medium rounded-full transition-all ' +
    (isActive === active ? 'bg-white shadow-sm ' : 'text-gray-500 hover:text-gray-700 ') +
    (isActive === active && active === 'time' ? 'text-green-700' : '') +
    (isActive === active && active === 'scope' ? 'text-blue-700' : '');

  const rankClass = (rankNum) => {
    const base = 'inline-flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm ';
    if (rankNum === 1) return base + 'bg-yellow-100 text-yellow-700';
    if (rankNum === 2) return base + 'bg-gray-200 text-gray-700';
    if (rankNum === 3) return base + 'bg-orange-100 text-orange-700';
    return base + 'bg-gray-50 text-gray-500';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-bloom opacity-0">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600">See who is making the biggest impact.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">

        <div className="bg-gray-100 p-1 rounded-full flex w-full max-w-xs">
          <button
            onClick={() => setActiveTab('weekly')}
            className={'flex-1 py-1.5 text-sm font-medium rounded-full transition-all ' + (activeTab === 'weekly' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700')}
          >
            This Week
          </button>
          <button
            onClick={() => setActiveTab('alltime')}
            className={'flex-1 py-1.5 text-sm font-medium rounded-full transition-all ' + (activeTab === 'alltime' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700')}
          >
            All Time
          </button>
        </div>

        <div className="bg-gray-100 p-1 rounded-full flex w-full max-w-xs">
          <button
            onClick={() => setScope('global')}
            className={'flex-1 py-1.5 text-sm font-medium rounded-full transition-all ' + (scope === 'global' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700')}
          >
            Global
          </button>
          <button
            onClick={() => setScope('college')}
            className={'flex-1 py-1.5 text-sm font-medium rounded-full transition-all ' + (scope === 'college' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700')}
          >
            My College
          </button>
        </div>
      </div>

      {data.myRank && (
        <div className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-md flex justify-between items-center px-8 animate-fade-in-up">
          <div>
            <p className="text-green-100 text-sm font-medium uppercase tracking-wider">Your Rank</p>
            <p className="text-3xl font-extrabold">#{data.myRank.rank}</p>
          </div>
          <div className="text-right">
            <p className="text-green-100 text-sm font-medium uppercase tracking-wider">Your Score</p>
            <p className="text-3xl font-extrabold">{data.myRank.total_points}</p>
          </div>
        </div>
      )}

      <div className="bg-emerald-50/80 shadow-sm border border-emerald-100 rounded-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading rankings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data.leaderboard.map((user) => {
                  const rankNum = parseInt(user.rank);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={rankClass(rankNum)}>{rankNum}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.college || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                        {user.total_points}
                      </td>
                    </tr>
                  );
                })}
                {data.leaderboard.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No active students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
