import React, { useState } from 'react';
import { Card, Row, Col, Button, Form, Table, Badge, Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './OperationsReporting.scss';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GetAppIcon from '@mui/icons-material/GetApp';
import FilterListIcon from '@mui/icons-material/FilterList';

import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import BarChartIcon from '@mui/icons-material/BarChart';

const OperationsReporting = ({ orders, onExportReport, onGenerateAnalytics }) => {
  const [reportFilters, setReportFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: '',
    transport: '',
    origin: '',
    destination: '',
    reportType: 'summary'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calculate key metrics
  const calculateMetrics = (filteredOrders) => {
    const total = filteredOrders.length;
    const delivered = filteredOrders.filter(o => o.progress === 'Delivered').length;
    const inTransit = filteredOrders.filter(o => ['On Transit', 'Arrived', 'Clearance', 'Delivery'].includes(o.progress)).length;
    const delayed = filteredOrders.filter(o => o.shipmentTracking?.isDelayed).length;
    const onTime = filteredOrders.filter(o => o.operationalMetrics?.onTimeDelivery).length;
    
    // Calculate average delivery time
    const deliveredOrders = filteredOrders.filter(o => o.progress === 'Delivered' && o.operationalMetrics?.actualDuration);
    const avgDeliveryTime = deliveredOrders.length > 0 
      ? deliveredOrders.reduce((sum, o) => sum + o.operationalMetrics.actualDuration, 0) / deliveredOrders.length 
      : 0;
    
    // Calculate efficiency
    const efficiency = total > 0 ? (delivered / total) * 100 : 0;
    
    // Calculate customer satisfaction
    const satisfactionOrders = filteredOrders.filter(o => o.operationalMetrics?.customerSatisfaction);
    const avgSatisfaction = satisfactionOrders.length > 0
      ? satisfactionOrders.reduce((sum, o) => sum + o.operationalMetrics.customerSatisfaction, 0) / satisfactionOrders.length
      : 0;

    return {
      total,
      delivered,
      inTransit,
      delayed,
      onTime,
      avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10,
      efficiency: Math.round(efficiency * 10) / 10,
      avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
      onTimePercentage: total > 0 ? Math.round((onTime / total) * 100 * 10) / 10 : 0
    };
  };

  // Filter orders based on criteria
  const getFilteredOrders = () => {
    let filtered = orders || [];

    if (reportFilters.dateFrom) {
      filtered = filtered.filter(o => new Date(o.createdAt) >= new Date(reportFilters.dateFrom));
    }
    
    if (reportFilters.dateTo) {
      filtered = filtered.filter(o => new Date(o.createdAt) <= new Date(reportFilters.dateTo));
    }
    
    if (reportFilters.status) {
      filtered = filtered.filter(o => o.progress === reportFilters.status);
    }
    
    if (reportFilters.transport) {
      filtered = filtered.filter(o => o.transport === reportFilters.transport);
    }
    
    if (reportFilters.origin) {
      filtered = filtered.filter(o => o.origin.toLowerCase().includes(reportFilters.origin.toLowerCase()));
    }
    
    if (reportFilters.destination) {
      filtered = filtered.filter(o => o.destination.toLowerCase().includes(reportFilters.destination.toLowerCase()));
    }

    return filtered;
  };

  // Generate report
  const generateReport = async () => {
    setLoading(true);
    try {
      const filteredOrders = getFilteredOrders();
      const metrics = calculateMetrics(filteredOrders);
      
      const reportData = {
        filters: reportFilters,
        metrics,
        orders: filteredOrders,
        generatedAt: new Date().toISOString(),
        reportType: reportFilters.reportType
      };
      
      setReportData(reportData);
      
      if (onGenerateAnalytics) {
        await onGenerateAnalytics(reportData);
      }
      
      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  // Export report
  const exportReport = async (format) => {
    if (!reportData) {
      toast.error('Please generate a report first');
      return;
    }

    try {
      await onExportReport(reportData, format);
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  // Get unique values for filters
  const getUniqueValues = (field) => {
    const values = orders?.map(o => o[field]).filter(Boolean) || [];
    return [...new Set(values)];
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Initial': 'secondary',
      'On Transit': 'info',
      'Arrived': 'warning',
      'Clearance': 'primary',
      'Delivery': 'warning',
      'Delivered': 'success'
    };
    return colors[status] || 'secondary';
  };

  const filteredOrders = getFilteredOrders();
  const metrics = calculateMetrics(filteredOrders);

  return (
    <div className="operations-reporting">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="section-title">
              <AssessmentIcon className="me-2" />
              Operations Reports & Analytics
            </h4>
            <div className="report-actions">
              <Button 
                variant="outline-primary" 
                className="me-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterListIcon className="me-1" />
                Filters
              </Button>
              <Button 
                variant="primary" 
                onClick={generateReport}
                disabled={loading}
              >
                <BarChartIcon className="me-1" />
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">Report Filters</h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Date From</Form.Label>
                  <Form.Control
                    type="date"
                    value={reportFilters.dateFrom}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Date To</Form.Label>
                  <Form.Control
                    type="date"
                    value={reportFilters.dateTo}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={reportFilters.status}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">All Statuses</option>
                    <option value="Collected">Collected</option>
                    <option value="On Transit">On Transit</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Clearance">Clearance</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Transport</Form.Label>
                  <Form.Select
                    value={reportFilters.transport}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, transport: e.target.value }))}
                  >
                    <option value="">All Transport</option>
                    {getUniqueValues('transport').map(transport => (
                      <option key={transport} value={transport}>{transport}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Origin</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Filter by origin..."
                    value={reportFilters.origin}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, origin: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Destination</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Filter by destination..."
                    value={reportFilters.destination}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, destination: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Report Type</Form.Label>
                  <Form.Select
                    value={reportFilters.reportType}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, reportType: e.target.value }))}
                  >
                    <option value="summary">Summary Report</option>
                    <option value="detailed">Detailed Report</option>
                    <option value="performance">Performance Analysis</option>
                    <option value="delays">Delay Analysis</option>
                    <option value="customer">Customer Satisfaction</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Key Metrics Dashboard */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="metric-card total">
            <Card.Body className="text-center">
              <div className="metric-icon">
                <BarChartIcon />
              </div>
              <h3>{metrics.total}</h3>
              <p className="mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card delivered">
            <Card.Body className="text-center">
              <div className="metric-icon">
                <CheckCircleIcon />
              </div>
              <h3>{metrics.delivered}</h3>
              <p className="mb-0">Delivered</p>
              <small className="text-muted">{metrics.efficiency}% efficiency</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card in-transit">
            <Card.Body className="text-center">
              <div className="metric-icon">
                <ScheduleIcon />
              </div>
              <h3>{metrics.inTransit}</h3>
              <p className="mb-0">In Transit</p>
              <small className="text-muted">{metrics.avgDeliveryTime} days avg</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card delayed">
            <Card.Body className="text-center">
              <div className="metric-icon">
                <WarningIcon />
              </div>
              <h3>{metrics.delayed}</h3>
              <p className="mb-0">Delayed</p>
              <small className="text-muted">{metrics.onTimePercentage}% on-time</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Report Results */}
      {reportData && (
        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              Report Results - {reportData.reportType.charAt(0).toUpperCase() + reportData.reportType.slice(1)}
            </h6>
            <div className="export-actions">
              <Dropdown>
                <Dropdown.Toggle variant="success" size="sm">
                  <GetAppIcon className="me-1" />
                  Export
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => exportReport('pdf')}>
                    Export as PDF
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => exportReport('excel')}>
                    Export as Excel
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => exportReport('csv')}>
                    Export as CSV
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Card.Header>
          <Card.Body>
            {reportFilters.reportType === 'summary' && (
              <div className="summary-report">
                <Row className="mb-4">
                  <Col md={6}>
                    <h6>Performance Summary</h6>
                    <ul className="list-unstyled">
                      <li><strong>Total Orders:</strong> {metrics.total}</li>
                      <li><strong>Completion Rate:</strong> {metrics.efficiency}%</li>
                      <li><strong>Average Delivery Time:</strong> {metrics.avgDeliveryTime} days</li>
                      <li><strong>On-Time Delivery:</strong> {metrics.onTimePercentage}%</li>
                      <li><strong>Customer Satisfaction:</strong> {metrics.avgSatisfaction}/5</li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6>Status Breakdown</h6>
                    <ul className="list-unstyled">
                      <li><Badge bg="success">Delivered:</Badge> {metrics.delivered}</li>
                      <li><Badge bg="info">In Transit:</Badge> {metrics.inTransit}</li>
                      <li><Badge bg="warning">Delayed:</Badge> {metrics.delayed}</li>
                    </ul>
                  </Col>
                </Row>
              </div>
            )}

            {reportFilters.reportType === 'detailed' && (
              <div className="detailed-report">
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Consignment</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Transport</th>
                      <th>Route</th>
                      <th>Created</th>
                      <th>ETA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.slice(0, 50).map(order => (
                      <tr key={order._id}>
                        <td>{order.consignment}</td>
                        <td>{order.companyName}</td>
                        <td>
                          <Badge bg={getStatusColor(order.progress)}>
                            {order.progress}
                          </Badge>
                        </td>
                        <td>{order.transport}</td>
                        <td>{order.origin} → {order.destination}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>
                          {order.shipmentTracking?.estimatedArrival 
                            ? formatDate(order.shipmentTracking.estimatedArrival)
                            : 'Not set'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {filteredOrders.length > 50 && (
                  <p className="text-muted text-center">
                    Showing first 50 of {filteredOrders.length} orders. Export for complete data.
                  </p>
                )}
              </div>
            )}

            <div className="report-footer mt-4">
              <small className="text-muted">
                Report generated on {new Date(reportData.generatedAt).toLocaleString()} | 
                Filters applied: {Object.values(reportFilters).filter(Boolean).length} active
              </small>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default OperationsReporting;
