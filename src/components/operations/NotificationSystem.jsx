import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Form, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import './NotificationSystem.scss';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

const NotificationSystem = ({ userInfo, onMarkAsRead, onDeleteNotification, onUpdateSettings }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [socket, setSocket] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    progressUpdates: true,
    delayAlerts: true,
    etaChanges: true,
    planUpdates: true,
    systemAlerts: true,
    soundEnabled: true,
    autoMarkRead: false
  });

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token'),
        userId: userInfo?._id,
        department: userInfo?.department
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to notification server');
    });

    newSocket.on('notification', (notification) => {
      handleNewNotification(notification);
    });

    newSocket.on('bulk_notification', (notifications) => {
      handleBulkNotifications(notifications);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userInfo]);

  // Load existing notifications
  useEffect(() => {
    loadNotifications();
  }, []);

  // Handle new notification
  const handleNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show toast notification
    const toastOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (notification.priority) {
      case 'critical':
        toast.error(notification.message, toastOptions);
        break;
      case 'high':
        toast.warning(notification.message, toastOptions);
        break;
      case 'medium':
        toast.info(notification.message, toastOptions);
        break;
      default:
        toast.success(notification.message, toastOptions);
    }

    // Play sound if enabled
    if (notificationSettings.soundEnabled) {
      playNotificationSound(notification.priority);
    }
  };

  // Handle bulk notifications
  const handleBulkNotifications = (newNotifications) => {
    setNotifications(prev => [...newNotifications, ...prev]);
    setUnreadCount(prev => prev + newNotifications.filter(n => !n.isRead).length);
  };

  // Load notifications from server
  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  // Play notification sound
  const playNotificationSound = (priority) => {
    const audio = new Audio();
    switch (priority) {
      case 'critical':
        audio.src = '/sounds/critical.mp3';
        break;
      case 'high':
        audio.src = '/sounds/warning.mp3';
        break;
      default:
        audio.src = '/sounds/notification.mp3';
    }
    audio.play().catch(e => console.log('Could not play sound:', e));
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await onMarkAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
      await Promise.all(unreadIds.map(id => onMarkAsRead(id)));
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await onDeleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      const notification = notifications.find(n => n._id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  // Get notification icon
  const getNotificationIcon = (type, priority) => {
    if (priority === 'critical') return <ErrorIcon className="text-danger" />;
    if (priority === 'high') return <WarningIcon className="text-warning" />;
    
    switch (type) {
      case 'progress_update':
        return <CheckCircleIcon className="text-success" />;
      case 'delay_alert':
        return <WarningIcon className="text-warning" />;
      case 'eta_change':
        return <InfoIcon className="text-info" />;
      case 'plan_update':
        return <NotificationsIcon className="text-primary" />;
      default:
        return <InfoIcon className="text-info" />;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const colors = {
      critical: 'danger',
      high: 'warning',
      medium: 'info',
      low: 'secondary'
    };
    return <Badge bg={colors[priority] || 'secondary'}>{priority}</Badge>;
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now - notificationDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Update notification settings
  const updateSettings = async () => {
    try {
      await onUpdateSettings(notificationSettings);
      toast.success('Notification settings updated');
      setShowSettings(false);
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="notification-system">
      {/* Notification Bell */}
      <div className="notification-bell">
        <Button
          variant="link"
          className="notification-trigger"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          {unreadCount > 0 ? (
            <NotificationsActiveIcon className="notification-icon active" />
          ) : (
            <NotificationsIcon className="notification-icon" />
          )}
          {unreadCount > 0 && (
            <Badge bg="danger" className="notification-count">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <Card className="notifications-dropdown">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Notifications</h6>
              <div className="header-actions">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="me-2"
                >
                  <SettingsIcon />
                </Button>
                {unreadCount > 0 && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={markAllAsRead}
                  >
                    <MarkEmailReadIcon />
                  </Button>
                )}
              </div>
            </Card.Header>
            <Card.Body className="notifications-body">
              {notifications.length === 0 ? (
                <div className="no-notifications">
                  <NotificationsIcon className="empty-icon" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {notifications.slice(0, 10).map(notification => (
                    <ListGroup.Item
                      key={notification._id}
                      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                    >
                      <div className="notification-content">
                        <div className="notification-header">
                          <div className="notification-icon">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>
                          <div className="notification-meta">
                            {getPriorityBadge(notification.priority)}
                            <small className="time-ago">{formatTimeAgo(notification.createdAt)}</small>
                          </div>
                        </div>
                        <div className="notification-body">
                          <p className="notification-message">{notification.message}</p>
                          {notification.details && (
                            <small className="notification-details">{notification.details}</small>
                          )}
                        </div>
                        <div className="notification-actions">
                          {!notification.isRead && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => markAsRead(notification._id)}
                            >
                              Mark as read
                            </Button>
                          )}
                          <Button
                            variant="link"
                            size="sm"
                            className="text-danger"
                            onClick={() => deleteNotification(notification._id)}
                          >
                            <DeleteIcon />
                          </Button>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
              
              {notifications.length > 10 && (
                <div className="view-all">
                  <Button variant="link" size="sm">
                    View all notifications
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Settings Modal */}
      <Modal show={showSettings} onHide={() => setShowSettings(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notification Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <h6>Delivery Methods</h6>
            <Form.Check
              type="checkbox"
              label="Email Notifications"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ 
                ...prev, 
                emailNotifications: e.target.checked 
              }))}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              label="Push Notifications"
              checked={notificationSettings.pushNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ 
                ...prev, 
                pushNotifications: e.target.checked 
              }))}
              className="mb-3"
            />

            <h6>Notification Types</h6>
            <Form.Check
              type="checkbox"
              label="Progress Updates"
              checked={notificationSettings.progressUpdates}
              onChange={(e) => setNotificationSettings(prev => ({ 
                ...prev, 
                progressUpdates: e.target.checked 
              }))}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              label="Delay Alerts"
              checked={notificationSettings.delayAlerts}
              onChange={(e) => setNotificationSettings(prev => ({ 
                ...prev, 
                delayAlerts: e.target.checked 
              }))}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              label="ETA Changes"
              checked={notificationSettings.etaChanges}
              onChange={(e) => setNotificationSettings(prev => ({ 
                ...prev, 
                etaChanges: e.target.checked 
              }))}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              label="Plan Updates"
              checked={notificationSettings.planUpdates}
              onChange={(e) => setNotificationSettings(prev => ({ 
                ...prev, 
                planUpdates: e.target.checked 
              }))}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              label="System Alerts"
              checked={notificationSettings.systemAlerts}
              onChange={(e) => setNotificationSettings(prev => ({ 
                ...prev, 
                systemAlerts: e.target.checked 
              }))}
              className="mb-3"
            />

            <h6>Preferences</h6>
            <Form.Check
              type="checkbox"
              label="Sound Notifications"
              checked={notificationSettings.soundEnabled}
              onChange={(e) => setNotificationSettings(prev => ({ 
                ...prev, 
                soundEnabled: e.target.checked 
              }))}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              label="Auto-mark as read after viewing"
              checked={notificationSettings.autoMarkRead}
              onChange={(e) => setNotificationSettings(prev => ({ 
                ...prev, 
                autoMarkRead: e.target.checked 
              }))}
              className="mb-2"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettings(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={updateSettings}>
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotificationSystem;
