import React from 'react';
import { Card, Row, Col, Badge, Alert } from 'react-bootstrap';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import './WorkflowSummary.scss';

const WorkflowSummary = ({ orderStats }) => {
  const improvements = [
    {
      title: 'Complete Workflow Coverage',
      description: 'All progress states now have clear transitions and actions',
      icon: <CheckCircleIcon />,
      color: 'success',
      features: [
        'Initial → On Transit transition added',
        'All intermediate states covered',
        'Clear action buttons for each stage',
        'No more workflow gaps'
      ]
    },
    {
      title: 'Enhanced Progress Management',
      description: 'Centralized modal for managing order progress with validation',
      icon: <TrendingUpIcon />,
      color: 'primary',
      features: [
        'Progress Management Modal',
        'Document upload integration',
        'Notes and comments system',
        'Business rule validation'
      ]
    },
    {
      title: 'Visual Progress Tracking',
      description: 'Timeline components showing detailed progress information',
      icon: <SpeedIcon />,
      color: 'info',
      features: [
        'Interactive progress timeline',
        'Compact and detailed views',
        'Progress percentage tracking',
        'Estimated time displays'
      ]
    },
    {
      title: 'Backend Validation & Security',
      description: 'Robust validation rules and progress history tracking',
      icon: <SecurityIcon />,
      color: 'warning',
      features: [
        'Progress transition validation',
        'Business rule enforcement',
        'Progress history logging',
        'Email notifications'
      ]
    }
  ];

  const workflowStages = [
    { stage: 'Initial', description: 'Order approved and ready to start', color: 'danger' },
    { stage: 'On Transit', description: 'Shipment in transit to destination', color: 'warning' },
    { stage: 'Arrived', description: 'Shipment arrived at destination', color: 'info' },
    { stage: 'Clearance', description: 'Customs clearance in progress', color: 'primary' },
    { stage: 'Delivery', description: 'Ready for final delivery', color: 'success' }
  ];

  return (
    <div className="workflow-summary">
      <div className="summary-header mb-4">
        <h3>Order Workflow System - Implementation Summary</h3>
        <p className="text-muted">
          Complete workflow management system with enhanced progress tracking and validation
        </p>
      </div>

      {/* Workflow Stages Overview */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Complete Workflow Stages</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            {workflowStages.map((stage, index) => (
              <Col md={2} key={stage.stage} className="text-center mb-3">
                <div className="workflow-stage">
                  <Badge bg={stage.color} className="stage-badge">
                    {stage.stage}
                  </Badge>
                  <p className="stage-description">{stage.description}</p>
                  {index < workflowStages.length - 1 && (
                    <div className="stage-arrow">→</div>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Implementation Features */}
      <Row>
        {improvements.map((improvement, index) => (
          <Col md={6} key={index} className="mb-4">
            <Card className="improvement-card h-100">
              <Card.Header className={`bg-${improvement.color} text-white`}>
                <div className="d-flex align-items-center">
                  <span className="improvement-icon me-2">
                    {improvement.icon}
                  </span>
                  <h6 className="mb-0">{improvement.title}</h6>
                </div>
              </Card.Header>
              <Card.Body>
                <p className="improvement-description">{improvement.description}</p>
                <ul className="feature-list">
                  {improvement.features.map((feature, idx) => (
                    <li key={idx} className="feature-item">
                      <CheckCircleIcon className="feature-check" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* System Benefits */}
      <Alert variant="success" className="benefits-alert">
        <Alert.Heading>System Benefits</Alert.Heading>
        <Row>
          <Col md={4}>
            <strong>For Operations Team:</strong>
            <ul>
              <li>Clear workflow visibility</li>
              <li>Streamlined progress updates</li>
              <li>Automated notifications</li>
              <li>Reduced manual errors</li>
            </ul>
          </Col>
          <Col md={4}>
            <strong>For Management:</strong>
            <ul>
              <li>Real-time progress tracking</li>
              <li>Complete audit trail</li>
              <li>Performance metrics</li>
              <li>Business rule compliance</li>
            </ul>
          </Col>
          <Col md={4}>
            <strong>For Customers:</strong>
            <ul>
              <li>Transparent progress updates</li>
              <li>Automated email notifications</li>
              <li>Accurate delivery estimates</li>
              <li>Professional communication</li>
            </ul>
          </Col>
        </Row>
      </Alert>

      {/* Order Statistics */}
      {orderStats && (
        <Card className="stats-card">
          <Card.Header>
            <h5 className="mb-0">Current Order Statistics</h5>
          </Card.Header>
          <Card.Body>
            <Row className="text-center">
              <Col md={2}>
                <div className="stat-item">
                  <h4 className="stat-number text-danger">{orderStats.initial || 0}</h4>
                  <p className="stat-label">Initial</p>
                </div>
              </Col>
              <Col md={2}>
                <div className="stat-item">
                  <h4 className="stat-number text-warning">{orderStats.onTransit || 0}</h4>
                  <p className="stat-label">On Transit</p>
                </div>
              </Col>
              <Col md={2}>
                <div className="stat-item">
                  <h4 className="stat-number text-info">{orderStats.arrived || 0}</h4>
                  <p className="stat-label">Arrived</p>
                </div>
              </Col>
              <Col md={2}>
                <div className="stat-item">
                  <h4 className="stat-number text-primary">{orderStats.clearance || 0}</h4>
                  <p className="stat-label">Clearance</p>
                </div>
              </Col>
              <Col md={2}>
                <div className="stat-item">
                  <h4 className="stat-number text-success">{orderStats.delivery || 0}</h4>
                  <p className="stat-label">Delivery</p>
                </div>
              </Col>
              <Col md={2}>
                <div className="stat-item">
                  <h4 className="stat-number text-dark">{orderStats.total || 0}</h4>
                  <p className="stat-label">Total</p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Next Steps */}
      <Alert variant="info" className="mt-4">
        <Alert.Heading>Next Steps & Recommendations</Alert.Heading>
        <ul>
          <li><strong>Test the System:</strong> Create test orders and walk through the complete workflow</li>
          <li><strong>Train Users:</strong> Ensure all team members understand the new progress management features</li>
          <li><strong>Monitor Performance:</strong> Track system usage and identify any additional improvements needed</li>
          <li><strong>Gather Feedback:</strong> Collect user feedback to refine the workflow further</li>
        </ul>
      </Alert>
    </div>
  );
};

export default WorkflowSummary;
