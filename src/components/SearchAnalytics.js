import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { auth } from '../config/firebase';
import './SearchAnalytics.css';

const SearchAnalytics = () => {
  const { t } = useLocalization();
  const [searchData, setSearchData] = useState([]);
  const [timeframe, setTimeframe] = useState('week');
  const [stats, setStats] = useState({
    totalSearches: 0,
    uniqueSearches: 0,
    avgSearchsPerDay: 0,
    topSearch: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSearchAnalytics();
  }, [timeframe]);

  useEffect(() => {
    calculateStats();
  }, [searchData]);

  const fetchSearchAnalytics = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch(`/api/searches/analytics?timeframe=${timeframe}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSearchData(data || []);
    } catch (error) {
      console.error('Error fetching search analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (searchData.length === 0) return;

    const totalSearches = searchData.reduce((sum, s) => sum + (s.count || 0), 0);
    const uniqueSearches = searchData.length;
    const avgSearchsPerDay = (totalSearches / 7).toFixed(1);
    const topSearch = searchData[0]?.query || 'N/A';

    setStats({
      totalSearches,
      uniqueSearches,
      avgSearchsPerDay,
      topSearch
    });
  };

  const handleClearSearch = async (id) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      await fetch(`/api/searches/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setSearchData(searchData.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error clearing search:', error);
    }
  };

  const handleTrackSearch = async (query) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      await fetch('/api/searches/track', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      fetchSearchAnalytics();
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  };

  const getTrendPercentage = (current, previous) => {
    if (previous === 0) return 100;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const getTrendIcon = (percentage) => {
    if (percentage > 0) return '📈';
    if (percentage < 0) return '📉';
    return '→';
  };

  if (loading) {
    return <div className="loading">{t('common', 'loading')}</div>;
  }

  return (
    <div className="search-analytics">
      <div className="analytics-header">
        <h1 className="analytics-title">
          🔍 {t('searchAnalytics', 'title') || 'Search Analytics'}
        </h1>
        <p className="analytics-subtitle">
          {t('searchAnalytics', 'subtitle') || 'Track popular searches and customer behavior'}
        </p>
      </div>

      <div className="timeframe-selector">
        <label>{t('searchAnalytics', 'timeframe') || 'Timeframe:'}</label>
        <div className="timeframe-buttons">
          {['week', 'month', 'year'].map((tf) => (
            <button
              key={tf}
              className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf === 'week' && 'This Week'}
              {tf === 'month' && 'This Month'}
              {tf === 'year' && 'This Year'}
            </button>
          ))}
        </div>
      </div>

      <div className="analytics-stats">
        <div className="stat-card">
          <span className="stat-icon">🔍</span>
          <div className="stat-info">
            <div className="stat-label">{t('searchAnalytics', 'totalSearches') || 'Total Searches'}</div>
            <div className="stat-value">{stats.totalSearches}</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✨</span>
          <div className="stat-info">
            <div className="stat-label">{t('searchAnalytics', 'uniqueSearches') || 'Unique Searches'}</div>
            <div className="stat-value">{stats.uniqueSearches}</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div className="stat-info">
            <div className="stat-label">{t('searchAnalytics', 'avgPerDay') || 'Avg Per Day'}</div>
            <div className="stat-value">{stats.avgSearchsPerDay}</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <div className="stat-info">
            <div className="stat-label">{t('searchAnalytics', 'topSearch') || 'Top Search'}</div>
            <div className="stat-value" style={{ fontSize: '14px', wordBreak: 'break-word' }}>
              {stats.topSearch}
            </div>
          </div>
        </div>
      </div>

      <div className="searches-container">
        <div className="searches-header">
          <h2>{t('searchAnalytics', 'populartSearches') || 'Popular Searches'}</h2>
        </div>

        {searchData.length === 0 ? (
          <div className="empty-state">
            <p className="empty-emoji">🔍</p>
            <p className="empty-text">{t('searchAnalytics', 'noData') || 'No search data available'}</p>
          </div>
        ) : (
          <div className="searches-list">
            {searchData.map((item, index) => (
              <div key={item.id || index} className="search-item">
                <div className="search-rank">
                  <span className="rank-number">#{index + 1}</span>
                </div>

                <div className="search-query">
                  <h4 className="query-text">{item.query}</h4>
                  <span className="query-category">
                    {item.category || t('searchAnalytics', 'general') || 'General'}
                  </span>
                </div>

                <div className="search-metrics">
                  <div className="metric">
                    <span className="metric-label">{t('searchAnalytics', 'searches') || 'Searches'}</span>
                    <span className="metric-value">{item.count || 0}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">{t('searchAnalytics', 'clicks') || 'Clicks'}</span>
                    <span className="metric-value">{item.clicks || 0}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">{t('searchAnalytics', 'ctr') || 'CTR'}</span>
                    <span className="metric-value">
                      {item.count > 0 ? ((item.clicks / item.count) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>

                <div className="search-trend">
                  <span className="trend-icon">
                    {getTrendIcon(item.trendPercentage)}
                  </span>
                  <span className="trend-value">
                    {Math.abs(item.trendPercentage || 0)}%
                  </span>
                </div>

                <div className="search-visualization">
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(item.count / Math.max(...searchData.map(s => s.count))) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>

                <button
                  className="btn-action"
                  onClick={() => handleClearSearch(item.id)}
                  title={t('searchAnalytics', 'clear') || 'Clear'}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="search-insights">
        <h3>{t('searchAnalytics', 'insights') || 'Insights & Recommendations'}</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <span className="insight-icon">💡</span>
            <div>
              <h4>{t('searchAnalytics', 'topSearchTrend') || 'Top Search Trend'}</h4>
              <p>
                {stats.topSearch !== 'N/A'
                  ? `"${stats.topSearch}" is your most searched term. Consider optimizing content around this.`
                  : 'No search data available yet'}
              </p>
            </div>
          </div>
          <div className="insight-card">
            <span className="insight-icon">🎯</span>
            <div>
              <h4>{t('searchAnalytics', 'customerBehavior') || 'Customer Behavior'}</h4>
              <p>
                {stats.totalSearches > 100
                  ? 'High search volume indicates strong customer interest. Keep inventory well-stocked.'
                  : 'Search volume is moderate. Consider promotional campaigns to increase engagement.'}
              </p>
            </div>
          </div>
          <div className="insight-card">
            <span className="insight-icon">📈</span>
            <div>
              <h4>{t('searchAnalytics', 'optimization') || 'SEO Optimization'}</h4>
              <p>
                Top searches are not ranking well? Update product descriptions and metadata to match popular search terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAnalytics;
