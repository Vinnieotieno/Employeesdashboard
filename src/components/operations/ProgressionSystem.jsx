import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Form, Alert, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ProgressionGuide from './ProgressionGuide';
import './ProgressionSystem.scss';
import TimelineIcon from '@mui/icons-material/Timeline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import HistoryIcon from '@mui/icons-material/History';

const ProgressionSystem = ({ orders, onUpdateProgress, onSendNotification }) => {
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [progressForm, setProgressForm] = useState({
    newProgress: '',
    notes: '',
    estimatedCompletion: '',
    notifyTeam: true,
    notifyCustomer: false,
    priority: 'normal'
  });

  // Progress stages with detailed information
  const progressStages = [
    {
      key: 'Collected',
      label: 'Collected',
      color: 'secondary',
      description: 'Order collected and being processed',
      estimatedDuration: 1, // days
      requiredActions: ['Verify order details', 'Assign team', 'Create documentation']
    },
    { 
      key: 'On Transit', 
      label: 'On Transit', 
      color: 'info', 
      description: 'Shipment is in transit',
      estimatedDuration: 7,
      requiredActions: ['Track shipment', 'Monitor ETA', 'Update customer']
    },
    { 
      key: 'Arrived', 
      label: 'Arrived', 
      color: 'warning', 
      description: 'Shipment has arrived at destination',
      estimatedDuration: 1,
      requiredActions: ['Confirm arrival', 'Inspect goods', 'Prepare for clearance']
    },
    { 
      key: 'Clearance', 
      label: 'Clearance', 
      color: 'primary', 
      description: 'Customs clearance in progress',
      estimatedDuration: 3,
      requiredActions: ['Submit documents', 'Pay duties', 'Await clearance']
    },
    { 
      key: 'Delivery', 
      label: 'Delivery', 
      color: 'warning', 
      description: 'Out for delivery',
      estimatedDuration: 1,
      requiredActions: ['Schedule delivery', 'Coordinate with customer', 'Dispatch']
    },
    { 
      key: 'Delivered', 
      label: 'Delivered', 
      color: 'success', 
      description: 'Successfully delivered to customer',
      estimatedDuration: 0,
      requiredActions: ['Confirm delivery', 'Get signature', 'Close order']
    }
  ];

  // Get current stage index
  const getCurrentStageIndex = (progress) => {
    return progressStages.findIndex(stage => stage.key === progress);
  };

  // Calculate progress percentage
  const getProgressPercentage = (progress) => {
    const currentIndex = getCurrentStageIndex(progress);
    return currentIndex >= 0 ? ((currentIndex + 1) / progressStages.length) * 100 : 0;
  };

  // Get next possible stages
  const getNextStages = (currentProgress) => {
    const currentIndex = getCurrentStageIndex(currentProgress);
    return progressStages.slice(currentIndex + 1);
  };

  // Calculate time in current stage
  const getTimeInStage = (order) => {
    const history = order.progressHistory || [];
    const currentStageEntry = history.find(entry => entry.to === order.progress);
    
    if (!currentStageEntry) return 'Unknown';
    
    const stageStart = new Date(currentStageEntry.timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - stageStart) / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}, ${diffHours % 24} hour${diffHours % 24 !== 1 ? 's' : ''}`;
    }
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  };

  // Check if stage is overdue
  const isStageOverdue = (order) => {
    const currentStage = progressStages.find(stage => stage.key === order.progress);
    if (!currentStage) return false;
    
    const history = order.progressHistory || [];
    const currentStageEntry = history.find(entry => entry.to === order.progress);
    
    if (!currentStageEntry) return false;
    
    const stageStart = new Date(currentStageEntry.timestamp);
    const now = new Date();
    const diffDays = (now - stageStart) / (1000 * 60 * 60 * 24);
    
    return diffDays > currentStage.estimatedDuration;
  };

  // Open progress modal
  const openProgressModal = (order) => {
    setSelectedOrder(order);
    setProgressForm({
      newProgress: '',
      notes: '',
      estimatedCompletion: '',
      notifyTeam: true,
      notifyCustomer: false,
      priority: 'normal'
    });
    setShowProgressModal(true);
  };

  // Handle progress update
  const handleProgressUpdate = async () => {
    if (!progressForm.newProgress) {
      toast.error('Please select a progress stage');
      return;
    }

    try {
      const updateData = {
        id: selectedOrder._id,
        progress: progressForm.newProgress,
        notes: progressForm.notes,
        estimatedCompletion: progressForm.estimatedCompletion,
        notifyTeam: progressForm.notifyTeam,
        notifyCustomer: progressForm.notifyCustomer,
        priority: progressForm.priority
      };

      await onUpdateProgress(updateData);
      
      // Send notifications if requested
      if (progressForm.notifyTeam || progressForm.notifyCustomer) {
        const notificationData = {
          orderId: selectedOrder._id,
          type: 'progress_update',
          message: `Order ${selectedOrder.consignment} has been updated to ${progressForm.newProgress}`,
          recipients: {
            team: progressForm.notifyTeam,
            customer: progressForm.notifyCustomer
          },
          priority: progressForm.priority
        };
        
        await onSendNotification(notificationData);
      }

      toast.success('Progress updated successfully');
      setShowProgressModal(false);
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  // Get orders by stage
  const getOrdersByStage = (stage) => {
    return orders?.filter(order => order.progress === stage) || [];
  };

  // Get overdue orders
  const getOverdueOrders = () => {
    return orders?.filter(order => isStageOverdue(order)) || [];
  };

  return (
    <div className="progression-system">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="section-title">
              <TimelineIcon className="me-2" />
              Operations Progression Dashboard
            </h4>
            <ProgressionGuide />
          </div>
        </Col>
      </Row>

      {/* Overdue Orders Alert */}
      {getOverdueOrders().length > 0 && (
        <Alert variant="warning" className="mb-4">
          <WarningIcon className="me-2" />
          <strong>{getOverdueOrders().length} order{getOverdueOrders().length > 1 ? 's' : ''} overdue!</strong>
          {' '}These orders have exceeded their expected stage duration and need attention.
        </Alert>
      )}

      {/* Progress Pipeline */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <TimelineIcon className="me-2" />
            Operations Pipeline
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            {progressStages.map((stage, index) => {
              const stageOrders = getOrdersByStage(stage.key);
              const overdueCount = stageOrders.filter(order => isStageOverdue(order)).length;
              
              return (
                <Col md={2} key={stage.key} className="text-center mb-3">
                  <div className={`stage-column ${stage.key.toLowerCase()}`}>
                    <div className="stage-header">
                      <h6 className="stage-title">{stage.label}</h6>
                      <Badge bg={stage.color} className="stage-count">
                        {stageOrders.length}
                      </Badge>
                      {overdueCount > 0 && (
                        <Badge bg="danger" className="overdue-count">
                          {overdueCount} overdue
                        </Badge>
                      )}
                    </div>
                    
                    <div className="stage-orders">
                      {stageOrders.slice(0, 3).map(order => (
                        <div 
                          key={order._id} 
                          className={`order-item ${isStageOverdue(order) ? 'overdue' : ''}`}
                          onClick={() => openProgressModal(order)}
                        >
                          <div className="order-company">{order.companyName}</div>
                          <div className="order-consignment">{order.consignment}</div>
                          <div className="order-time">{getTimeInStage(order)}</div>
                        </div>
                      ))}
                      
                      {stageOrders.length > 3 && (
                        <div className="more-orders">
                          +{stageOrders.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card.Body>
      </Card>

      {/* Detailed Order List */}
      <Card>
        <Card.Header className="bg-info text-white">
          <h5 className="mb-0">
            <HistoryIcon className="me-2" />
            Detailed Progress Tracking
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            {orders?.map(order => {
              const currentStage = progressStages.find(stage => stage.key === order.progress);
              const progressPercentage = getProgressPercentage(order.progress);
              const isOverdue = isStageOverdue(order);
              
              return (
                <Col md={6} lg={4} key={order._id} className="mb-3">
                  <Card className={`order-progress-card ${isOverdue ? 'overdue' : ''}`}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">{order.companyName}</h6>
                        {isOverdue && <WarningIcon className="text-danger" />}
                      </div>
                      
                      <p className="text-muted small mb-2">{order.consignment}</p>
                      
                      <div className="progress-info mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <Badge bg={currentStage?.color || 'secondary'}>
                            {order.progress}
                          </Badge>
                          <small className="text-muted">{Math.round(progressPercentage)}%</small>
                        </div>
                        
                        <ProgressBar 
                          now={progressPercentage} 
                          variant={isOverdue ? 'danger' : currentStage?.color || 'primary'}
                          className="mb-2"
                        />
                        
                        <small className="text-muted">
                          Time in stage: {getTimeInStage(order)}
                        </small>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {order.origin} → {order.destination}
                        </small>
                        <Button 
                          size="sm" 
                          variant={isOverdue ? 'danger' : 'primary'}
                          onClick={() => openProgressModal(order)}
                        >
                          <PlayArrowIcon style={{fontSize: '16px'}} className="me-1" />
                          Update
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card.Body>
      </Card>

      {/* Progress Update Modal */}
      <Modal show={showProgressModal} onHide={() => setShowProgressModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Update Progress - {selectedOrder?.companyName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <div className="current-progress mb-4">
                <h6>Current Progress</h6>
                <div className="d-flex align-items-center">
                  <Badge bg={progressStages.find(s => s.key === selectedOrder.progress)?.color || 'secondary'} className="me-2">
                    {selectedOrder.progress}
                  </Badge>
                  <span className="text-muted">
                    Time in stage: {getTimeInStage(selectedOrder)}
                  </span>
                </div>
              </div>

              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>New Progress Stage</Form.Label>
                      <Form.Select
                        value={progressForm.newProgress}
                        onChange={(e) => setProgressForm(prev => ({ ...prev, newProgress: e.target.value }))}
                      >
                        <option value="">Select next stage...</option>
                        {getNextStages(selectedOrder.progress).map(stage => (
                          <option key={stage.key} value={stage.key}>
                            {stage.label} - {stage.description}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        value={progressForm.priority}
                        onChange={(e) => setProgressForm(prev => ({ ...prev, priority: e.target.value }))}
                      >
                        <option value="low">Low Priority</option>
                        <option value="normal">Normal Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Estimated Completion</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={progressForm.estimatedCompletion}
                    onChange={(e) => setProgressForm(prev => ({ ...prev, estimatedCompletion: e.target.value }))}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Progress Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={progressForm.notes}
                    onChange={(e) => setProgressForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add notes about this progress update..."
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Check
                      type="checkbox"
                      label="Notify Operations Team"
                      checked={progressForm.notifyTeam}
                      onChange={(e) => setProgressForm(prev => ({ ...prev, notifyTeam: e.target.checked }))}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="checkbox"
                      label="Notify Customer"
                      checked={progressForm.notifyCustomer}
                      onChange={(e) => setProgressForm(prev => ({ ...prev, notifyCustomer: e.target.checked }))}
                    />
                  </Col>
                </Row>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProgressModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleProgressUpdate}>
            <CheckCircleIcon className="me-1" style={{fontSize: '16px'}} />
            Update Progress
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProgressionSystem;
