import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FlightIcon from '@mui/icons-material/Flight';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HomeIcon from '@mui/icons-material/Home';
import './ProgressTimeline.scss';

const ProgressTimeline = ({ currentProgress, orderData, compact = false }) => {
  const progressSteps = [
    {
      key: 'Initial',
      label: 'Initial',
      icon: <AssignmentTurnedInIcon />,
      color: 'danger',
      description: 'Order approved and ready to start',
      details: 'Quote confirmed and order processing initiated'
    },
    {
      key: 'On Transit',
      label: 'On Transit',
      icon: orderData?.transport === 'Air Freight' ? <FlightIcon /> : <LocalShippingIcon />,
      color: 'warning',
      description: 'Shipment in transit',
      details: `Goods shipped via ${orderData?.transport || 'transport'} from ${orderData?.origin || 'origin'}`
    },
    {
      key: 'Arrived',
      label: 'Arrived',
      icon: <InventoryIcon />,
      color: 'info',
      description: 'Shipment arrived at destination',
      details: `Arrived at ${orderData?.destination || 'destination'} and awaiting clearance`
    },
    {
      key: 'Clearance',
      label: 'Clearance',
      icon: <AssignmentTurnedInIcon />,
      color: 'primary',
      description: 'Customs clearance in progress',
      details: 'Processing customs documentation and clearance procedures'
    },
    {
      key: 'Delivery',
      label: 'Delivery',
      icon: <HomeIcon />,
      color: 'success',
      description: 'Ready for final delivery',
      details: 'Cleared and ready for final delivery to customer'
    }
  ];

  const getCurrentStepIndex = () => {
    const index = progressSteps.findIndex(step => step.key === currentProgress);
    return index !== -1 ? index : -1;
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  const getEstimatedTime = (stepKey) => {
    const timeEstimates = {
      'Initial': '1-2 days',
      'On Transit': orderData?.transport === 'Air Freight' ? '3-7 days' : '14-30 days',
      'Arrived': '1-2 days',
      'Clearance': '2-5 days',
      'Delivery': '1-3 days'
    };
    return timeEstimates[stepKey] || 'TBD';
  };

  if (compact) {
    return (
      <div className="progress-timeline-compact">
        <div className="timeline-progress-bar">
          <div 
            className="timeline-progress-fill" 
            style={{ width: `${((currentStepIndex + 1) / progressSteps.length) * 100}%` }}
          />
        </div>
        <div className="timeline-steps-compact">
          {progressSteps.map((step, index) => {
            const status = getStepStatus(index);
            return (
              <div key={step.key} className={`timeline-step-compact ${status}`}>
                <div className="step-icon-compact">
                  {status === 'completed' ? <CheckCircleIcon /> : step.icon}
                </div>
                <span className="step-label-compact">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="progress-timeline">
      <div className="timeline-header">
        <h5>Order Progress Timeline</h5>
        <Badge bg={progressSteps[currentStepIndex]?.color || 'secondary'}>
          {currentProgress || 'Not Started'}
        </Badge>
      </div>

      <div className="timeline-container">
        {progressSteps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === progressSteps.length - 1;

          return (
            <div key={step.key} className={`timeline-item ${status}`}>
              <div className="timeline-marker">
                <div className="timeline-icon">
                  {status === 'completed' ? (
                    <CheckCircleIcon className="completed-icon" />
                  ) : status === 'current' ? (
                    <div className="current-pulse">
                      {step.icon}
                    </div>
                  ) : (
                    <RadioButtonUncheckedIcon className="pending-icon" />
                  )}
                </div>
                {!isLast && <div className={`timeline-line ${status === 'completed' ? 'completed' : ''}`} />}
              </div>

              <div className="timeline-content">
                <Card className={`timeline-card ${status}`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="timeline-title">
                          {step.label}
                          {status === 'current' && <Badge bg="primary" className="ms-2">Current</Badge>}
                          {status === 'completed' && <Badge bg="success" className="ms-2">Completed</Badge>}
                        </h6>
                        <p className="timeline-description">{step.description}</p>
                        <small className="timeline-details text-muted">{step.details}</small>
                      </div>
                      <div className="timeline-meta">
                        <small className="text-muted">
                          Est. Time: {getEstimatedTime(step.key)}
                        </small>
                      </div>
                    </div>

                    {status === 'current' && (
                      <div className="current-step-actions mt-3">
                        <div className="action-hint">
                          <small className="text-primary">
                            <strong>Next Action:</strong> {
                              step.key === 'Initial' ? 'Upload shipping documents and mark as "On Transit"' :
                              step.key === 'On Transit' ? 'Confirm arrival at destination' :
                              step.key === 'Arrived' ? 'Begin customs clearance process' :
                              step.key === 'Clearance' ? 'Complete clearance and prepare for delivery' :
                              'Assign driver and schedule final delivery'
                            }
                          </small>
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </div>
          );
        })}
      </div>

      <div className="timeline-summary mt-4">
        <Card className="summary-card">
          <Card.Body>
            <div className="row">
              <div className="col-md-4">
                <div className="summary-stat">
                  <strong>{currentStepIndex + 1}</strong> of <strong>{progressSteps.length}</strong>
                  <br />
                  <small className="text-muted">Steps Completed</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="summary-stat">
                  <strong>{Math.round(((currentStepIndex + 1) / progressSteps.length) * 100)}%</strong>
                  <br />
                  <small className="text-muted">Progress</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="summary-stat">
                  <strong>{progressSteps.length - currentStepIndex - 1}</strong>
                  <br />
                  <small className="text-muted">Steps Remaining</small>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ProgressTimeline;
