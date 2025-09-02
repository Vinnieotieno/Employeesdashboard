const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notifications');

// Socket authentication middleware
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }
    
    socket.userId = user._id.toString();
    socket.userInfo = user;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};

// Initialize socket handlers
const initializeSocketHandlers = (io) => {
  // Store connected users
  const connectedUsers = new Map();
  
  io.use(authenticateSocket);
  
  io.on('connection', (socket) => {
    console.log(`User ${socket.userInfo.name} connected (${socket.userId})`);
    
    // Store user connection
    connectedUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.userInfo,
      connectedAt: new Date()
    });
    
    // Join user to their personal room
    socket.join(`user_${socket.userId}`);
    
    // Join department room
    if (socket.userInfo.department) {
      socket.join(`department_${socket.userInfo.department}`);
    }
    
    // Handle joining operations room
    if (socket.userInfo.department === 'Operations') {
      socket.join('operations_team');
      console.log(`Operations user ${socket.userInfo.name} joined operations room`);
    }
    
    // Send user their unread notifications count
    socket.emit('notification_count', { count: 0 }); // This would be fetched from DB
    
    // Handle notification events
    socket.on('mark_notification_read', async (data) => {
      try {
        await Notification.findByIdAndUpdate(data.notificationId, { isRead: true });
        socket.emit('notification_marked_read', { notificationId: data.notificationId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to mark notification as read' });
      }
    });
    
    socket.on('delete_notification', async (data) => {
      try {
        await Notification.findByIdAndDelete(data.notificationId);
        socket.emit('notification_deleted', { notificationId: data.notificationId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to delete notification' });
      }
    });
    
    // Handle operations-specific events
    socket.on('eta_updated', (data) => {
      // Broadcast to all operations team members
      socket.to('operations_team').emit('eta_update_notification', {
        message: `ETA updated for shipment ${data.consignment}`,
        type: 'eta_change',
        priority: 'medium',
        serviceId: data.serviceId,
        updatedBy: socket.userInfo.name
      });
    });
    
    socket.on('progress_updated', (data) => {
      // Broadcast to all operations team members
      socket.to('operations_team').emit('progress_update_notification', {
        message: `Progress updated: ${data.consignment} moved to ${data.newProgress}`,
        type: 'progress_update',
        priority: 'medium',
        serviceId: data.serviceId,
        updatedBy: socket.userInfo.name
      });
    });
    
    socket.on('delay_alert', (data) => {
      // Broadcast urgent delay alerts to operations team
      socket.to('operations_team').emit('delay_alert_notification', {
        message: `DELAY ALERT: ${data.consignment} is ${data.delayHours} hours overdue`,
        type: 'delay_alert',
        priority: 'high',
        serviceId: data.serviceId,
        delayInfo: data
      });
    });
    
    socket.on('plan_updated', (data) => {
      // Broadcast plan updates to operations team
      socket.to('operations_team').emit('plan_update_notification', {
        message: `Operations plan updated: ${data.planTitle}`,
        type: 'plan_update',
        priority: 'medium',
        planId: data.planId,
        updatedBy: socket.userInfo.name
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.userInfo.name} disconnected`);
      connectedUsers.delete(socket.userId);
    });
    
    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
  
  // Utility functions for sending notifications
  const sendNotificationToUser = async (userId, notification) => {
    try {
      // Save to database
      const newNotification = new Notification({
        recipient: userId,
        ...notification
      });
      await newNotification.save();
      
      // Send real-time notification
      io.to(`user_${userId}`).emit('notification', {
        ...notification,
        _id: newNotification._id,
        createdAt: newNotification.createdAt
      });
      
      return newNotification;
    } catch (error) {
      console.error('Failed to send notification to user:', error);
    }
  };
  
  const sendNotificationToOperationsTeam = async (notification) => {
    try {
      // Get all operations team members
      const operationsUsers = await User.find({ department: 'Operations' });
      
      // Create notifications for each user
      const notifications = operationsUsers.map(user => ({
        recipient: user._id,
        ...notification
      }));
      
      const savedNotifications = await Notification.insertMany(notifications);
      
      // Send real-time notifications
      operationsUsers.forEach((user, index) => {
        io.to(`user_${user._id}`).emit('notification', {
          ...notification,
          _id: savedNotifications[index]._id,
          createdAt: savedNotifications[index].createdAt
        });
      });
      
      return savedNotifications;
    } catch (error) {
      console.error('Failed to send notification to operations team:', error);
    }
  };
  
  const sendNotificationToDepartment = async (department, notification) => {
    try {
      // Get all users in department
      const departmentUsers = await User.find({ department });
      
      // Create notifications for each user
      const notifications = departmentUsers.map(user => ({
        recipient: user._id,
        ...notification
      }));
      
      const savedNotifications = await Notification.insertMany(notifications);
      
      // Send real-time notifications
      departmentUsers.forEach((user, index) => {
        io.to(`user_${user._id}`).emit('notification', {
          ...notification,
          _id: savedNotifications[index]._id,
          createdAt: savedNotifications[index].createdAt
        });
      });
      
      return savedNotifications;
    } catch (error) {
      console.error('Failed to send notification to department:', error);
    }
  };
  
  const broadcastSystemAlert = (alert) => {
    // Broadcast to all connected users
    io.emit('system_alert', {
      ...alert,
      type: 'system_alert',
      priority: 'high',
      createdAt: new Date()
    });
  };
  
  const getConnectedUsers = () => {
    return Array.from(connectedUsers.values());
  };
  
  const getOperationsTeamOnline = () => {
    return Array.from(connectedUsers.values()).filter(
      user => user.user.department === 'Operations'
    );
  };
  
  // Attach utility functions to io for external use
  io.sendNotificationToUser = sendNotificationToUser;
  io.sendNotificationToOperationsTeam = sendNotificationToOperationsTeam;
  io.sendNotificationToDepartment = sendNotificationToDepartment;
  io.broadcastSystemAlert = broadcastSystemAlert;
  io.getConnectedUsers = getConnectedUsers;
  io.getOperationsTeamOnline = getOperationsTeamOnline;
  
  return io;
};

// Scheduled tasks for automatic notifications
const scheduleNotificationTasks = (io) => {
  // Check for overdue shipments every hour
  setInterval(async () => {
    try {
      const Service = require('../models/Service');
      
      // Find shipments that are overdue
      const overdueShipments = await Service.find({
        status: 'Approved',
        progress: { $nin: ['Delivered'] },
        'shipmentTracking.hasETA': true,
        'shipmentTracking.estimatedArrival': { $lt: new Date() },
        'shipmentTracking.isDelayed': { $ne: true }
      });
      
      for (const shipment of overdueShipments) {
        // Mark as delayed
        shipment.shipmentTracking.isDelayed = true;
        
        // Calculate delay duration
        const eta = new Date(shipment.shipmentTracking.estimatedArrival);
        const now = new Date();
        const delayHours = Math.floor((now - eta) / (1000 * 60 * 60));
        
        shipment.shipmentTracking.delayDuration = delayHours;
        
        // Add alert
        if (!shipment.alerts) shipment.alerts = [];
        shipment.alerts.push({
          type: 'delay',
          message: `Shipment ${shipment.consignment} is ${delayHours} hours overdue`,
          severity: 'high',
          createdAt: new Date()
        });
        
        await shipment.save();
        
        // Send notification to operations team
        await io.sendNotificationToOperationsTeam({
          message: `OVERDUE: Shipment ${shipment.consignment} is ${delayHours} hours past ETA`,
          type: 'delay_alert',
          priority: 'high',
          relatedId: shipment._id,
          relatedModel: 'Service'
        });
      }
      
      if (overdueShipments.length > 0) {
        console.log(`Processed ${overdueShipments.length} overdue shipments`);
      }
      
    } catch (error) {
      console.error('Error in overdue shipment check:', error);
    }
  }, 60 * 60 * 1000); // Every hour
  
  // Send daily operations summary at 9 AM
  const dailySummaryTime = new Date();
  dailySummaryTime.setHours(9, 0, 0, 0);
  
  const msUntilSummary = dailySummaryTime.getTime() - Date.now();
  const msInDay = 24 * 60 * 60 * 1000;
  
  setTimeout(() => {
    setInterval(async () => {
      try {
        const Service = require('../models/Service');
        
        // Get daily statistics
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const stats = await Service.aggregate([
          { $match: { status: 'Approved', createdAt: { $gte: today } } },
          {
            $group: {
              _id: '$progress',
              count: { $sum: 1 }
            }
          }
        ]);
        
        const summary = stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {});
        
        await io.sendNotificationToOperationsTeam({
          message: `Daily Operations Summary: ${summary.Delivered || 0} delivered, ${summary['On Transit'] || 0} in transit, ${summary.Initial || 0} new orders`,
          type: 'system_alert',
          priority: 'low'
        });
        
      } catch (error) {
        console.error('Error sending daily summary:', error);
      }
    }, msInDay);
  }, msUntilSummary > 0 ? msUntilSummary : msInDay + msUntilSummary);
};

module.exports = {
  initializeSocketHandlers,
  scheduleNotificationTasks
};
