import React, { useState } from 'react';
import { Card, Row, Col, Button, Modal, Badge, ProgressBar, Timeline } from 'react-bootstrap';
import './ProgressionGuide.scss';

// Icons
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FlightIcon from '@mui/icons-material/Flight';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HomeIcon from '@mui/icons-material/Home';

const ProgressionGuide = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  // Progression stages with detailed explanations
  const progressionStages = [
    {
      name: 'Collected',
      duration: '1-2 days',
      color: 'secondary',
      icon: <CheckCircleIcon />,
      description: 'Order collected and processing begins',
      whatHappens: [
        'Order details are verified and confirmed',
        'Goods are collected from customer/supplier',
        'Operations team is assigned to handle the shipment',
        'Required documentation is prepared',
        'Shipping arrangements are coordinated'
      ],
      whoInvolved: ['Operations Manager', 'Collection Team', 'Documentation Team', 'Customer Service'],
      nextStep: 'Once collection and preparations are complete, the shipment moves to "On Transit"',
      example: 'Customer ABC Corp has 100 units ready. Team collects goods, verifies condition, assigns John to handle shipment, creates shipping docs, and coordinates with carrier.'
    },
    {
      name: 'On Transit',
      duration: '3-30 days',
      color: 'info',
      icon: <LocalShippingIcon />,
      description: 'Goods are physically moving to destination',
      whatHappens: [
        'Shipment departs from origin location',
        'Goods are in transit via truck, ship, or plane',
        'Real-time tracking and monitoring',
        'Regular customer updates on progress'
      ],
      whoInvolved: ['Logistics Coordinator', 'Carrier/Transport Company', 'Tracking Team'],
      nextStep: 'When goods reach the destination port/airport, status changes to "Arrived"',
      example: 'ABC Corp\'s goods are loaded on a ship in Shanghai. Takes 14 days to reach Los Angeles port. Team tracks progress daily.'
    },
    {
      name: 'Arrived',
      duration: '1-2 days',
      color: 'warning',
      icon: <LocationOnIcon />,
      description: 'Shipment has reached destination and being inspected',
      whatHappens: [
        'Goods arrive at destination port/airport',
        'Physical inspection of shipment condition',
        'Preparation of customs documentation',
        'Coordination with customs authorities'
      ],
      whoInvolved: ['Port/Airport Staff', 'Inspection Team', 'Customs Broker'],
      nextStep: 'Once inspection is complete and docs are ready, moves to "Clearance"',
      example: 'ABC Corp\'s shipment arrives at LA port. Team inspects - all 100 units in good condition. Prepares customs forms.'
    },
    {
      name: 'Clearance',
      duration: '2-5 days',
      color: 'primary',
      icon: <AccountBalanceIcon />,
      description: 'Customs clearance and duty payment in progress',
      whatHappens: [
        'Customs authorities review documentation',
        'Import duties and taxes are calculated',
        'Payment of required fees and duties',
        'Official clearance approval obtained'
      ],
      whoInvolved: ['Customs Officers', 'Customs Broker', 'Finance Team'],
      nextStep: 'After customs approval, goods are released for "Delivery"',
      example: 'Customs reviews ABC Corp\'s shipment. Calculates $2,000 in duties. Payment made, clearance approved in 3 days.'
    },
    {
      name: 'Delivery',
      duration: '1-3 days',
      color: 'warning',
      icon: <LocalShippingIcon />,
      description: 'Out for final delivery to customer',
      whatHappens: [
        'Delivery schedule coordinated with customer',
        'Local transport arranged for final delivery',
        'Driver dispatched with goods',
        'Real-time delivery tracking'
      ],
      whoInvolved: ['Delivery Coordinator', 'Local Driver', 'Customer'],
      nextStep: 'Once customer receives and signs for goods, status becomes "Delivered"',
      example: 'ABC Corp schedules delivery for Tuesday 2PM. Driver picks up goods, delivers to their warehouse, gets signature.'
    },
    {
      name: 'Delivered',
      duration: 'Complete',
      color: 'success',
      icon: <HomeIcon />,
      description: 'Successfully delivered to customer - Order complete',
      whatHappens: [
        'Customer receives goods at their location',
        'Delivery confirmation and signature obtained',
        'Order marked as complete in system',
        'Customer satisfaction survey sent'
      ],
      whoInvolved: ['Customer', 'Delivery Driver', 'Customer Service'],
      nextStep: 'Order is complete! No further action needed.',
      example: 'ABC Corp receives all 100 units at their warehouse. Signs delivery receipt. Order complete - 18 days total.'
    }
  ];

  // Get stage color class
  const getStageColorClass = (color) => {
    const colorMap = {
      'secondary': 'stage-secondary',
      'info': 'stage-info',
      'warning': 'stage-warning',
      'primary': 'stage-primary',
      'success': 'stage-success'
    };
    return colorMap[color] || 'stage-secondary';
  };

  return (
    <>
      {/* Help Button */}
      <Button
        variant="outline-info"
        size="sm"
        onClick={() => setShowGuide(true)}
        className="progression-help-btn"
      >
        <HelpOutlineIcon className="me-1" />
        How Progression Works
      </Button>

      {/* Guide Modal */}
      <Modal show={showGuide} onHide={() => setShowGuide(false)} size="xl" className="progression-guide-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <HelpOutlineIcon className="me-2" />
            How the Progression System Works
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* Stage Navigation */}
            <Col md={4}>
              <Card className="stage-nav-card">
                <Card.Header>
                  <h6 className="mb-0">Progression Stages</h6>
                </Card.Header>
                <Card.Body className="p-0">
                  {progressionStages.map((stage, index) => (
                    <div
                      key={index}
                      className={`stage-nav-item ${activeStage === index ? 'active' : ''} ${getStageColorClass(stage.color)}`}
                      onClick={() => setActiveStage(index)}
                    >
                      <div className="stage-nav-content">
                        <div className="stage-icon">
                          {stage.icon}
                        </div>
                        <div className="stage-info">
                          <div className="stage-name">{stage.name}</div>
                          <div className="stage-duration">{stage.duration}</div>
                        </div>
                        <div className="stage-number">{index + 1}</div>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            {/* Stage Details */}
            <Col md={8}>
              <Card className="stage-details-card">
                <Card.Header className={`stage-header ${getStageColorClass(progressionStages[activeStage].color)}`}>
                  <div className="d-flex align-items-center">
                    <div className="stage-icon-large">
                      {progressionStages[activeStage].icon}
                    </div>
                    <div>
                      <h5 className="mb-0">{progressionStages[activeStage].name}</h5>
                      <small>Expected Duration: {progressionStages[activeStage].duration}</small>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="stage-description mb-4">
                    <h6>What is this stage?</h6>
                    <p>{progressionStages[activeStage].description}</p>
                  </div>

                  <div className="what-happens mb-4">
                    <h6>What happens during this stage:</h6>
                    <ul>
                      {progressionStages[activeStage].whatHappens.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="who-involved mb-4">
                    <h6>Who is involved:</h6>
                    <div className="involved-tags">
                      {progressionStages[activeStage].whoInvolved.map((person, index) => (
                        <Badge key={index} bg="light" text="dark" className="me-2 mb-2">
                          {person}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="next-step mb-4">
                    <h6>What happens next:</h6>
                    <p className="next-step-text">{progressionStages[activeStage].nextStep}</p>
                  </div>

                  <div className="example">
                    <h6>Real Example:</h6>
                    <div className="example-box">
                      <p>{progressionStages[activeStage].example}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Progress Flow Visualization */}
          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Complete Flow Visualization</h6>
                </Card.Header>
                <Card.Body>
                  <div className="flow-visualization">
                    {progressionStages.map((stage, index) => (
                      <div key={index} className="flow-stage">
                        <div className={`flow-stage-circle ${getStageColorClass(stage.color)} ${activeStage === index ? 'active' : ''}`}>
                          {stage.icon}
                        </div>
                        <div className="flow-stage-info">
                          <div className="flow-stage-name">{stage.name}</div>
                          <div className="flow-stage-duration">{stage.duration}</div>
                        </div>
                        {index < progressionStages.length - 1 && (
                          <div className="flow-arrow">
                            <PlayArrowIcon />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Key Features */}
          <Row className="mt-4">
            <Col md={6}>
              <Card className="feature-card">
                <Card.Header>
                  <h6 className="mb-0">
                    <AccessTimeIcon className="me-2" />
                    Time Tracking
                  </h6>
                </Card.Header>
                <Card.Body>
                  <ul className="feature-list">
                    <li>System automatically tracks time spent in each stage</li>
                    <li>Shows if orders are taking longer than expected</li>
                    <li>Highlights overdue orders in red</li>
                    <li>Calculates average completion times</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="feature-card">
                <Card.Header>
                  <h6 className="mb-0">
                    <CheckCircleIcon className="me-2" />
                    Automatic Updates
                  </h6>
                </Card.Header>
                <Card.Body>
                  <ul className="feature-list">
                    <li>Operations team gets notified of all changes</li>
                    <li>Customers receive automatic progress updates</li>
                    <li>System logs all progress changes with timestamps</li>
                    <li>Generates performance reports automatically</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGuide(false)}>
            Close Guide
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setActiveStage((prev) => (prev + 1) % progressionStages.length);
            }}
          >
            Next Stage
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProgressionGuide;
