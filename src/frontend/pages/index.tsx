import React, { useState, useEffect } from 'react';
import { FilterPanel } from '../components/FilterPanel';
import { fetchTrends, TrendRequest, Trend, TrendsResponse } from '../utils/api';

const Home: React.FC = () => {
  const [params, setParams] = useState<TrendRequest>({ geo: 'HK', hl: 'en', hours: 24 });
  const [trendsData, setTrendsData] = useState<TrendsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTrends(params);
      setTrendsData(data);
    } catch (err) {
      setError('Failed to fetch trends. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, 60000); // Refresh every minute
      setRefreshInterval(interval as unknown as number);
      return () => clearInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval as unknown as NodeJS.Timeout);
        setRefreshInterval(null);
      }
    }
  }, [autoRefresh, params]);

  // Remove automatic fetching on params change
  // useEffect(() => {
  //   fetchData();
  // }, [params]);

  const downloadJSON = async () => {
    try {
      const data = await fetchTrends(params);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `google_trends_${params.geo}_${timestamp}.json`;
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download trends data.');
    }
  };

  const getCountryFlag = (countryCode: string) => {
    const flagMap: { [key: string]: string } = {
      'HK': '🇭🇰', 'US': '🇺🇸', 'GB': '🇬🇧', 'JP': '🇯🇵', 'CA': '🇨🇦',
      'AU': '🇦🇺', 'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸',
      'BR': '🇧🇷', 'IN': '🇮🇳', 'KR': '🇰🇷', 'SG': '🇸🇬', 'MY': '🇲🇾',
      'TH': '🇹🇭', 'PH': '🇵🇭', 'VN': '🇻🇳', 'ID': '🇮🇩', 'TW': '🇹🇼'
    };
    return flagMap[countryCode] || '🌍';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">📈</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Google Trends Explorer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover what's trending around the world with real-time Google Trends data
          </p>
        </header>

        {/* Filter Panel */}
        <div className="mb-8">
          <FilterPanel params={params} onChange={setParams} onFetch={fetchData} />
        </div>

        {/* Control Panel */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <button
                  onClick={fetchData}
                  disabled={loading}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg focus:ring-4 focus:ring-indigo-300 focus:outline-none"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🔄</span>
                      <span>Refresh Data</span>
                    </>
                  )}
                </button>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="autoRefresh"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="autoRefresh" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Auto-refresh (1 min)
                  </label>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <button
                  onClick={downloadJSON}
                  disabled={!trendsData}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  <span className="text-lg">💾</span>
                  <span>Export JSON</span>
                </button>
                
                {trendsData && (
                  <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                    <span className="font-medium">Last updated:</span> {new Date(trendsData.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-3xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-800 mb-2">Error Occurred</h3>
                <p className="text-red-700 text-lg mb-4">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <span>✕</span>
                  <span>Dismiss</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !trendsData && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-2xl mb-8">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Fetching Latest Trends...</h3>
            <p className="text-gray-600 text-lg mb-2">Please wait while we gather the most recent data</p>
            <p className="text-gray-500">Target location: {getCountryFlag(params.geo || 'US')} {params.geo || 'Global'}</p>
          </div>
        )}

        {/* Trends Data */}
        {trendsData && (
          <div className="space-y-8">
            {/* Stats Header */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center transform hover:scale-105 transition-all duration-200">
                  <div className="text-4xl font-bold mb-2">{trendsData.total_trends}</div>
                  <div className="text-blue-100 font-medium">Total Trends</div>
                  <div className="text-xs text-blue-200 mt-1">Available topics</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-6 text-white text-center transform hover:scale-105 transition-all duration-200">
                  <div className="text-4xl font-bold mb-2">{getCountryFlag(params.geo || 'US')}</div>
                  <div className="text-green-100 font-medium">{trendsData.location}</div>
                  <div className="text-xs text-green-200 mt-1">Target location</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center transform hover:scale-105 transition-all duration-200">
                  <div className="text-4xl font-bold mb-2">🗣️</div>
                  <div className="text-purple-100 font-medium">{trendsData.language}</div>
                  <div className="text-xs text-purple-200 mt-1">Interface language</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white text-center transform hover:scale-105 transition-all duration-200">
                  <div className="text-4xl font-bold mb-2">⏰</div>
                  <div className="text-orange-100 font-medium">
                    {new Date(trendsData.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-xs text-orange-200 mt-1">Last updated</div>
                </div>
              </div>
            </div>

            {/* Trends List */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                      <span className="text-4xl">🔥</span>
                      <span>Trending Now</span>
                    </h2>
                    <p className="text-indigo-100 mt-2 text-lg">
                      {trendsData.topics.length} trends found for {trendsData.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-indigo-200">Data Source</div>
                    <div className="text-lg font-semibold">Google Trends</div>
                  </div>
                </div>
              </div>
              
              {trendsData.topics.length === 0 ? (
                <div className="p-16 text-center text-gray-500">
                  <span className="text-8xl mb-6 block">🔍</span>
                  <h3 className="text-2xl font-bold mb-4 text-gray-700">No trends found</h3>
                  <p className="text-lg">Try adjusting your filters or check back later.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <span>#</span>
                            <span>Rank</span>
                          </div>
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <span>📝</span>
                            <span>Trend Topic</span>
                          </div>
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <span>📊</span>
                            <span>Search Volume</span>
                          </div>
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <span>📈</span>
                            <span>Change</span>
                          </div>
                        </th>
                        <th className="px-8 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center justify-center gap-2">
                            <span>🔗</span>
                            <span>Action</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {trendsData.topics.map((trend, index) => (
                        <tr key={`${trend.title}-${index}`} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200">
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold text-lg shadow-lg">
                              {trend.ranking || index + 1}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="max-w-md">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">
                                {trend.title}
                              </h3>
                              {trend.related_queries && trend.related_queries.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {trend.related_queries.slice(0, 3).map((query, qIndex) => (
                                    <span key={qIndex} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                      {query}
                                    </span>
                                  ))}
                                  {trend.related_queries.length > 3 && (
                                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                      +{trend.related_queries.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            {trend.search_volume ? (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-lg font-medium text-gray-900">
                                  {trend.search_volume}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No data</span>
                            )}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            {trend.change_percentage ? (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-lg font-medium text-green-600">
                                  {trend.change_percentage}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No data</span>
                            )}
                          </td>
                          <td className="px-8 py-6 text-center">
                            {trend.url ? (
                              <a
                                href={trend.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                              >
                                <span>🔗</span>
                                <span>View</span>
                              </a>
                            ) : (
                              <span className="text-gray-400 text-sm">No link</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-xl">ℹ️</span>
                    Data Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Source:</span>
                      <a 
                        href={trendsData.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                      >
                        Google Trends
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Updated:</span>
                      <span className="text-gray-600">{new Date(trendsData.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Total Results:</span>
                      <span className="text-gray-600">{trendsData.total_trends} trends</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-xl">📋</span>
                    Instructions
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Use the <strong>Filter Mode</strong> to customize search parameters</p>
                    <p>• Use the <strong>URL Mode</strong> to import Google Trends URLs</p>
                    <p>• Click <strong>Fetch Trends Data</strong> to get the latest results</p>
                    <p>• Enable <strong>Auto-refresh</strong> for real-time updates</p>
                    <p>• Use <strong>Export JSON</strong> to save your data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;