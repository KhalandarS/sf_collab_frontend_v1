import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import {
  CheckCircle,
  Info,
  AlertTriangle,
  AlertCircle,
  Circle,
  CheckCheck,
  Trash2,
  ExternalLink,
  User,
  Users,
  Lightbulb,
  Briefcase,
  ListTodo,
  MessageSquare,
  DollarSign,
  Calendar,
  Bell,
  Shield,
  Award,
  FileText,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import './notifications/NotificationItem.css';

const NotificationItem = ({ notification }) => {
  const navigate = useNavigate();
  const { markAsRead, markAsUnread, deleteNotification } = useNotifications();
  const [isDeleting, setIsDeleting] = useState(false);

  // Get category - check both top level and data
  const getCategory = () => {
    return notification.category || notification.data?.category || null;
  };

  // Get priority - check both top level and data
  const getPriority = () => {
    return notification.priority || notification.data?.priority || null;
  };

  // Get entity info for navigation
  const getEntityInfo = () => {
    return {
      type: notification.entity_type || notification.data?.entity_type,
      id: notification.entity_id || notification.data?.entity_id,
    };
  };

  // Get actor info (who triggered the notification)
  const getActorInfo = () => {
    return {
      id: notification.actor_id || notification.data?.actor_id,
      name: notification.data?.actor_name || null,
    };
  };

  // Get icon based on category (enhanced) or type (legacy)
  const getIcon = () => {
    const category = getCategory();

    // Category-based icons (new system)
    if (category) {
      const categoryIcons = {
        account: <User className="notification-icon account" size={20} />,
        social: <Users className="notification-icon social" size={20} />,
        idea: <Lightbulb className="notification-icon idea" size={20} />,
        startup: <Briefcase className="notification-icon startup" size={20} />,
        task: <ListTodo className="notification-icon task" size={20} />,
        message: <MessageSquare className="notification-icon message" size={20} />,
        file: <FileText className="notification-icon file" size={20} />,
        reward: <Award className="notification-icon reward" size={20} />,
        governance: <Shield className="notification-icon governance" size={20} />,
        funding: <DollarSign className="notification-icon funding" size={20} />,
        ai: <Bell className="notification-icon ai" size={20} />,
        event: <Calendar className="notification-icon event" size={20} />,
        friend: <Users className="notification-icon friend" size={20} />,
        application: <FileText className="notification-icon application" size={20} />,
      };
      return categoryIcons[category] || <Bell className="notification-icon" size={20} />;
    }

    // Type-based icons (legacy system)
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="notification-icon success" size={20} />;
      case 'info':
        return <Info className="notification-icon info" size={20} />;
      case 'warning':
        return <AlertTriangle className="notification-icon warning" size={20} />;
      case 'error':
        return <AlertCircle className="notification-icon error" size={20} />;
      default:
        return <Circle className="notification-icon" size={20} />;
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return timestamp;
    }
  };

  // Navigate to entity
  const handleNavigate = () => {
    const { type, id } = getEntityInfo();
    if (!type || !id) return;

    const routes = {
      task: `/tasks/${id}`,
      idea: `/ideas/${id}`,
      startup: `/startups/${id}`,
      post: `/posts/${id}`,
      message: `/chat`, // Or specific conversation
      conversation: `/chat/${id}`,
      comment: `/comments/${id}`,
      event: `/calendar?event=${id}`,
      calendar_event: `/calendar?event=${id}`,
      project: `/projects/${id}`,
      friend_request: `/connections`,
      application: `/applications/${id}`,
      payment: `/payments/${id}`,
      user: `/profile/${id}`,
      achievement: `/achievements`,
      notification: `/notifications`,
    };

    const route = routes[type];
    if (route) {
      navigate(route);
    }
  };

  // Handle click - mark as read and navigate if entity exists
  const handleClick = async () => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    const { type, id } = getEntityInfo();
    if (type && id) {
      handleNavigate();
    }
  };

  // Toggle read status
  const handleToggleRead = async (e) => {
    e.stopPropagation();
    try {
      if (notification.isRead) {
        await markAsUnread(notification.id);
      } else {
        await markAsRead(notification.id);
      }
    } catch (error) {
      console.error('Failed to toggle read status:', error);
    }
  };

  // Delete notification
  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await deleteNotification(notification.id);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      setIsDeleting(false);
    }
  };

  const category = getCategory();
  const priority = getPriority();
  const { type: entityType, id: entityId } = getEntityInfo();
  const actor = getActorInfo();

  return (
    <div
      className={`notification-item ${notification.isRead ? 'read' : 'unread'} ${
        isDeleting ? 'deleting' : ''
      } ${priority === 'critical' ? 'priority-critical' : ''}`}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className="notification-item-icon">{getIcon()}</div>

      {/* Content */}
      <div className="notification-item-content">
        <div className="notification-item-header">
          <h4 className="notification-item-title">{notification.title}</h4>
          <span className="notification-item-time">
            {formatTime(notification.createdAt || notification.created_at)}
          </span>
        </div>

        <p className="notification-item-message">{notification.message}</p>

        {/* Badges row */}
        <div className="notification-badges">
          {/* Category Badge */}
          {category && (
            <span className={`notification-category ${category}`}>
              {category.replace('_', ' ')}
            </span>
          )}

          {/* Priority Badge - only show for high/critical */}
          {priority && (priority === 'high' || priority === 'critical') && (
            <span className={`notification-priority ${priority}`}>
              {priority}
            </span>
          )}

          {/* Actor info */}
          {actor.name && (
            <span className="notification-actor">
              by {actor.name}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="notification-item-actions">
        {entityType && entityId && (
          <button
            className="notification-action-button"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            title="View details"
          >
            <ExternalLink size={16} />
          </button>
        )}

        <button
          className="notification-action-button"
          onClick={handleToggleRead}
          title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
        >
          {notification.isRead ? <Circle size={16} /> : <CheckCheck size={16} />}
        </button>

        <button
          className="notification-action-button delete"
          onClick={handleDelete}
          title="Delete"
          disabled={isDeleting}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Unread indicator */}
      {!notification.isRead && <div className="unread-indicator" />}
    </div>
  );
};

export default NotificationItem;