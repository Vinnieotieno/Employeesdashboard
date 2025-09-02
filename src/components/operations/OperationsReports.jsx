import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert, Spinner } from 'react-bootstrap';
import { useGetOrdersQuery } from '../../state/servicesApiSlice';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './OperationsReports.scss';

// Icons
import GetAppIcon from '@mui/icons-material/GetApp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FilterListIcon from '@mui/icons-material/FilterList';

const OperationsReports = () => {
  const [reportFilters, setReportFilters] = useState({
    reportType: 'summary',
    dateFrom: '',
    dateTo: '',
    progress: '',
    format: 'json'
  });

  const [showReport, setShowReport] = useState(false);

  // API hook for getting orders data
  const {
    data: ordersData,
    isLoading,
    error,
    refetch
  } = useGetOrdersQuery();

  // Generate report data from orders
  const reportData = useMemo(() => {
    if (!ordersData || !showReport) return null;

    // Helper function to calculate average delivery time
    const calculateAverageDeliveryTime = (deliveredOrders) => {
      if (deliveredOrders.length === 0) return 0;

      const totalDays = deliveredOrders.reduce((sum, order) => {
        const deliveryDate = order.deliveryDate || order.updatedAt;
        if (deliveryDate && order.createdAt) {
          const diffTime = Math.abs(new Date(deliveryDate) - new Date(order.createdAt));
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }
        return sum;
      }, 0);

      return Math.round(totalDays / deliveredOrders.length);
    };

    // Filter orders based on current filters
    let filteredOrders = ordersData.filter(order => {
      // Only show approved orders
      if (order.status !== 'Approved') return false;

      // Apply progress filter
      if (reportFilters.progress && order.progress !== reportFilters.progress) return false;

      // Apply date filters
      if (reportFilters.dateFrom && new Date(order.createdAt) < new Date(reportFilters.dateFrom)) return false;
      if (reportFilters.dateTo && new Date(order.createdAt) > new Date(reportFilters.dateTo)) return false;

      return true;
    });

    const reportType = reportFilters.reportType;
    let data = {};

    if (reportType === 'summary') {
      // Summary report data
      const deliveredOrders = filteredOrders.filter(s => s.progress === 'Delivered');
      const pendingOrders = filteredOrders.filter(s => s.progress !== 'Delivered');

      data = {
        totalOrders: filteredOrders.length,
        byProgress: {
          initial: filteredOrders.filter(s => s.progress === 'Initial' || !s.progress).length,
          onTransit: filteredOrders.filter(s => s.progress === 'On Transit').length,
          arrived: filteredOrders.filter(s => s.progress === 'Arrived').length,
          clearance: filteredOrders.filter(s => s.progress === 'Clearance').length,
          delivery: filteredOrders.filter(s => s.progress === 'Delivery').length,
          delivered: deliveredOrders.length
        },
        deliveredOrders,
        pendingOrders,
        averageDeliveryTime: calculateAverageDeliveryTime(deliveredOrders)
      };
    } else if (reportType === 'detailed') {
      // Detailed report data
      data = {
        orders: filteredOrders.map(order => ({
          id: order._id,
          companyName: order.companyName,
          contactPerson: order.contactPerson,
          progress: order.progress,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          deliveryDate: order.deliveryDate,
          origin: order.origin,
          destination: order.destination,
          transport: order.transport,
          driver: order.driver
        }))
      };
    } else if (reportType === 'delivered') {
      // Delivered orders data
      const deliveredOrders = filteredOrders.filter(s => s.progress === 'Delivered');
      data = {
        totalDelivered: deliveredOrders.length,
        deliveredOrders: deliveredOrders.map(order => ({
          id: order._id,
          companyName: order.companyName,
          contactPerson: order.contactPerson,
          origin: order.origin,
          destination: order.destination,
          transport: order.transport,
          createdAt: order.createdAt,
          deliveryDate: order.deliveryDate || order.updatedAt,
          deliveredBy: { name: 'System' }
        }))
      };
    }

    return {
      success: true,
      reportType,
      dateRange: { from: reportFilters.dateFrom, to: reportFilters.dateTo },
      generatedAt: new Date(),
      data
    };
  }, [ordersData, reportFilters, showReport]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setReportFilters(prev => ({ ...prev, [field]: value }));
  };

  // Generate report
  const handleGenerateReport = () => {
    setShowReport(true);
    refetch();
  };

  // Export to Excel
  const exportToExcel = () => {
    if (!reportData?.data) return;

    let exportData = [];
    const reportType = reportFilters.reportType;

    if (reportType === 'summary') {
      // Summary report export
      exportData = [
        { Metric: 'Total Orders', Value: reportData.data.totalOrders },
        { Metric: 'Initial Orders', Value: reportData.data.byProgress.initial },
        { Metric: 'In Transit', Value: reportData.data.byProgress.onTransit },
        { Metric: 'Arrived', Value: reportData.data.byProgress.arrived },
        { Metric: 'Clearance', Value: reportData.data.byProgress.clearance },
        { Metric: 'Delivery', Value: reportData.data.byProgress.delivery },
        { Metric: 'Delivered', Value: reportData.data.byProgress.delivered },
        { Metric: 'Average Delivery Time (days)', Value: reportData.data.averageDeliveryTime }
      ];
    } else if (reportType === 'detailed') {
      // Detailed report export
      exportData = reportData.data.orders.map(order => ({
        'Order ID': order.id,
        'Company Name': order.companyName,
        'Contact Person': order.contactPerson,
        'Progress': order.progress,
        'Origin': order.origin,
        'Destination': order.destination,
        'Transport': order.transport,
        'Driver': order.driver || 'Not Assigned',
        'Created Date': format(new Date(order.createdAt), 'yyyy-MM-dd'),
        'Updated Date': format(new Date(order.updatedAt), 'yyyy-MM-dd'),
        'Delivery Date': order.deliveryDate ? format(new Date(order.deliveryDate), 'yyyy-MM-dd') : 'Not Delivered'
      }));
    } else if (reportType === 'delivered') {
      // Delivered orders export
      exportData = reportData.data.deliveredOrders.map(order => ({
        'Order ID': order.id,
        'Company Name': order.companyName,
        'Contact Person': order.contactPerson,
        'Origin': order.origin,
        'Destination': order.destination,
        'Transport': order.transport,
        'Created Date': format(new Date(order.createdAt), 'yyyy-MM-dd'),
        'Delivery Date': format(new Date(order.deliveryDate), 'yyyy-MM-dd'),
        'Delivered By': order.deliveredBy?.name || 'System'
      }));
    }

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Operations Report');

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const fileName = `operations-report-${reportType}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    saveAs(data, fileName);
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

  return (
    <Container fluid className="operations-reports">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="reports-title">
            <AssessmentIcon className="me-2" />
            Operations Reports
          </h2>
          <p className="text-muted">Generate comprehensive reports for operations tracking and analysis</p>
        </Col>
      </Row>

      {/* Report Filters */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <FilterListIcon className="me-2" />
            Report Filters
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Report Type</Form.Label>
                <Form.Select
                  value={reportFilters.reportType}
                  onChange={(e) => handleFilterChange('reportType', e.target.value)}
                >
                  <option value="summary">Summary Report</option>
                  <option value="detailed">Detailed Report</option>
                  <option value="delivered">Delivered Orders</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="date"
                  value={reportFilters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="date"
                  value={reportFilters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Progress Filter</Form.Label>
                <Form.Select
                  value={reportFilters.progress}
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
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>&nbsp;</Form.Label>
                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    onClick={handleGenerateReport}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <AssessmentIcon className="me-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                  {reportData && (
                    <Button 
                      variant="success" 
                      onClick={exportToExcel}
                    >
                      <GetAppIcon className="me-2" />
                      Export Excel
                    </Button>
                  )}
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="danger">
          Error generating report: {error?.data?.error || error.message}
        </Alert>
      )}

      {/* Report Results */}
      {reportData && (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              Report Results - {reportFilters.reportType.charAt(0).toUpperCase() + reportFilters.reportType.slice(1)}
            </h5>
            <small className="text-muted">
              <DateRangeIcon className="me-1" />
              Generated: {format(new Date(reportData.generatedAt), 'MMM dd, yyyy HH:mm')}
            </small>
          </Card.Header>
          <Card.Body>
            {reportFilters.reportType === 'summary' && (
              <SummaryReportView data={reportData.data} />
            )}
            {reportFilters.reportType === 'detailed' && (
              <DetailedReportView data={reportData.data} getProgressColor={getProgressColor} />
            )}
            {reportFilters.reportType === 'delivered' && (
              <DeliveredReportView data={reportData.data} />
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

// Summary Report View Component
const SummaryReportView = ({ data }) => {
  return (
    <div>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center summary-metric-card">
            <Card.Body>
              <h3 className="text-primary">{data.totalOrders}</h3>
              <p className="mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center summary-metric-card">
            <Card.Body>
              <h3 className="text-success">{data.byProgress.delivered}</h3>
              <p className="mb-0">Delivered</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center summary-metric-card">
            <Card.Body>
              <h3 className="text-warning">{data.pendingOrders.length}</h3>
              <p className="mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center summary-metric-card">
            <Card.Body>
              <h3 className="text-info">{data.averageDeliveryTime}</h3>
              <p className="mb-0">Avg. Delivery Days</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Progress Breakdown</h6>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Progress State</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Initial</td>
                    <td>{data.byProgress.initial}</td>
                    <td>{((data.byProgress.initial / data.totalOrders) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>On Transit</td>
                    <td>{data.byProgress.onTransit}</td>
                    <td>{((data.byProgress.onTransit / data.totalOrders) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>Arrived</td>
                    <td>{data.byProgress.arrived}</td>
                    <td>{((data.byProgress.arrived / data.totalOrders) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>Clearance</td>
                    <td>{data.byProgress.clearance}</td>
                    <td>{((data.byProgress.clearance / data.totalOrders) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>Delivery</td>
                    <td>{data.byProgress.delivery}</td>
                    <td>{((data.byProgress.delivery / data.totalOrders) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>Delivered</td>
                    <td>{data.byProgress.delivered}</td>
                    <td>{((data.byProgress.delivered / data.totalOrders) * 100).toFixed(1)}%</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Recent Deliveries</h6>
            </Card.Header>
            <Card.Body>
              {data.deliveredOrders.slice(0, 5).map(order => (
                <div key={order._id} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                  <div>
                    <strong>{order.companyName}</strong>
                    <br />
                    <small className="text-muted">{order.contactPerson}</small>
                  </div>
                  <div className="text-end">
                    <Badge bg="success">Delivered</Badge>
                    <br />
                    <small className="text-muted">
                      {order.deliveryDate ? format(new Date(order.deliveryDate), 'MMM dd') : 'N/A'}
                    </small>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Detailed Report View Component
const DetailedReportView = ({ data, getProgressColor }) => {
  return (
    <div className="table-responsive">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Company</th>
            <th>Contact</th>
            <th>Progress</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Transport</th>
            <th>Driver</th>
            <th>Created</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {data.orders.map(order => (
            <tr key={order.id}>
              <td>
                <code>{order.id.slice(-8)}</code>
              </td>
              <td>{order.companyName}</td>
              <td>{order.contactPerson}</td>
              <td>
                <Badge bg={getProgressColor(order.progress)}>
                  {order.progress}
                </Badge>
              </td>
              <td>{order.origin}</td>
              <td>{order.destination}</td>
              <td>{order.transport}</td>
              <td>{order.driver || 'Not Assigned'}</td>
              <td>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</td>
              <td>{format(new Date(order.updatedAt), 'MMM dd, yyyy')}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {data.orders.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted">No orders found for the selected criteria.</p>
        </div>
      )}
    </div>
  );
};

// Delivered Report View Component
const DeliveredReportView = ({ data }) => {
  return (
    <div>
      <div className="mb-3">
        <h6>Total Delivered Orders: <Badge bg="success">{data.totalDelivered}</Badge></h6>
      </div>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Company</th>
              <th>Contact</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Transport</th>
              <th>Created</th>
              <th>Delivered</th>
              <th>Delivered By</th>
            </tr>
          </thead>
          <tbody>
            {data.deliveredOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <code>{order.id.slice(-8)}</code>
                </td>
                <td>{order.companyName}</td>
                <td>{order.contactPerson}</td>
                <td>{order.origin}</td>
                <td>{order.destination}</td>
                <td>{order.transport}</td>
                <td>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</td>
                <td>
                  <Badge bg="success">
                    {format(new Date(order.deliveryDate), 'MMM dd, yyyy')}
                  </Badge>
                </td>
                <td>{order.deliveredBy?.name || 'System'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {data.deliveredOrders.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted">No delivered orders found for the selected criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationsReports;
