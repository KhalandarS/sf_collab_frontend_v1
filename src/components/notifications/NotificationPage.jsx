/**
 * NotificationPage Component - Enhanced Version
 * Full-page view with category filtering support
 */

import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationItem from '../NotificationItem';
import {
  Filter,
  CheckCheck,
  Trash2,
  RefreshCw,
  Settings,
  TrendingUp,
  Bell,
  User,
  Users,
  Lightbulb,
  Briefcase,
  ListTodo,
  MessageSquare,
  Calendar,
  DollarSign,
  Award,
} from 'lucide-react';
import './NotificationPage.css';

const NotificationPage = () => {
  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    stats,
    markAllAsRead,
    deleteAllRead,
    loadMore,
    applyFilters,
    refresh,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showStats, setShowStats] = useState(false);

  // Type filter options
  const filterOptions = [
    { value: 'all', label: 'All', filter: {} },
    { value: 'unread', label: 'Unread', filter: { is_read: false } },
    { value: 'success', label: 'Success', filter: { type: 'success' } },
    { value: 'info', label: 'Info', filter: { type: 'info' } },
    { value: 'warning', label: 'Warnings', filter: { type: 'warning' } },
    { value: 'error', label: 'Errors', filter: { type: 'error' } },
  ];

  // Category filter options (from documentation 4.1-4.12)
  const categoryOptions = [
    { value: 'all', label: 'All Categories', icon: Bell },
    { value: 'account', label: 'Account', icon: User },
    { value: 'social', label: 'Social', icon: Users },
    { value: 'idea', label: 'Ideas', icon: Lightbulb },
    { value: 'startup', label: 'Startups', icon: Briefcase },
    { value: 'task', label: 'Tasks', icon: ListTodo },
    { value: 'message', label: 'Messages', icon: MessageSquare },
    { value: 'event', label: 'Events', icon: Calendar },
    { value: 'reward', label: 'Rewards', icon: Award },
    { value: 'funding', label: 'Funding', icon: DollarSign },
  ];

  const handleFilterChange = (filterValue) => {
    setActiveFilter(filterValue);
    const filter = filterOptions.find((f) => f.value === filterValue);
    const categoryFilter = activeCategory !== 'all' ? { category: activeCategory } : {};
    applyFilters({ ...filter?.filter, ...categoryFilter } || {});
  };

  const handleCategoryChange = (categoryValue) => {
    setActiveCategory(categoryValue);
    const typeFilter = filterOptions.find((f) => f.value === activeFilter);
    const categoryFilter = categoryValue !== 'all' ? { category: categoryValue } : {};
    applyFilters({ ...typeFilter?.filter, ...categoryFilter });
  };

  const handleMarkAllAsRead = async () => {
    if (window.confirm('Mark all notifications as read?')) {
      try {
        await markAllAsRead();
      } catch (error) {
        console.error('Failed to mark all as read:', error);
      }
    }
  };

  const handleDeleteAllRead = async () => {
    if (window.confirm('Delete all read notifications? This cannot be undone.')) {
      try {
        await deleteAllRead();
      } catch (error) {
        console.error('Failed to delete read notifications:', error);
      }
    }
  };

  return (
    <div className="notification-page">
      {/* Header */}
      <div className="notification-page-header">
        <div>
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <p className="unread-count-text">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="notification-page-actions">
          <button
            className="action-button"
            onClick={() => setShowStats(!showStats)}
          >
            <TrendingUp size={18} />
            <span>Stats</span>
          </button>

          <button className="action-button" onClick={refresh}>
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>

          {unreadCount > 0 && (
            <button className="action-button" onClick={handleMarkAllAsRead}>
              <CheckCheck size={18} />
              <span>Mark All Read</span>
            </button>
          )}

          <button className="action-button danger" onClick={handleDeleteAllRead}>
            <Trash2 size={18} />
            <span>Clear Read</span>
          </button>

          <a href="/settings/notifications" className="action-button">
            <Settings size={18} />
            <span>Settings</span>
          </a>
        </div>
      </div>

      {/* Stats Panel */}
      {showStats && stats && (
        <div className="notification-stats-panel">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value unread">{stats.unread}</div>
            <div className="stat-label">Unread</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.read}</div>
            <div className="stat-label">Read</div>
          </div>
          {/* Type breakdown */}
          {Object.entries(stats.typeBreakdown || {}).map(([type, count]) => (
            <div key={type} className="stat-card">
              <div className={`stat-value type-${type}`}>{count}</div>
              <div className="stat-label">{type}</div>
            </div>
          ))}
          {/* Category breakdown */}
          {Object.entries(stats.categoryBreakdown || {}).map(([category, count]) => (
            <div key={category} className="stat-card">
              <div className={`stat-value category-${category}`}>{count}</div>
              <div className="stat-label">{category}</div>
            </div>
          ))}
        </div>
      )}

      {/* Category Filters */}
      <div className="notification-category-filters">
        {categoryOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              className={`category-filter-button ${
                activeCategory === option.value ? 'active' : ''
              }`}
              onClick={() => handleCategoryChange(option.value)}
            >
              <Icon size={16} />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Type Filters */}
      <div className="notification-page-filters">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={`filter-tab ${
              activeFilter === option.value ? 'active' : ''
            }`}
            onClick={() => handleFilterChange(option.value)}
          >
            {option.label}
            {option.value === 'unread' && unreadCount > 0 && (
              <span className="filter-badge">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="notification-page-content">
        {loading && notifications.length === 0 ? (
          <div className="notification-page-loading">
            <div className="spinner-large" />
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-page-empty">
            <div className="empty-icon">
              <Filter size={48} />
            </div>
            <h3>No notifications found</h3>
            <p>
              {activeFilter === 'unread'
                ? "You're all caught up!"
                : activeCategory !== 'all'
                ? `No ${activeCategory} notifications`
                : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <>
            <div className="notification-page-list">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="load-more-container">
                <button
                  className="load-more-button-large"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner-small" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    'Load More Notifications'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;