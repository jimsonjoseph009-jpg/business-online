import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { auth } from '../config/firebase';
import './Reviews.css';

const Reviews = () => {
  const { t } = useLocalization();
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState('all');
  const [averageRating, setAverageRating] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    withImages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterAndSortReviews();
  }, [reviews, sortBy, filterRating]);

  const filterAndSortReviews = () => {
    let filtered = [...reviews];

    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(r => r.rating === parseInt(filterRating));
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'helpful':
        filtered.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
      case 'rating-high':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'rating-low':
        filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      default:
        break;
    }

    setFilteredReviews(filtered);
  };

  const fetchReviews = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch('/api/reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setReviews(data || []);

      // Calculate stats
      if (data && data.length > 0) {
        const avg = (data.reduce((sum, r) => sum + (r.rating || 0), 0) / data.length).toFixed(1);
        setAverageRating(parseFloat(avg));

        setStats({
          total: data.length,
          verified: data.filter(r => r.verifiedPurchase).length,
          withImages: data.filter(r => r.images && r.images.length > 0).length
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setReviews(
        reviews.map(r =>
          r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r
        )
      );
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const handleVerifyPurchase = async (reviewId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      await fetch(`/api/reviews/${reviewId}/verify`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ verifiedPurchase: true })
      });

      setReviews(
        reviews.map(r =>
          r.id === reviewId ? { ...r, verifiedPurchase: true } : r
        )
      );
    } catch (error) {
      console.error('Error verifying purchase:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#48bb78';
    if (rating >= 3) return '#f6ad55';
    return '#f56565';
  };

  if (loading) {
    return <div className="loading">{t('common', 'loading')}</div>;
  }

  return (
    <div className="reviews">
      <div className="reviews-header">
        <h1 className="reviews-title">
          ⭐ {t('reviews', 'title') || 'Customer Reviews'}
        </h1>
        <div className="reviews-summary">
          <div className="rating-box">
            <div className="rating-number">{averageRating}</div>
            <div className="rating-stars">{renderStars(Math.round(averageRating))}</div>
            <div className="rating-total">({stats.total} {t('reviews', 'reviews') || 'reviews'})</div>
          </div>
        </div>
      </div>

      <div className="reviews-stats">
        <div className="stat-card">
          <span className="stat-icon">📝</span>
          <div className="stat-info">
            <div className="stat-label">{t('reviews', 'totalReviews') || 'Total Reviews'}</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✓</span>
          <div className="stat-info">
            <div className="stat-label">{t('reviews', 'verifiedPurchases') || 'Verified Purchases'}</div>
            <div className="stat-value">{stats.verified}</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🖼️</span>
          <div className="stat-info">
            <div className="stat-label">{t('reviews', 'withImages') || 'With Images'}</div>
            <div className="stat-value">{stats.withImages}</div>
          </div>
        </div>
      </div>

      <div className="reviews-controls">
        <div className="control-group">
          <label>{t('reviews', 'sortBy') || 'Sort By:'}</label>
          <select
            className="select-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">{t('reviews', 'mostRecent') || 'Most Recent'}</option>
            <option value="helpful">{t('reviews', 'mostHelpful') || 'Most Helpful'}</option>
            <option value="rating-high">{t('reviews', 'highestRating') || 'Highest Rating'}</option>
            <option value="rating-low">{t('reviews', 'lowestRating') || 'Lowest Rating'}</option>
          </select>
        </div>

        <div className="control-group">
          <label>{t('reviews', 'filterByRating') || 'Filter By Rating:'}</label>
          <select
            className="select-input"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="all">{t('reviews', 'allRatings') || 'All Ratings'}</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 {t('reviews', 'stars') || 'Stars'}</option>
            <option value="4">⭐⭐⭐⭐ 4 {t('reviews', 'stars') || 'Stars'}</option>
            <option value="3">⭐⭐⭐ 3 {t('reviews', 'stars') || 'Stars'}</option>
            <option value="2">⭐⭐ 2 {t('reviews', 'stars') || 'Stars'}</option>
            <option value="1">⭐ 1 {t('reviews', 'star') || 'Star'}</option>
          </select>
        </div>
      </div>

      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <div className="empty-state">
            <p>⭐</p>
            <p>{t('reviews', 'noReviews') || 'No reviews yet'}</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="review-user-info">
                  <div className="review-avatar">👤</div>
                  <div>
                    <div className="review-author">{review.author}</div>
                    <div className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="review-badges">
                  {review.verifiedPurchase && (
                    <span className="badge verified" title={t('reviews', 'verifiedPurchase') || 'Verified Purchase'}>
                      ✓ {t('reviews', 'verified') || 'Verified'}
                    </span>
                  )}
                </div>
              </div>

              <div className="review-rating">
                <span className="stars">{renderStars(review.rating)}</span>
                <span className="rating-value" style={{ color: getRatingColor(review.rating) }}>
                  {review.rating}.0
                </span>
              </div>

              <div className="review-title">
                <h4>{review.title}</h4>
              </div>

              <div className="review-content">
                <p>{review.content}</p>
              </div>

              {review.images && review.images.length > 0 && (
                <div className="review-images">
                  {review.images.map((img, idx) => (
                    <div key={idx} className="review-image">
                      <img src={img} alt={`Review ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              )}

              <div className="review-footer">
                <div className="review-helpful">
                  <button
                    className="btn-helpful"
                    onClick={() => handleMarkHelpful(review.id)}
                    title={t('reviews', 'helpful') || 'Mark as helpful'}
                  >
                    👍 {review.helpful || 0} {t('reviews', 'helpful') || 'Helpful'}
                  </button>
                </div>
                <div className="review-actions">
                  {!review.verifiedPurchase && (
                    <button
                      className="action-btn verify-btn"
                      onClick={() => handleVerifyPurchase(review.id)}
                      title={t('reviews', 'verify') || 'Verify purchase'}
                    >
                      ✓ {t('reviews', 'verify') || 'Verify'}
                    </button>
                  )}
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteReview(review.id)}
                    title={t('reviews', 'delete') || 'Delete'}
                  >
                    ✕ {t('reviews', 'delete') || 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
