import { useState } from 'react';
import { Search, Trophy, Target, Users, Award, Sparkles, TrendingUp, Eye, Clock, Zap, Shield, Heart, Swords, Crosshair } from 'lucide-react';
import { API } from 'mrivals';

export default function MRivalsViewer() {
  const [username, setUsername] = useState('');
  const [playerInfo, setPlayerInfo] = useState<any>(null);
  const [peakRanks, setPeakRanks] = useState<any>(null);
  const [overview, setOverview] = useState<any>(null);
  const [heroes, setHeroes] = useState<any>(null);
  const [roles, setRoles] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<'info' | 'overview' | 'heroes' | 'roles'>('info');

  const searchPlayer = async () => {
    if (!username.trim()) return;
    
    setLoading(true);
    setError('');
    setPlayerInfo(null);
    setPeakRanks(null);
    setOverview(null);
    setHeroes(null);
    setRoles(null);
    
    try {
      const user = await API.fetchUser(username);
      
      const info = user.info();
      const peaks = user.peakRank();
      
      setPlayerInfo(info);
      setPeakRanks(peaks);
      setOverview(user.overview());
      setHeroes(user.heroes());
      setRoles(user.roles());
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Player not found');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen relative bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(/background.jpg)' }}>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-3 flex items-center justify-center gap-4 drop-shadow-lg">
              <Trophy className="text-amber-400 drop-shadow-glow" size={56} />
              Marvel Rivals Stats Viewer
            </h1>
            <p className="text-amber-200 text-lg font-semibold drop-shadow-md">View Marvel Rivals player statistics</p>
          </header>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-slate-900/90 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-amber-500/30">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchPlayer()}
                  placeholder="Enter player username (e.g. zmqrio)..."
                  className="flex-1 px-5 py-4 bg-slate-800/80 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 border border-slate-700 font-medium"
                />
                <button
                  onClick={searchPlayer}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg font-bold transition-all disabled:opacity-50 shadow-lg hover:shadow-amber-500/50"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="max-w-4xl mx-auto mb-8 bg-red-900/90 backdrop-blur-md border-2 border-red-500 rounded-lg p-4 text-red-100 font-semibold shadow-xl">
              {error}
            </div>
          )}

          {playerInfo && (
            <>
              {/* Player Header Card */}
              <div className="max-w-6xl mx-auto mb-8">
                <div className="bg-slate-900/90 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-amber-500/30">
                  <div className="flex items-center gap-6 mb-6">
                    {playerInfo.avatar && (
                      <img 
                        src={playerInfo.avatar} 
                        alt={playerInfo.name}
                        className="w-28 h-28 rounded-full border-4 border-amber-500 shadow-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
                        {playerInfo.name || username}
                      </h2>
                      <div className="flex gap-4 items-center flex-wrap">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-600/80 to-orange-600/80 backdrop-blur-sm px-5 py-2 rounded-lg border border-amber-400/50 shadow-lg">
                          <Trophy className="text-amber-200" size={22} />
                          <span className="text-white font-bold text-lg">{playerInfo.rank}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm px-5 py-2 rounded-lg border border-slate-600 shadow-lg">
                          <TrendingUp className="text-green-400" size={22} />
                          <span className="text-slate-100 font-semibold">Peak: {playerInfo.peakRank}</span>
                        </div>
                        {playerInfo.pageViews && (
                          <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm px-5 py-2 rounded-lg border border-slate-600 shadow-lg">
                            <Eye className="text-blue-400" size={22} />
                            <span className="text-slate-100 font-semibold">{playerInfo.pageViews} views</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="flex gap-4 mb-6 flex-wrap border-t border-amber-500/30 pt-6">
                    <button
                      onClick={() => setActiveView('info')}
                      className={`px-5 py-3 rounded-lg font-bold transition-all shadow-lg ${
                        activeView === 'info'
                          ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/50'
                          : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 border border-slate-600'
                      }`}
                    >
                      <Trophy className="inline mr-2" size={18} />
                      Peak Ranks
                    </button>
                    <button
                      onClick={() => setActiveView('overview')}
                      className={`px-5 py-3 rounded-lg font-bold transition-all shadow-lg ${
                        activeView === 'overview'
                          ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/50'
                          : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 border border-slate-600'
                      }`}
                    >
                      <Target className="inline mr-2" size={18} />
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveView('heroes')}
                      className={`px-5 py-3 rounded-lg font-bold transition-all shadow-lg ${
                        activeView === 'heroes'
                          ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/50'
                          : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 border border-slate-600'
                      }`}
                    >
                      <Sparkles className="inline mr-2" size={18} />
                      Heroes
                    </button>
                    <button
                      onClick={() => setActiveView('roles')}
                      className={`px-5 py-3 rounded-lg font-bold transition-all shadow-lg ${
                        activeView === 'roles'
                          ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/50'
                          : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 border border-slate-600'
                      }`}
                    >
                      <Award className="inline mr-2" size={18} />
                      Roles
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="bg-slate-950/80 backdrop-blur-md rounded-lg p-6 border border-slate-700">
                    {activeView === 'info' && peakRanks && (
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 drop-shadow-lg">
                          <Trophy className="text-amber-400" />
                          Peak Ranks History
                        </h3>
                        
                        {/* Lifetime Peak */}
                        {peakRanks.lifetimePeakRanked && (
                          <div className="mb-6 p-6 bg-gradient-to-r from-amber-900/70 to-orange-900/70 backdrop-blur-sm border-2 border-amber-500 rounded-lg shadow-xl">
                            <h4 className="text-amber-300 font-bold text-xl mb-4 flex items-center gap-2">
                              <Trophy size={28} />
                              Lifetime Peak Rank
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <StatItem label="Rank" value={peakRanks.lifetimePeakRanked.tierName} />
                              <StatItem label="MMR" value={Math.round(peakRanks.lifetimePeakRanked.mmr)} />
                              <StatItem label="Season" value={peakRanks.lifetimePeakRanked.season} />
                              <StatItem label="Season Name" value={peakRanks.lifetimePeakRanked.seasonName} />
                            </div>
                          </div>
                        )}

                        {/* Season by Season */}
                        {peakRanks.peakTiers && (
                          <div className="space-y-3">
                            <h4 className="text-amber-400 font-bold text-lg mb-4">Season History</h4>
                            {peakRanks.peakTiers.map((tier: any, idx: number) => (
                              <div key={idx} className="bg-slate-800/70 backdrop-blur-sm rounded-lg p-5 hover:bg-slate-700/70 transition-all border border-slate-600 shadow-lg">
                                <div className="flex items-center gap-4">
                                  {tier.tierIcon && (
                                    <img src={tier.tierIcon} alt={tier.tierName} className="w-14 h-14 drop-shadow-lg" />
                                  )}
                                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                      <div className="text-amber-300 text-xs font-semibold">Season</div>
                                      <div className="text-white font-bold text-lg">{tier.season}</div>
                                    </div>
                                    <div>
                                      <div className="text-amber-300 text-xs font-semibold">Rank</div>
                                      <div className="text-white font-bold text-lg">{tier.tierName}</div>
                                    </div>
                                    <div>
                                      <div className="text-amber-300 text-xs font-semibold">MMR</div>
                                      <div className="text-white font-bold text-lg">{Math.round(tier.mmr)}</div>
                                    </div>
                                    <div>
                                      <div className="text-amber-300 text-xs font-semibold">Season Name</div>
                                      <div className="text-white font-bold">{tier.seasonName}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeView === 'overview' && overview && (
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 drop-shadow-lg">
                          <Target className="text-blue-400" />
                          Overview Stats
                        </h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <StatsCard icon={Clock} label="Time Played" value={formatTime(overview.timePlayed)} color="blue" />
                          <StatsCard icon={Trophy} label="Matches Won" value={`${overview.matchesWon}/${overview.matchesPlayed}`} color="green" />
                          <StatsCard icon={TrendingUp} label="Win Rate" value={`${overview.matchesWinPct.toFixed(1)}%`} color="yellow" />
                          <StatsCard icon={Award} label="Ranked MMR" value={overview.ranked} color="purple" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                          <StatsCard icon={Crosshair} label="Kills" value={overview.kills} color="red" />
                          <StatsCard icon={Target} label="Deaths" value={overview.deaths} color="orange" />
                          <StatsCard icon={Users} label="Assists" value={overview.assists} color="blue" />
                          <StatsCard icon={Zap} label="K/D Ratio" value={overview.kdRatio.toFixed(2)} color="green" />
                          <StatsCard icon={Sparkles} label="KDA Ratio" value={overview.kdaRatio.toFixed(2)} color="purple" />
                          <StatsCard icon={Trophy} label="MVP" value={`${overview.totalMvp} (${overview.totalMvpPct.toFixed(1)}%)`} color="yellow" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <StatsCard icon={Swords} label="Damage/Min" value={overview.totalHeroDamagePerMinute} color="red" />
                          <StatsCard icon={Heart} label="Healing/Min" value={overview.totalHeroHealPerMinute} color="green" />
                          <StatsCard icon={Shield} label="Damage Taken/Min" value={overview.totalDamageTakenPerMinute} color="blue" />
                        </div>
                      </div>
                    )}

                    {activeView === 'heroes' && heroes && (
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 drop-shadow-lg">
                          <Sparkles className="text-purple-400" />
                          Hero Stats
                        </h3>
                        
                        <div className="space-y-4">
                          {Object.entries(heroes)
                            .filter(([_, stats]: any) => stats.matchesPlayed > 0)
                            .sort((a: any, b: any) => b[1].timePlayed - a[1].timePlayed)
                            .map(([heroName, stats]: any) => (
                              <div key={heroName} className="bg-slate-800/70 backdrop-blur-sm rounded-lg p-6 hover:bg-slate-700/70 transition-all border border-slate-600 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-2xl font-bold text-white drop-shadow-md">{heroName}</h4>
                                  <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                                    stats.matchesWinPct >= 60 ? 'bg-green-600 text-white' :
                                    stats.matchesWinPct >= 50 ? 'bg-amber-600 text-white' :
                                    'bg-red-600 text-white'
                                  }`}>
                                    {stats.matchesWinPct.toFixed(0)}% WR
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                  <MiniStat label="Time Played" value={formatTime(stats.timePlayed)} />
                                  <MiniStat label="Matches" value={`${stats.matchesWon}/${stats.matchesPlayed}`} />
                                  <MiniStat label="K/D/A" value={`${stats.kills}/${stats.deaths}/${stats.assists}`} />
                                  <MiniStat label="KDA" value={stats.kdaRatio.toFixed(2)} />
                                  <MiniStat label="Dmg/Min" value={stats.totalHeroDamagePerMinute} />
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {activeView === 'roles' && roles && (
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 drop-shadow-lg">
                          <Award className="text-green-400" />
                          Role Stats
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(roles).map(([roleName, stats]: any) => (
                            <div key={roleName} className="bg-slate-800/70 backdrop-blur-sm rounded-lg p-6 hover:bg-slate-700/70 transition-all border border-slate-600 shadow-lg">
                              <div className="flex items-center gap-3 mb-4">
                                {roleName === 'Duelist' && <Crosshair className="text-red-400 drop-shadow-glow" size={36} />}
                                {roleName === 'Vanguard' && <Shield className="text-blue-400 drop-shadow-glow" size={36} />}
                                {roleName === 'Strategist' && <Heart className="text-green-400 drop-shadow-glow" size={36} />}
                                <div>
                                  <h4 className="text-2xl font-bold text-white drop-shadow-md">{roleName}</h4>
                                  <p className="text-amber-300 text-sm font-semibold">{stats.matchesWinPct.toFixed(1)}% Win Rate</p>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-amber-200 font-semibold">Time Played</span>
                                  <span className="text-white font-bold">{formatTime(stats.timePlayed)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-amber-200 font-semibold">Matches</span>
                                  <span className="text-white font-bold">{stats.matchesWon}/{stats.matchesPlayed.toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-amber-200 font-semibold">K/D/A</span>
                                  <span className="text-white font-bold">{stats.kills}/{stats.deaths}/{stats.assists}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-amber-200 font-semibold">KDA Ratio</span>
                                  <span className="text-white font-bold">{stats.kdaRatio.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-amber-200 font-semibold">Damage/Min</span>
                                  <span className="text-white font-bold">{stats.totalHeroDamagePerMinute}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {!playerInfo && !loading && !error && (
            <div className="max-w-4xl mx-auto text-center py-12">
              <Trophy className="mx-auto mb-4 text-amber-400 drop-shadow-glow" size={72} />
              <p className="text-white text-2xl font-bold mb-2 drop-shadow-lg">Search for a player to view their stats</p>
              <p className="text-amber-200 font-semibold">Try searching: <span className="text-amber-400 font-bold">zmqrio</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-amber-200 text-xs mb-1 font-semibold">{label}</div>
      <div className="text-white font-bold text-xl drop-shadow-md">{value}</div>
    </div>
  );
}

function StatsCard({ icon: Icon, label, value, color }: any) {
  const colors: Record<string, string> = {
    red: 'text-red-400',
    orange: 'text-orange-400',
    yellow: 'text-amber-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400'
  };

  return (
    <div className="bg-slate-800/70 backdrop-blur-sm rounded-lg p-5 text-center border border-slate-600 shadow-lg hover:bg-slate-700/70 transition-all">
      <Icon className={`${colors[color]} mx-auto mb-2 drop-shadow-glow`} size={32} />
      <div className="text-3xl font-bold text-white mb-1 drop-shadow-md">{value}</div>
      <div className="text-amber-200 text-sm font-semibold">{label}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-amber-300 text-xs mb-1 font-semibold">{label}</div>
      <div className="text-white font-bold drop-shadow-sm">{value}</div>
    </div>
  );
}