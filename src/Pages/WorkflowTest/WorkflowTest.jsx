import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import Sidebar from '../../components/sidebar/Sidebar';
import Navigation from '../../components/navbar/Navigation';
import ProgressTimeline from '../../components/timeline/ProgressTimeline';
import ProgressManagementModal from '../../components/modals/ProgressManagementModal';
import WorkflowSummary from '../../components/workflow/WorkflowSummary';
import { useGetOrdersQuery } from '../../state/servicesApiSlice';
import Loader from '../../components/Loader';

const WorkflowTest = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data: orders, isLoading } = useGetOrdersQuery();

  // Sample order data for testing
  const sampleOrder = {
    _id: 'test-order-123',
    companyName: 'Test Company',
    contactPerson: 'John Doe',
    email: 'john@testcompany.com',
    progress: 'On Transit',
    status: 'Approved',
    transport: 'Air Freight',
    origin: 'Nairobi',
    destination: 'Dubai',
    order: ['Air Freight'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const handleTestModal = () => {
    setSelectedOrder(sampleOrder);
    setShowModal(true);
  };

  const handleProgressUpdate = () => {
    setShowModal(false);
    setSelectedOrder(null);
    // In real implementation, this would refetch data
  };

  // Calculate order statistics
  const getOrderStats = () => {
    if (!orders) return null;
    
    const stats = {
      initial: orders.filter(o => o.progress === 'Initial').length,
      onTransit: orders.filter(o => o.progress === 'On Transit').length,
      arrived: orders.filter(o => o.progress === 'Arrived').length,
      clearance: orders.filter(o => o.progress === 'Clearance').length,
      delivery: orders.filter(o => o.progress === 'Delivery').length,
      total: orders.length
    };
    
    return stats;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="workflow-test">
      <Sidebar />
      <div className="workflow-test-container" style={{ marginLeft: '250px' }}>
        <Navigation />
        
        <Container fluid className="p-4">
          <div className="page-header mb-4">
            <h2>Workflow System Test Page</h2>
            <p className="text-muted">
              Test and demonstrate the new order workflow management system
            </p>
          </div>

          {/* System Overview */}
          <WorkflowSummary orderStats={getOrderStats()} />

          <Row className="mt-5">
            {/* Progress Timeline Demo */}
            <Col md={8}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Progress Timeline Demo</h5>
                </Card.Header>
                <Card.Body>
                  <Alert variant="info" className="mb-3">
                    <strong>Demo:</strong> This shows how the progress timeline looks for different order states.
                  </Alert>
                  
                  <div className="timeline-demos">
                    <h6>Compact Timeline View:</h6>
                    <ProgressTimeline 
                      currentProgress="On Transit" 
                      orderData={sampleOrder}
                      compact={true}
                    />
                    
                    <hr className="my-4" />
                    
                    <h6>Full Timeline View:</h6>
                    <ProgressTimeline 
                      currentProgress="On Transit" 
                      orderData={sampleOrder}
                      compact={false}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Progress Management Demo */}
            <Col md={4}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Progress Management</h5>
                </Card.Header>
                <Card.Body>
                  <Alert variant="success" className="mb-3">
                    <strong>New Feature:</strong> Centralized progress management with validation and document upload.
                  </Alert>
                  
                  <Button 
                    variant="primary" 
                    onClick={handleTestModal}
                    className="w-100 mb-3"
                  >
                    Test Progress Management Modal
                  </Button>
                  
                  <div className="feature-list">
                    <h6>Features:</h6>
                    <ul className="list-unstyled">
                      <li>✅ Progress validation</li>
                      <li>✅ Document upload</li>
                      <li>✅ Notes and comments</li>
                      <li>✅ Business rule enforcement</li>
                      <li>✅ Email notifications</li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>

              <Card className="mt-3">
                <Card.Header>
                  <h5 className="mb-0">System Status</h5>
                </Card.Header>
                <Card.Body>
                  <div className="status-indicators">
                    <div className="status-item mb-2">
                      <span className="badge bg-success me-2">✓</span>
                      Backend API Enhanced
                    </div>
                    <div className="status-item mb-2">
                      <span className="badge bg-success me-2">✓</span>
                      Progress Validation Added
                    </div>
                    <div className="status-item mb-2">
                      <span className="badge bg-success me-2">✓</span>
                      Timeline Components Ready
                    </div>
                    <div className="status-item mb-2">
                      <span className="badge bg-success me-2">✓</span>
                      Modal Management System
                    </div>
                    <div className="status-item mb-2">
                      <span className="badge bg-success me-2">✓</span>
                      Email Notifications
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Implementation Notes */}
          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Implementation Notes</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h6>What's New:</h6>
                      <ul>
                        <li>Complete workflow coverage (Initial → On Transit → Arrived → Clearance → Delivery)</li>
                        <li>Progress Management Modal with validation</li>
                        <li>Visual Progress Timeline components</li>
                        <li>Backend validation and business rules</li>
                        <li>Progress history tracking</li>
                        <li>Automated email notifications</li>
                      </ul>
                    </Col>
                    <Col md={6}>
                      <h6>Key Improvements:</h6>
                      <ul>
                        <li>No more missing workflow transitions</li>
                        <li>Centralized progress management</li>
                        <li>Better user experience with visual feedback</li>
                        <li>Robust validation prevents invalid state changes</li>
                        <li>Complete audit trail for all progress changes</li>
                        <li>Professional customer communication</li>
                      </ul>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Progress Management Modal */}
        <ProgressManagementModal
          show={showModal}
          onHide={() => setShowModal(false)}
          orderData={selectedOrder}
          onProgressUpdate={handleProgressUpdate}
        />
      </div>
    </div>
  );
};

export default WorkflowTest;
