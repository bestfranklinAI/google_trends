import React, { useState } from 'react';
import { TrendRequest } from '../utils/api';

interface Props {
  params: TrendRequest;
  onChange: (next: TrendRequest) => void;
  onFetch: () => void;
}

export const FilterPanel: React.FC<Props> = ({ params, onChange, onFetch }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<'filters' | 'url'>('filters');

  const handleInput = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsed: string | number | undefined = value === '' ? undefined : value;
    if (name === 'hours' && parsed !== undefined) {
      parsed = parseInt(parsed as string, 10);
    }
    onChange({ ...params, [name]: parsed });
  };

  // Updated categories based on Google Trends
  const categories = [
    { value: '', label: 'All Categories', icon: '📊' },
    { value: '1', label: 'Autos and Vehicles', icon: '🚗' },
    { value: '2', label: 'Beauty and Fashion', icon: '' },
    { value: '3', label: 'Business and Finance', icon: '💼' },
    { value: '4', label: 'Entertainment', icon: '🎭' },
    { value: '5', label: 'Food and Drink', icon: '🍕' },
    { value: '6', label: 'Games', icon: '🎮' },
    { value: '7', label: 'Health', icon: '🏥' },
    { value: '8', label: 'Hobbies and Leisure', icon: '🎨' },
    { value: '9', label: 'Jobs and Education', icon: '🎓' },
    { value: '10', label: 'Law and Government', icon: '⚖️' },
    { value: '11', label: 'Other', icon: '' },
    { value: '13', label: 'Pets and Animals', icon: '' },
    { value: '14', label: 'Politics', icon: '️' },
    { value: '15', label: 'Science', icon: '' },
    { value: '16', label: 'Shopping', icon: '🛒' },
    { value: '17', label: 'Sports', icon: '⚽' },
    { value: '18', label: 'Technology', icon: '' },
    { value: '19', label: 'Travel and Transportation', icon: '✈️' },
    { value: '20', label: 'Climate', icon: '🌡️' }
  ];

  // Updated hours based on Google Trends
  const hoursOptions = [
    { value: '', label: 'All Time', icon: '♾️' },
    { value: '4', label: 'Past 4 Hours', icon: '🕐' },
    { value: '24', label: 'Past Day', icon: '📅' },
    { value: '48', label: 'Past 2 Days', icon: '📆' },
    { value: '168', label: 'Past Week', icon: '🗓️' }
  ];

  const locations = [
    { value: 'HK', label: '🇭🇰 Hong Kong', region: 'Asia' },
    { value: 'US', label: '🇺🇸 United States', region: 'Americas' },
    { value: 'GB', label: '🇬🇧 United Kingdom', region: 'Europe' },
    { value: 'JP', label: '🇯🇵 Japan', region: 'Asia' },
    { value: 'CA', label: '🇨🇦 Canada', region: 'Americas' },
    { value: 'AU', label: '🇦🇺 Australia', region: 'Oceania' },
    { value: 'DE', label: '🇩🇪 Germany', region: 'Europe' },
    { value: 'FR', label: '🇫🇷 France', region: 'Europe' },
    { value: 'IT', label: '🇮🇹 Italy', region: 'Europe' },
    { value: 'ES', label: '🇪🇸 Spain', region: 'Europe' },
    { value: 'BR', label: '🇧🇷 Brazil', region: 'Americas' },
    { value: 'IN', label: '🇮🇳 India', region: 'Asia' },
    { value: 'KR', label: '🇰🇷 South Korea', region: 'Asia' },
    { value: 'SG', label: '🇸🇬 Singapore', region: 'Asia' },
    { value: 'MY', label: '🇲🇾 Malaysia', region: 'Asia' },
    { value: 'TH', label: '🇹🇭 Thailand', region: 'Asia' },
    { value: 'PH', label: '🇵🇭 Philippines', region: 'Asia' },
    { value: 'VN', label: '🇻🇳 Vietnam', region: 'Asia' },
    { value: 'ID', label: '🇮🇩 Indonesia', region: 'Asia' },
    { value: 'TW', label: '🇹🇼 Taiwan', region: 'Asia' },
    { value: 'MX', label: '🇲🇽 Mexico', region: 'Americas' },
    { value: 'AR', label: '🇦🇷 Argentina', region: 'Americas' },
    { value: 'CL', label: '🇨🇱 Chile', region: 'Americas' },
    { value: 'CO', label: '🇨🇴 Colombia', region: 'Americas' },
    { value: 'PE', label: '🇵🇪 Peru', region: 'Americas' }
  ];

  const languages = [
    { value: 'en', label: 'English', native: 'English' },
    { value: 'zh', label: '中文', native: 'Chinese' },
    { value: 'es', label: 'Español', native: 'Spanish' },
    { value: 'fr', label: 'Français', native: 'French' },
    { value: 'de', label: 'Deutsch', native: 'German' },
    { value: 'it', label: 'Italiano', native: 'Italian' },
    { value: 'pt', label: 'Português', native: 'Portuguese' },
    { value: 'ru', label: 'Русский', native: 'Russian' },
    { value: 'ja', label: '日本語', native: 'Japanese' },
    { value: 'ko', label: '한국어', native: 'Korean' },
    { value: 'ar', label: 'العربية', native: 'Arabic' },
    { value: 'hi', label: 'हिन्दी', native: 'Hindi' },
    { value: 'th', label: 'ไทย', native: 'Thai' },
    { value: 'vi', label: 'Tiếng Việt', native: 'Vietnamese' },
    { value: 'id', label: 'Bahasa Indonesia', native: 'Indonesian' },
    { value: 'ms', label: 'Bahasa Melayu', native: 'Malay' },
    { value: 'tl', label: 'Filipino', native: 'Filipino' },
    { value: 'nl', label: 'Nederlands', native: 'Dutch' },
    { value: 'sv', label: 'Svenska', native: 'Swedish' },
    { value: 'da', label: 'Dansk', native: 'Danish' },
    { value: 'no', label: 'Norsk', native: 'Norwegian' },
    { value: 'fi', label: 'Suomi', native: 'Finnish' },
    { value: 'pl', label: 'Polski', native: 'Polish' },
    { value: 'cs', label: 'Čeština', native: 'Czech' },
    { value: 'hu', label: 'Magyar', native: 'Hungarian' }
  ];

  // Updated sort options based on Google Trends
  const sortOptions = [
    { value: '', label: 'Default Order', icon: '🔢' },
    { value: 'title', label: 'Title', icon: '🔤' },
    { value: 'search-volume', label: 'Search Volume', icon: '📊' },
    { value: 'recency', label: 'Recency', icon: '⏰' },
    { value: 'relevance', label: 'Relevance', icon: '🎯' }
  ];

  const currentCategory = categories.find(cat => cat.value === params.category);
  const currentHours = hoursOptions.find(hour => hour.value === params.hours?.toString());
  const currentLocation = locations.find(loc => loc.value === params.geo);
  const currentLanguage = languages.find(lang => lang.value === params.hl);
  const currentSort = sortOptions.find(sort => sort.value === params.sort);

  const handleFetch = () => {
    onFetch();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <span className="text-3xl">🎛️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Search Configuration</h2>
              <p className="text-indigo-100 mt-1">Configure your Google Trends search parameters</p>
            </div>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            <span className={`text-2xl transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
        </div>
        
        {/* Quick Summary */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium">
            <span>🌍</span>
            <span>{currentLocation?.label || 'All Locations'}</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium">
            <span>🗣️</span>
            <span>{currentLanguage?.native || 'Default'}</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium">
            <span>{currentHours?.icon || '♾️'}</span>
            <span>{currentHours?.label || 'All Time'}</span>
          </div>
          {currentCategory && currentCategory.value !== '' && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium">
              <span>{currentCategory.icon}</span>
              <span>{currentCategory.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`transition-all duration-500 ease-in-out ${collapsed ? 'max-h-0 opacity-0' : 'max-h-none opacity-100'}`}>
        {/* Mode Selector */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 p-2 rounded-xl">
              <div className="flex">
                <button
                  onClick={() => {
                    setMode('filters');
                    // Clear URL parameter when switching to filter mode
                    const newParams = { ...params };
                    delete newParams.url;
                    onChange(newParams);
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    mode === 'filters'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  🎛️ Filter Mode
                </button>
                <button
                  onClick={() => {
                    setMode('url');
                    // Clear filter parameters when switching to URL mode, keep geo and hl
                    const newParams = { 
                      geo: params.geo, 
                      hl: params.hl,
                      ...(params.url && { url: params.url })
                    };
                    onChange(newParams);
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    mode === 'url'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  🔗 URL Mode
                </button>
              </div>
            </div>
          </div>
        </div>

        {mode === 'filters' ? (
          <div className="p-8 space-y-8">
            {/* Primary Filters */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                Primary Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="text-lg">🌍</span>
                    <span>Location</span>
                  </label>
                  <select
                    name="geo"
                    value={params.geo || ''}
                    onChange={handleInput}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-gray-400 text-gray-700"
                  >
                    {locations.map((loc) => (
                      <option key={loc.value} value={loc.value}>
                        {loc.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="text-lg">🗣️</span>
                    <span>Language</span>
                  </label>
                  <select
                    name="hl"
                    value={params.hl || ''}
                    onChange={handleInput}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-gray-400 text-gray-700"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Period */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="text-lg">⏰</span>
                    <span>Time Period</span>
                  </label>
                  <select
                    name="hours"
                    value={params.hours?.toString() || ''}
                    onChange={handleInput}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-gray-400 text-gray-700"
                  >
                    {hoursOptions.map((hour) => (
                      <option key={hour.value} value={hour.value}>
                        {hour.icon} {hour.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Secondary Filters */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                Advanced Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="text-lg">📂</span>
                    <span>Category</span>
                  </label>
                  <select
                    name="category"
                    value={params.category || ''}
                    onChange={handleInput}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-gray-400 text-gray-700"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="text-lg"></span>
                    <span>Sort Order</span>
                  </label>
                  <select
                    name="sort"
                    value={params.sort || ''}
                    onChange={handleInput}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-gray-400 text-gray-700"
                  >
                    {sortOptions.map((sort) => (
                      <option key={sort.value} value={sort.value}>
                        {sort.icon} {sort.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <span className="text-lg">📋</span>
                </div>
                <h4 className="font-bold text-gray-800">Current Configuration</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="text-indigo-600">{currentLocation?.label || 'All Locations'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Language:</span>
                    <span className="text-indigo-600">{currentLanguage?.native || 'Default'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Time Period:</span>
                    <span className="text-indigo-600">{currentHours?.label || 'All Time'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="text-indigo-600">{currentCategory?.label || 'All Categories'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Sort Order:</span>
                    <span className="text-indigo-600">{currentSort?.label || 'Default Order'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">🔗</span>
                Google Trends URL
              </h3>
              <p className="text-gray-600 mb-6">
                Paste a Google Trends URL to automatically extract and fetch the data.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Google Trends URL
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={params.url || ''}
                    onChange={handleInput}
                    placeholder="https://trends.google.com/trends/trendingsearches/daily?geo=US&hl=en"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-gray-400 text-gray-700"
                  />
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 text-lg">💡</span>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">How to use URL mode:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Visit Google Trends (trends.google.com)</li>
                        <li>• Configure your search parameters</li>
                        <li>• Copy the URL from your browser</li>
                        <li>• Paste it above and click "Fetch Data"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fetch Button */}
        <div className="p-8 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <button
              onClick={handleFetch}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-indigo-300 focus:outline-none"
            >
              <span className="text-xl">🚀</span>
              <span>Fetch Trends Data</span>
            </button>
          </div>
          <p className="text-center text-gray-600 mt-3 text-sm">
            Click to fetch the latest trends data based on your configuration
          </p>
        </div>
      </div>
    </div>
  );
};