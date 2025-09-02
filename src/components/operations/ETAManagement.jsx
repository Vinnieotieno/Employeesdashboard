import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './ETAManagement.scss';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlightIcon from '@mui/icons-material/Flight';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';

const ETAManagement = ({ orders, onUpdateETA, onUpdateTracking }) => {
  const [showETAModal, setShowETAModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [etaForm, setETAForm] = useState({
    estimatedArrival: '',
    trackingNumber: '',
    carrier: '',
    currentLocation: '',
    hasETA: false,
    etaConfidence: 'medium',
    weatherImpact: 'none',
    notes: ''
  });

  // Get transport icon
  const getTransportIcon = (transport) => {
    switch (transport?.toLowerCase()) {
      case 'air freight':
        return <FlightIcon />;
      case 'sea freight':
        return <DirectionsBoatIcon />;
      case 'road freight':
        return <LocalShippingIcon />;
      default:
        return <LocalShippingIcon />;
    }
  };

  // Calculate ETA status
  const getETAStatus = (order) => {
    if (!order.shipmentTracking?.hasETA) {
      return { status: 'no-eta', color: 'secondary', text: 'No ETA Set' };
    }

    const eta = new Date(order.shipmentTracking.estimatedArrival);
    const now = new Date();
    const diffHours = (eta - now) / (1000 * 60 * 60);

    if (order.shipmentTracking.isDelayed) {
      return { status: 'delayed', color: 'danger', text: 'Delayed' };
    }

    if (diffHours < 0) {
      return { status: 'overdue', color: 'danger', text: 'Overdue' };
    } else if (diffHours < 24) {
      return { status: 'arriving-soon', color: 'warning', text: 'Arriving Soon' };
    } else if (diffHours < 72) {
      return { status: 'on-track', color: 'info', text: 'On Track' };
    } else {
      return { status: 'scheduled', color: 'success', text: 'Scheduled' };
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle ETA update
  const handleETAUpdate = () => {
    setShowETAModal(true);
  };

  // Submit ETA form
  const handleETASubmit = async () => {
    try {
      const updateData = {
        id: selectedOrder._id,
        shipmentTracking: {
          ...selectedOrder.shipmentTracking,
          ...etaForm,
          estimatedArrival: etaForm.estimatedArrival ? new Date(etaForm.estimatedArrival) : null,
        }
      };

      await onUpdateETA(updateData);
      toast.success('ETA updated successfully');
      setShowETAModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to update ETA');
    }
  };

  // Reset form
  const resetForm = () => {
    setETAForm({
      estimatedArrival: '',
      trackingNumber: '',
      carrier: '',
      currentLocation: '',
      hasETA: false,
      etaConfidence: 'medium',
      weatherImpact: 'none',
      notes: ''
    });
    setSelectedOrder(null);
  };

  // Open ETA modal for specific order
  const openETAModal = (order) => {
    setSelectedOrder(order);
    const tracking = order.shipmentTracking || {};
    setETAForm({
      estimatedArrival: tracking.estimatedArrival ? 
        new Date(tracking.estimatedArrival).toISOString().slice(0, 16) : '',
      trackingNumber: tracking.trackingNumber || '',
      carrier: tracking.carrier || '',
      currentLocation: tracking.currentLocation || '',
      hasETA: tracking.hasETA || false,
      etaConfidence: tracking.etaConfidence || 'medium',
      weatherImpact: tracking.weatherImpact || 'none',
      notes: ''
    });
    setShowETAModal(true);
  };

  // Filter orders that need ETA management
  const ordersNeedingETA = orders?.filter(order => 
    ['On Transit', 'Arrived', 'Clearance'].includes(order.progress)
  ) || [];

  const ordersWithoutETA = ordersNeedingETA.filter(order => 
    !order.shipmentTracking?.hasETA
  );

  const ordersWithETA = ordersNeedingETA.filter(order => 
    order.shipmentTracking?.hasETA
  );

  return (
    <div className="eta-management">
      <Row className="mb-4">
        <Col>
          <h4 className="section-title">
            <AccessTimeIcon className="me-2" />
            ETA Management Dashboard
          </h4>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body className="text-center">
              <h3 className="text-danger">{ordersWithoutETA.length}</h3>
              <p className="mb-0">No ETA Set</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body className="text-center">
              <h3 className="text-warning">
                {ordersWithETA.filter(o => getETAStatus(o).status === 'arriving-soon').length}
              </h3>
              <p className="mb-0">Arriving Soon</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body className="text-center">
              <h3 className="text-danger">
                {ordersWithETA.filter(o => getETAStatus(o).status === 'delayed').length}
              </h3>
              <p className="mb-0">Delayed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body className="text-center">
              <h3 className="text-success">
                {ordersWithETA.filter(o => getETAStatus(o).status === 'on-track').length}
              </h3>
              <p className="mb-0">On Track</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Orders Without ETA */}
      {ordersWithoutETA.length > 0 && (
        <Card className="mb-4">
          <Card.Header className="bg-warning text-dark">
            <h5 className="mb-0">
              <WarningIcon className="me-2" />
              Shipments Without ETA ({ordersWithoutETA.length})
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {ordersWithoutETA.map(order => (
                <Col md={6} lg={4} key={order._id} className="mb-3">
                  <Card className="order-card no-eta">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">{order.companyName}</h6>
                        {getTransportIcon(order.transport)}
                      </div>
                      <p className="text-muted small mb-2">{order.consignment}</p>
                      <Badge bg="secondary" className="mb-2">{order.progress}</Badge>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {order.origin} → {order.destination}
                        </small>
                        <Button 
                          size="sm" 
                          variant="primary"
                          onClick={() => openETAModal(order)}
                        >
                          Set ETA
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Orders With ETA */}
      {ordersWithETA.length > 0 && (
        <Card>
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">
              <CheckCircleIcon className="me-2" />
              Tracked Shipments ({ordersWithETA.length})
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {ordersWithETA.map(order => {
                const etaStatus = getETAStatus(order);
                const tracking = order.shipmentTracking || {};
                
                return (
                  <Col md={6} lg={4} key={order._id} className="mb-3">
                    <Card className={`order-card has-eta ${etaStatus.status}`}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0">{order.companyName}</h6>
                          {getTransportIcon(order.transport)}
                        </div>
                        <p className="text-muted small mb-2">{order.consignment}</p>
                        
                        <div className="mb-2">
                          <Badge bg={etaStatus.color} className="me-2">{etaStatus.text}</Badge>
                          <Badge bg="secondary">{order.progress}</Badge>
                        </div>
                        
                        <div className="eta-info mb-2">
                          <small className="d-block">
                            <AccessTimeIcon className="me-1" style={{fontSize: '14px'}} />
                            ETA: {formatDate(tracking.estimatedArrival)}
                          </small>
                          {tracking.currentLocation && (
                            <small className="d-block">
                              <LocationOnIcon className="me-1" style={{fontSize: '14px'}} />
                              {tracking.currentLocation}
                            </small>
                          )}
                          {tracking.trackingNumber && (
                            <small className="d-block text-muted">
                              Tracking: {tracking.trackingNumber}
                            </small>
                          )}
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {order.origin} → {order.destination}
                          </small>
                          <Button 
                            size="sm" 
                            variant="outline-primary"
                            onClick={() => openETAModal(order)}
                          >
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
      )}

      {/* ETA Update Modal */}
      <Modal show={showETAModal} onHide={() => setShowETAModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedOrder?.shipmentTracking?.hasETA ? 'Update ETA' : 'Set ETA'} - {selectedOrder?.companyName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estimated Arrival Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={etaForm.estimatedArrival}
                    onChange={(e) => setETAForm(prev => ({ 
                      ...prev, 
                      estimatedArrival: e.target.value,
                      hasETA: !!e.target.value 
                    }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ETA Confidence</Form.Label>
                  <Form.Select
                    value={etaForm.etaConfidence}
                    onChange={(e) => setETAForm(prev => ({ ...prev, etaConfidence: e.target.value }))}
                  >
                    <option value="high">High Confidence</option>
                    <option value="medium">Medium Confidence</option>
                    <option value="low">Low Confidence</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tracking Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={etaForm.trackingNumber}
                    onChange={(e) => setETAForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                    placeholder="Enter tracking number"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Carrier</Form.Label>
                  <Form.Control
                    type="text"
                    value={etaForm.carrier}
                    onChange={(e) => setETAForm(prev => ({ ...prev, carrier: e.target.value }))}
                    placeholder="Enter carrier name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={etaForm.currentLocation}
                    onChange={(e) => setETAForm(prev => ({ ...prev, currentLocation: e.target.value }))}
                    placeholder="Enter current location"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Weather Impact</Form.Label>
                  <Form.Select
                    value={etaForm.weatherImpact}
                    onChange={(e) => setETAForm(prev => ({ ...prev, weatherImpact: e.target.value }))}
                  >
                    <option value="none">No Impact</option>
                    <option value="minor">Minor Impact</option>
                    <option value="moderate">Moderate Impact</option>
                    <option value="severe">Severe Impact</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={etaForm.notes}
                onChange={(e) => setETAForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes about the shipment..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowETAModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleETASubmit}>
            {selectedOrder?.shipmentTracking?.hasETA ? 'Update ETA' : 'Set ETA'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ETAManagement;
