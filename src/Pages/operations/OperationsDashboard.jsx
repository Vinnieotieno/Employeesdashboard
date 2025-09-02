import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Button, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Layout from '../../components/layout/Layout';
import ETAManagement from '../../components/operations/ETAManagement';
import ProgressionSystem from '../../components/operations/ProgressionSystem';
import OperationsReporting from '../../components/operations/OperationsReporting';
import NotificationSystem from '../../components/operations/NotificationSystem';
import OperationsDocumentation from '../../components/operations/OperationsDocumentation';
import { useGetOrdersQuery, useChangeProgressMutation, useUpdateShipmentTrackingMutation } from '../../state/servicesApiSlice';
import { toast } from 'react-toastify';
import './OperationsDashboard.scss';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const OperationsDashboard = () => {
  const { userInfo } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [changeProgress] = useChangeProgressMutation();
  const [updateShipmentTracking] = useUpdateShipmentTrackingMutation();
  
  // Fetch orders data
  const { data: orders, isLoading, refetch } = useGetOrdersQuery();

  // Filter approved orders for operations
  const operationsOrders = orders?.filter(order => order.status === 'Approved') || [];

  // Add sample data for demonstration if no orders exist
  const sampleOrders = [
    {
      _id: 'sample-1',
      companyName: 'ABC Trading Ltd',
      contactPerson: 'John Smith',
      consignment: 'CON-2024-001',
      origin: 'Shanghai, China',
      destination: 'Los Angeles, USA',
      transport: 'Sea Freight',
      progress: 'Collected',
      status: 'Approved',
      progressHistory: [
        {
          from: null,
          to: 'Collected',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          updatedBy: { name: 'Operations Team' },
          notes: 'Goods collected from supplier warehouse'
        }
      ],
      shipmentTracking: {
        hasETA: false,
        trackingNumber: 'TRK-001',
        carrier: 'Ocean Express'
      }
    },
    {
      _id: 'sample-2',
      companyName: 'XYZ Corporation',
      contactPerson: 'Sarah Johnson',
      consignment: 'CON-2024-002',
      origin: 'Hamburg, Germany',
      destination: 'New York, USA',
      transport: 'Air Freight',
      progress: 'On Transit',
      status: 'Approved',
      progressHistory: [
        {
          from: null,
          to: 'Collected',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          updatedBy: { name: 'Operations Team' },
          notes: 'Goods collected and processed'
        },
        {
          from: 'Collected',
          to: 'On Transit',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          updatedBy: { name: 'Operations Team' },
          notes: 'Shipment departed from Hamburg'
        }
      ],
      shipmentTracking: {
        hasETA: true,
        estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        trackingNumber: 'TRK-002',
        carrier: 'Air Cargo Express',
        currentLocation: 'In Transit - Atlantic Ocean'
      }
    },
    {
      _id: 'sample-3',
      companyName: 'Global Imports Inc',
      contactPerson: 'Mike Chen',
      consignment: 'CON-2024-003',
      origin: 'Tokyo, Japan',
      destination: 'Vancouver, Canada',
      transport: 'Sea Freight',
      progress: 'Arrived',
      status: 'Approved',
      progressHistory: [
        {
          from: null,
          to: 'Collected',
          timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          updatedBy: { name: 'Operations Team' },
          notes: 'Goods collected from Tokyo warehouse'
        },
        {
          from: 'Collected',
          to: 'On Transit',
          timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
          updatedBy: { name: 'Operations Team' },
          notes: 'Vessel departed from Tokyo Port'
        },
        {
          from: 'On Transit',
          to: 'Arrived',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          updatedBy: { name: 'Operations Team' },
          notes: 'Vessel arrived at Vancouver Port'
        }
      ],
      shipmentTracking: {
        hasETA: true,
        actualArrival: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        trackingNumber: 'TRK-003',
        carrier: 'Pacific Shipping',
        currentLocation: 'Vancouver Port - Berth 12'
      }
    },
    {
      _id: 'sample-4',
      companyName: 'Euro Logistics',
      contactPerson: 'Anna Mueller',
      consignment: 'CON-2024-004',
      origin: 'Rotterdam, Netherlands',
      destination: 'Miami, USA',
      transport: 'Sea Freight',
      progress: 'Clearance',
      status: 'Approved',
      progressHistory: [
        {
          from: null,
          to: 'Collected',
          timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          updatedBy: { name: 'Operations Team' },
          notes: 'Goods collected from Rotterdam facility'
        },
        {
          from: 'Collected',
          to: 'On Transit',
          timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
          updatedBy: { name: 'Operations Team' },
          notes: 'Vessel departed from Rotterdam'
        },
        {
          from: 'On Transit',
          to: 'Arrived',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedBy: { name: 'Operations Team' },
          notes: 'Arrived at Miami Port'
        },
        {
          from: 'Arrived',
          to: 'Clearance',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          updatedBy: { name: 'Operations Team' },
          notes: 'Customs clearance initiated'
        }
      ],
      shipmentTracking: {
        hasETA: true,
        actualArrival: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        trackingNumber: 'TRK-004',
        carrier: 'Atlantic Shipping',
        currentLocation: 'Miami Customs - Processing',
        customsClearanceStatus: 'in-progress'
      }
    },
    {
      _id: 'sample-5',
      companyName: 'Tech Solutions Ltd',
      contactPerson: 'David Park',
      consignment: 'CON-2024-005',
      origin: 'Seoul, South Korea',
      destination: 'Seattle, USA',
      transport: 'Air Freight',
      progress: 'Delivery',
      status: 'Approved',
      progressHistory: [
        {
          from: null,
          to: 'Collected',
          timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          updatedBy: { name: 'Operations Team' },
          notes: 'Electronics collected from Seoul facility'
        },
        {
          from: 'Collected',
          to: 'On Transit',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedBy: { name: 'Operations Team' },
          notes: 'Flight departed from Incheon Airport'
        },
        {
          from: 'On Transit',
          to: 'Arrived',
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          updatedBy: { name: 'Operations Team' },
          notes: 'Arrived at Seattle Airport'
        },
        {
          from: 'Arrived',
          to: 'Clearance',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          updatedBy: { name: 'Operations Team' },
          notes: 'Customs clearance completed'
        },
        {
          from: 'Clearance',
          to: 'Delivery',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          updatedBy: { name: 'Operations Team' },
          notes: 'Out for final delivery'
        }
      ],
      shipmentTracking: {
        hasETA: true,
        actualArrival: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        trackingNumber: 'TRK-005',
        carrier: 'Express Air Cargo',
        currentLocation: 'Seattle Distribution Center',
        customsClearanceStatus: 'cleared'
      }
    }
  ];

  // Use sample data if no real orders exist, otherwise use real orders
  // But mark sample orders so we don't try to update them via API
  const finalOperationsOrders = operationsOrders.length > 0 ? operationsOrders : sampleOrders.map(order => ({
    ...order,
    isSampleData: true
  }));

  // Calculate dashboard metrics
  const dashboardMetrics = {
    total: finalOperationsOrders.length,
    inProgress: finalOperationsOrders.filter(o => !['Delivered'].includes(o.progress)).length,
    delivered: finalOperationsOrders.filter(o => o.progress === 'Delivered').length,
    delayed: finalOperationsOrders.filter(o => o.shipmentTracking?.isDelayed).length,
    withoutETA: finalOperationsOrders.filter(o => !o.shipmentTracking?.hasETA && ['On Transit', 'Arrived', 'Clearance'].includes(o.progress)).length
  };

  // Handle ETA update
  const handleETAUpdate = async (updateData) => {
    try {
      // Check if this is sample data
      if (updateData.id && updateData.id.startsWith('sample-')) {
        toast.info('This is sample data - ETA update simulated');
        return;
      }

      await updateShipmentTracking(updateData).unwrap();
      toast.success('ETA updated successfully');
      await refetch();
    } catch (error) {
      toast.error('Failed to update ETA');
      throw error;
    }
  };

  // Handle progress update
  const handleProgressUpdate = async (updateData) => {
    try {
      // Check if this is sample data
      if (updateData.id && updateData.id.startsWith('sample-')) {
        toast.info('This is sample data - progress update simulated');
        return;
      }

      await changeProgress({
        id: updateData.id,
        Progress: updateData.progress,
        notes: updateData.notes,
        updatedBy: userInfo
      }).unwrap();

      toast.success('Progress updated successfully');
      await refetch();
    } catch (error) {
      toast.error('Failed to update progress');
      throw error;
    }
  };

  // Handle notification actions
  const handleMarkAsRead = async (notificationId) => {
    // Implementation for marking notification as read
    console.log('Marking notification as read:', notificationId);
    return Promise.resolve();
  };

  const handleDeleteNotification = async (notificationId) => {
    // Implementation for deleting notification
    console.log('Deleting notification:', notificationId);
    return Promise.resolve();
  };

  const handleUpdateNotificationSettings = async (settings) => {
    // Implementation for updating notification settings
    console.log('Updating notification settings:', settings);
    return Promise.resolve();
  };

  // Handle reporting actions
  const handleExportReport = async (reportData, format) => {
    // Implementation for exporting reports
    console.log('Exporting report:', format, reportData);
    return Promise.resolve();
  };

  const handleGenerateAnalytics = async (reportData) => {
    // Implementation for generating analytics
    console.log('Generating analytics:', reportData);
    return Promise.resolve();
  };

  // Handle documentation actions
  const handleCreateDocument = async (documentData) => {
    // Implementation for creating documents
    console.log('Creating document:', documentData);
    return Promise.resolve();
  };

  const handleUpdateDocument = async (documentData) => {
    // Implementation for updating documents
    console.log('Updating document:', documentData);
    return Promise.resolve();
  };

  const handleDeleteDocument = async (documentId) => {
    // Implementation for deleting documents
    console.log('Deleting document:', documentId);
    return Promise.resolve();
  };

  // Send notification function
  const handleSendNotification = async (notificationData) => {
    // Implementation for sending notifications
    console.log('Sending notification:', notificationData);
    return Promise.resolve();
  };

  // Tab configuration
  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      icon: <DashboardIcon />,
      badge: null
    },
    {
      key: 'progression',
      label: 'Progression',
      icon: <TimelineIcon />,
      badge: dashboardMetrics.inProgress
    },
    {
      key: 'eta',
      label: 'ETA Management',
      icon: <AccessTimeIcon />,
      badge: dashboardMetrics.withoutETA > 0 ? dashboardMetrics.withoutETA : null
    },
    {
      key: 'reports',
      label: 'Reports',
      icon: <AssessmentIcon />,
      badge: null
    },
    {
      key: 'documentation',
      label: 'Documentation',
      icon: <MenuBookIcon />,
      badge: null
    }
  ];

  if (isLoading) {
    return (
      <Layout className="operations-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading operations dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="operations-dashboard">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="dashboard-header">
              <div className="header-content">
                <h2 className="dashboard-title">
                  <DashboardIcon className="me-2" />
                  Operations Dashboard
                </h2>
                <p className="dashboard-subtitle">
                  Comprehensive operations management and tracking system
                </p>
              </div>
              <div className="header-actions">
                <NotificationSystem
                  userInfo={userInfo}
                  onMarkAsRead={handleMarkAsRead}
                  onDeleteNotification={handleDeleteNotification}
                  onUpdateSettings={handleUpdateNotificationSettings}
                />
              </div>
            </div>
          </Col>
        </Row>

        {/* Quick Metrics */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="metric-card total">
              <Card.Body className="text-center">
                <h3>{dashboardMetrics.total}</h3>
                <p className="mb-0">Total Orders</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="metric-card in-progress">
              <Card.Body className="text-center">
                <h3>{dashboardMetrics.inProgress}</h3>
                <p className="mb-0">In Progress</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="metric-card delivered">
              <Card.Body className="text-center">
                <h3>{dashboardMetrics.delivered}</h3>
                <p className="mb-0">Delivered</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="metric-card alerts">
              <Card.Body className="text-center">
                <h3>{dashboardMetrics.delayed + dashboardMetrics.withoutETA}</h3>
                <p className="mb-0">Needs Attention</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Row className="mb-4">
          <Col>
            <Card className="nav-card">
              <Card.Body>
                <Nav variant="pills" className="operations-nav">
                  {tabs.map(tab => (
                    <Nav.Item key={tab.key}>
                      <Nav.Link
                        active={activeTab === tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className="nav-link-custom"
                      >
                        <div className="nav-content">
                          {tab.icon}
                          <span>{tab.label}</span>
                          {tab.badge && (
                            <Badge bg="danger" className="nav-badge">
                              {tab.badge}
                            </Badge>
                          )}
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tab Content */}
        <Row>
          <Col>
            {activeTab === 'overview' && (
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Operations Overview</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h6>Quick Actions</h6>
                      <div className="quick-actions">
                        <Button 
                          variant="primary" 
                          className="me-2 mb-2"
                          onClick={() => setActiveTab('eta')}
                        >
                          Manage ETAs
                        </Button>
                        <Button 
                          variant="info" 
                          className="me-2 mb-2"
                          onClick={() => setActiveTab('progression')}
                        >
                          View Progress
                        </Button>
                        <Button 
                          variant="success" 
                          className="me-2 mb-2"
                          onClick={() => setActiveTab('reports')}
                        >
                          Generate Report
                        </Button>
                      </div>
                    </Col>
                    <Col md={6}>
                      <h6>System Status</h6>
                      <div className="system-status">
                        <div className="status-item">
                          <span className="status-label">Orders without ETA:</span>
                          <Badge bg={dashboardMetrics.withoutETA > 0 ? 'warning' : 'success'}>
                            {dashboardMetrics.withoutETA}
                          </Badge>
                        </div>
                        <div className="status-item">
                          <span className="status-label">Delayed shipments:</span>
                          <Badge bg={dashboardMetrics.delayed > 0 ? 'danger' : 'success'}>
                            {dashboardMetrics.delayed}
                          </Badge>
                        </div>
                        <div className="status-item">
                          <span className="status-label">Completion rate:</span>
                          <Badge bg="info">
                            {dashboardMetrics.total > 0 
                              ? Math.round((dashboardMetrics.delivered / dashboardMetrics.total) * 100)
                              : 0
                            }%
                          </Badge>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {activeTab === 'progression' && (
              <ProgressionSystem
                orders={finalOperationsOrders}
                onUpdateProgress={handleProgressUpdate}
                onSendNotification={handleSendNotification}
              />
            )}

            {activeTab === 'eta' && (
              <ETAManagement
                orders={finalOperationsOrders}
                onUpdateETA={handleETAUpdate}
                onUpdateTracking={handleETAUpdate}
              />
            )}

            {activeTab === 'reports' && (
              <OperationsReporting
                orders={finalOperationsOrders}
                onExportReport={handleExportReport}
                onGenerateAnalytics={handleGenerateAnalytics}
              />
            )}

            {activeTab === 'documentation' && (
              <OperationsDocumentation
                userInfo={userInfo}
                onCreateDocument={handleCreateDocument}
                onUpdateDocument={handleUpdateDocument}
                onDeleteDocument={handleDeleteDocument}
              />
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default OperationsDashboard;
