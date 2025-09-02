import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { useGetOrdersQuery, useChangeProgressMutation } from '../../state/servicesApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import './OperationsBoard.scss';

// Icons
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FlightIcon from '@mui/icons-material/Flight';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

const OperationsBoard = () => {
  const { userInfo } = useSelector(state => state.auth);
  
  // State for filters
  const [filters, setFilters] = useState({
    progress: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Form states
  const [editForm, setEditForm] = useState({
    progress: '',
    notes: '',
    notifyClient: true
  });
  
  const [deliveryForm, setDeliveryForm] = useState({
    deliveryNotes: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    clientConfirmation: false
  });
  
  // API hooks - using existing endpoints
  const { data: ordersData, isLoading, error, refetch } = useGetOrdersQuery();
  const [changeProgress, { isLoading: isUpdating }] = useChangeProgressMutation();

  // Process orders data to create operations board structure
  const boardData = useMemo(() => {
    if (!ordersData) return null;

    // Filter orders based on current filters
    let filteredOrders = ordersData.filter(order => {
      // Only show approved orders
      if (order.status !== 'Approved') return false;

      // Apply progress filter
      if (filters.progress && order.progress !== filters.progress) return false;

      // Apply date filters
      if (filters.dateFrom && new Date(order.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(order.createdAt) > new Date(filters.dateTo)) return false;

      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          order.companyName?.toLowerCase().includes(searchLower) ||
          order.contactPerson?.toLowerCase().includes(searchLower) ||
          order.consignment?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      return true;
    });

    // Group orders by progress status
    const operations = {
      clearance: filteredOrders.filter(s => s.progress === 'Clearance'),
      inTransit: filteredOrders.filter(s => s.progress === 'On Transit'),
      arrived: filteredOrders.filter(s => s.progress === 'Arrived'),
      delivery: filteredOrders.filter(s => s.progress === 'Delivery'),
      delivered: filteredOrders.filter(s => s.progress === 'Delivered'),
      initial: filteredOrders.filter(s => s.progress === 'Initial' || !s.progress),
      all: filteredOrders
    };

    // Add summary statistics
    const summary = {
      total: filteredOrders.length,
      clearance: operations.clearance.length,
      inTransit: operations.inTransit.length,
      arrived: operations.arrived.length,
      delivery: operations.delivery.length,
      delivered: operations.delivered.length,
      initial: operations.initial.length
    };

    return { data: operations, summary };
  }, [ordersData, filters]);
  
  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({
      progress: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
  };
  
  // Handle edit order
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setEditForm({
      progress: order.progress || '',
      notes: '',
      notifyClient: true
    });
    setShowEditModal(true);
  };
  
  // Handle mark as delivered
  const handleMarkAsDelivered = (order) => {
    setSelectedOrder(order);
    setDeliveryForm({
      deliveryNotes: '',
      deliveryDate: new Date().toISOString().split('T')[0],
      clientConfirmation: false
    });
    setShowDeliveryModal(true);
  };
  
  // Submit edit form
  const handleEditSubmit = async () => {
    try {
      await changeProgress({
        id: selectedOrder._id,
        Progress: editForm.progress,
        notes: editForm.notes,
        updatedBy: userInfo
      }).unwrap();

      toast.success('Order updated successfully');
      setShowEditModal(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error?.message || 'Failed to update order');
    }
  };

  // Submit delivery form
  const handleDeliverySubmit = async () => {
    try {
      await changeProgress({
        id: selectedOrder._id,
        Progress: 'Delivered',
        notes: `Delivered on ${deliveryForm.deliveryDate}. ${deliveryForm.deliveryNotes}`,
        updatedBy: userInfo
      }).unwrap();

      toast.success('Order marked as delivered successfully');
      setShowDeliveryModal(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error?.message || 'Failed to mark as delivered');
    }
  };
  
  // Get progress color
  const getProgressColor = (progress) => {
    const colors = {
      'Initial': 'danger',
      'On Transit': 'warning',
      'Arrived': 'info',
      'Clearance': 'primary',
      'Delivery': 'success',
      'Delivered': 'dark'
    };
    return colors[progress] || 'secondary';
  };
  
  // Get transport icon
  const getTransportIcon = (transport) => {
    if (transport?.includes('Air')) return <FlightIcon />;
    if (transport?.includes('Sea') || transport?.includes('Road')) return <LocalShippingIcon />;
    return <InventoryIcon />;
  };
  
  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          Error loading operations board: {error?.data?.error || error.message}
        </Alert>
      </Container>
    );
  }
  
  const operations = boardData?.data || {};
  const summary = boardData?.summary || {};
  
  return (
    <Container fluid className="operations-board">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="operations-title">Operations Board</h2>
          <p className="text-muted">Comprehensive view of all goods in transit, clearance, and delivery</p>
        </Col>
      </Row>
      
      {/* Filters */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Select 
            value={filters.progress} 
            onChange={(e) => handleFilterChange('progress', e.target.value)}
          >
            <option value="">All Progress States</option>
            <option value="Initial">Initial</option>
            <option value="On Transit">On Transit</option>
            <option value="Arrived">Arrived</option>
            <option value="Clearance">Clearance</option>
            <option value="Delivery">Delivery</option>
            <option value="Delivered">Delivered</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            placeholder="From Date"
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            placeholder="To Date"
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search company, contact, or consignment..."
          />
        </Col>
        <Col md={2}>
          <Button variant="outline-secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Col>
      </Row>
      
      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={2}>
          <Card className="summary-card">
            <Card.Body className="text-center">
              <h4 className="text-primary">{summary?.total || 0}</h4>
              <small>Total Orders</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="summary-card">
            <Card.Body className="text-center">
              <h4 className="text-warning">{summary?.inTransit || 0}</h4>
              <small>In Transit</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="summary-card">
            <Card.Body className="text-center">
              <h4 className="text-info">{summary?.arrived || 0}</h4>
              <small>Arrived</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="summary-card">
            <Card.Body className="text-center">
              <h4 className="text-primary">{summary?.clearance || 0}</h4>
              <small>Clearance</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="summary-card">
            <Card.Body className="text-center">
              <h4 className="text-success">{summary?.delivery || 0}</h4>
              <small>Delivery</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="summary-card">
            <Card.Body className="text-center">
              <h4 className="text-dark">{summary?.delivered || 0}</h4>
              <small>Delivered</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Kanban Board */}
      <Row className="operations-kanban">
        {/* Clearance Column */}
        <Col md={2} className="kanban-column">
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">Clearance ({operations?.clearance?.length || 0})</h6>
            </Card.Header>
            <Card.Body className="kanban-body">
              {operations?.clearance?.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onEdit={handleEditOrder}
                  onMarkDelivered={handleMarkAsDelivered}
                  getProgressColor={getProgressColor}
                  getTransportIcon={getTransportIcon}
                />
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* In Transit Column */}
        <Col md={2} className="kanban-column">
          <Card className="h-100">
            <Card.Header className="bg-warning text-white">
              <h6 className="mb-0">In Transit ({operations?.inTransit?.length || 0})</h6>
            </Card.Header>
            <Card.Body className="kanban-body">
              {operations?.inTransit?.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onEdit={handleEditOrder}
                  onMarkDelivered={handleMarkAsDelivered}
                  getProgressColor={getProgressColor}
                  getTransportIcon={getTransportIcon}
                />
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Arrived Column */}
        <Col md={2} className="kanban-column">
          <Card className="h-100">
            <Card.Header className="bg-info text-white">
              <h6 className="mb-0">Arrived ({operations?.arrived?.length || 0})</h6>
            </Card.Header>
            <Card.Body className="kanban-body">
              {operations?.arrived?.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onEdit={handleEditOrder}
                  onMarkDelivered={handleMarkAsDelivered}
                  getProgressColor={getProgressColor}
                  getTransportIcon={getTransportIcon}
                />
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Delivery Column */}
        <Col md={2} className="kanban-column">
          <Card className="h-100">
            <Card.Header className="bg-success text-white">
              <h6 className="mb-0">Delivery ({operations?.delivery?.length || 0})</h6>
            </Card.Header>
            <Card.Body className="kanban-body">
              {operations?.delivery?.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onEdit={handleEditOrder}
                  onMarkDelivered={handleMarkAsDelivered}
                  getProgressColor={getProgressColor}
                  getTransportIcon={getTransportIcon}
                />
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Delivered Column */}
        <Col md={2} className="kanban-column">
          <Card className="h-100">
            <Card.Header className="bg-dark text-white">
              <h6 className="mb-0">Delivered ({operations?.delivered?.length || 0})</h6>
            </Card.Header>
            <Card.Body className="kanban-body">
              {operations?.delivered?.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onEdit={handleEditOrder}
                  onMarkDelivered={handleMarkAsDelivered}
                  getProgressColor={getProgressColor}
                  getTransportIcon={getTransportIcon}
                  isDelivered={true}
                />
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Initial Column */}
        <Col md={2} className="kanban-column">
          <Card className="h-100">
            <Card.Header className="bg-danger text-white">
              <h6 className="mb-0">Initial ({operations?.initial?.length || 0})</h6>
            </Card.Header>
            <Card.Body className="kanban-body">
              {operations?.initial?.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onEdit={handleEditOrder}
                  onMarkDelivered={handleMarkAsDelivered}
                  getProgressColor={getProgressColor}
                  getTransportIcon={getTransportIcon}
                />
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Order Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <div className="mb-3">
                <strong>Order:</strong> {selectedOrder.companyName} - {selectedOrder.contactPerson}
              </div>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Progress Status</Form.Label>
                  <Form.Select
                    value={editForm.progress}
                    onChange={(e) => setEditForm(prev => ({ ...prev, progress: e.target.value }))}
                  >
                    <option value="">Select Progress</option>
                    <option value="Initial">Initial</option>
                    <option value="On Transit">On Transit</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Clearance">Clearance</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editForm.notes}
                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add notes about this status update..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Notify client via email"
                    checked={editForm.notifyClient}
                    onChange={(e) => setEditForm(prev => ({ ...prev, notifyClient: e.target.checked }))}
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEditSubmit}
            disabled={isUpdating || !editForm.progress}
          >
            {isUpdating ? 'Updating...' : 'Update Order'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Mark as Delivered Modal */}
      <Modal show={showDeliveryModal} onHide={() => setShowDeliveryModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Mark as Delivered</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <div className="mb-3">
                <strong>Order:</strong> {selectedOrder.companyName} - {selectedOrder.contactPerson}
              </div>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Delivery Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={deliveryForm.deliveryDate}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, deliveryDate: e.target.value }))}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Delivery Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={deliveryForm.deliveryNotes}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, deliveryNotes: e.target.value }))}
                    placeholder="Add delivery notes, recipient details, etc..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Client confirmation received"
                    checked={deliveryForm.clientConfirmation}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, clientConfirmation: e.target.checked }))}
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeliveryModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleDeliverySubmit}
            disabled={isUpdating}
          >
            {isUpdating ? 'Marking as Delivered...' : 'Mark as Delivered'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// OrderCard Component
const OrderCard = ({ order, onEdit, onMarkDelivered, getProgressColor, getTransportIcon, isDelivered = false }) => {
  return (
    <Card className="order-card mb-2" size="sm">
      <Card.Body className="p-2">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="flex-grow-1">
            <h6 className="card-title mb-1" style={{ fontSize: '0.85rem' }}>
              {order.companyName}
            </h6>
            <p className="card-text mb-1" style={{ fontSize: '0.75rem', color: '#666' }}>
              {order.contactPerson}
            </p>
          </div>
          <div className="transport-icon">
            {getTransportIcon(order.transport)}
          </div>
        </div>

        <div className="order-details mb-2">
          <div className="d-flex justify-content-between" style={{ fontSize: '0.7rem' }}>
            <span><strong>From:</strong> {order.origin}</span>
          </div>
          <div className="d-flex justify-content-between" style={{ fontSize: '0.7rem' }}>
            <span><strong>To:</strong> {order.destination}</span>
          </div>
          {order.consignment && (
            <div style={{ fontSize: '0.7rem' }}>
              <strong>Consignment:</strong> {order.consignment}
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <Badge bg={getProgressColor(order.progress)} style={{ fontSize: '0.6rem' }}>
            {order.progress}
          </Badge>
          <div className="order-actions">
            <Button
              variant="outline-primary"
              size="sm"
              className="me-1"
              onClick={() => onEdit(order)}
              style={{ fontSize: '0.7rem', padding: '2px 6px' }}
            >
              <EditIcon style={{ fontSize: '0.8rem' }} />
            </Button>
            {!isDelivered && order.progress !== 'Delivered' && (
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => onMarkDelivered(order)}
                style={{ fontSize: '0.7rem', padding: '2px 6px' }}
              >
                <CheckCircleIcon style={{ fontSize: '0.8rem' }} />
              </Button>
            )}
          </div>
        </div>

        {order.deliveryDate && (
          <div className="mt-1" style={{ fontSize: '0.65rem', color: '#28a745' }}>
            <strong>Delivered:</strong> {format(new Date(order.deliveryDate), 'MMM dd, yyyy')}
          </div>
        )}

        <div className="mt-1" style={{ fontSize: '0.65rem', color: '#666' }}>
          <strong>Created:</strong> {format(new Date(order.createdAt), 'MMM dd, yyyy')}
        </div>
      </Card.Body>
    </Card>
  );
};

export default OperationsBoard;
